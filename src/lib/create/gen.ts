import { flatten, fromPairs } from "lodash";
import { RequestTemplate, isProtocol } from "./types";
import * as url from "url";
import { RequestSchema } from "./types";
import { Schema } from "loas3/dist/generated/full";

const PATH_PARAMETER_PATTERN = /(?:\/{(\w+)})/g;

/**
 * Find parameters from path and replace the string with jinja format
 * Example: /v1/pets/{petId}/{id} => ["petId", "id"]
 */
export const pathToJinja = (path: string): { path: string; parameters: string[] } => {
  let match = PATH_PARAMETER_PATTERN.exec(path);
  const matches = [];
  let outPath = path;
  while (match != null) {
    matches.push(match[1]);
    outPath = outPath.replace(match[0], `/{{ ${match[1]} }}`);
    match = PATH_PARAMETER_PATTERN.exec(path);
  }
  return { path: outPath, parameters: matches };
};

const gen = (template: RequestTemplate): RequestSchema[] => {
  return flatten(
    template.servers.map(server => {
      const serverUrl = url.parse(server.url); // TODO
      const path = serverUrl.path + template.path;

      const trimmedProtocol = (serverUrl.protocol && serverUrl.protocol.replace(":", "")) || "";

      const protocol = (isProtocol(trimmedProtocol) && trimmedProtocol) || "https";

      const { path: cleanPath, parameters: pathParameters } = pathToJinja(path);

      const parameterNameToSchema = fromPairs(
        pathParameters.map(parameter => {
          const param = template.parameters.find(param => param.name === parameter);
          if (!param) {
            throw Error(`No parameter found for ${parameter}`);
          }

          if (!param.schema) {
            throw Error(`No schema found for ${parameter}`);
          }

          return [
            parameter,
            {
              required: param.required || false,
              schema: param.schema as Schema,
            },
          ];
        })
      );

      const requestSchema: RequestSchema = {
        req: {
          method: template.method,
          host: serverUrl.hostname!,
          path: cleanPath,
          pathname: cleanPath,
          protocol,
          query: {}, // TODO Fill in
          body: undefined, // TODO  Fill in
        },
        parameters: parameterNameToSchema,
      };
      return requestSchema;
    })
  );
};

export default gen;
