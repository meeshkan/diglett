import { RequestsTemplate, ParameterSchema } from "../templates/types";
import { ISerializedRequest } from "../types";
import { fromPairs } from "lodash";
import debug from "debug";
import * as jsYaml from "js-yaml";
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import { RequestBody } from "loas3/dist/generated/full";
// @ts-ignore
import * as jsf from "json-schema-faker";

const debugLog = debug("api-hitter:requests");

const readTemplate = (path: string) => {
  if (!fs.existsSync(path)) {
    throw Error(`File not found: ${path}`);
  }
  return jsYaml.safeLoad(fs.readFileSync(path).toString());
};

const generateValue = (parameter: ParameterSchema): any => {
  debugLog(`Generating value from: ${JSON.stringify(parameter)}`);
  return jsf.generate(parameter.schema);
};

const generateBody = (body: RequestBody): any => {
  const applicationJsonContent = body.content["application/json"];
  if (!applicationJsonContent) {
    throw Error(`No application/json found: ${JSON.stringify(body)}`);
  }
  const generated = jsf.generate(applicationJsonContent.schema);
  debugLog(`Generating body: ${JSON.stringify(generated)}`);
  if (typeof generated === "object") {
    return JSON.stringify(generated);
  }
  return generated;
};

nunjucks.configure({ autoescape: true });

/**
 * Render all values of an object, including nested
 * @param obj
 * @param context
 */
export const renderObject = (obj: any, context: any): any => {
  return fromPairs(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "object") {
        return [key, renderObject(value, context)];
      }
      if (typeof value === "string") {
        return [key, nunjucks.renderString(value, context)];
      }

      return [key, value];
    })
  );
};

export function* generate(requestsTemplate: RequestsTemplate): IterableIterator<ISerializedRequest> {
  for (const template of requestsTemplate.templates) {
    const nunjucksTemplate = template.req;
    const parameters = template.parameters;

    // Generate value for every parameter
    const nunjucksContext = fromPairs(
      Object.entries(parameters).map(([parameter, schema]) => [parameter, generateValue(schema)])
    );

    // const bodyContext = template.body ? { body: generateBody(template.body) } : {};
    // const fullContext = { ...nunjucksContext, ...bodyContext };
    const fullContext = nunjucksContext;

    // Render every field with nunjucks if they're strings
    // TODO Handle nested values
    const rendered = renderObject(nunjucksTemplate, fullContext) as ISerializedRequest;

    // Hack to set body directly without nunjucks, JSONs just don't work nicely...
    if (template.body) {
      rendered.body = generateBody(template.body);
    }

    yield rendered;
  }
}

export const generateArray = (pathOrRequestsTemplate: string | RequestsTemplate): ISerializedRequest[] => {
  const template =
    typeof pathOrRequestsTemplate === "string" ? readTemplate(pathOrRequestsTemplate) : pathOrRequestsTemplate;

  const generator = generate(template);

  return Array.from(generator);
};

export default generateArray;
