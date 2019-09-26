import { RequestsTemplate, ISerializedRequest, ParameterSchema } from "../templates/types";
import { fromPairs } from "lodash";
import * as jsYaml from "js-yaml";
import * as fs from "fs";
import * as nunjucks from "nunjucks";

const readTemplate = (path: string) => {
  if (!fs.existsSync(path)) {
    throw Error(`File not found: ${path}`);
  }
  return jsYaml.safeLoad(fs.readFileSync(path).toString());
};

const generateValue = (parameter: ParameterSchema): any => {
  return "fake";
};

nunjucks.configure({ autoescape: true });

export function* generate(requestsTemplate: RequestsTemplate): IterableIterator<ISerializedRequest> {
  for (const template of requestsTemplate.templates) {
    const nunjucksTemplate = template.req;
    const parameters = template.parameters;
    const nunjucksContext = fromPairs(
      Object.entries(parameters).map(([parameter, schema]) => [parameter, generateValue(schema)])
    );
    const rendered = nunjucks.renderString(JSON.stringify(nunjucksTemplate), nunjucksContext);
    yield JSON.parse(rendered);
  }
}

export const generateArray = (pathOrRequestsTemplate: string | RequestsTemplate): ISerializedRequest[] => {
  const template =
    typeof pathOrRequestsTemplate === "string" ? readTemplate(pathOrRequestsTemplate) : pathOrRequestsTemplate;

  const generator = generate(template);

  return Array.from(generator);
};

export default generateArray;
