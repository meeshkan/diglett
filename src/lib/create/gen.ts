import { flatten, fromPairs } from "lodash";
import { RequestTemplate, ISerializedRequest, isProtocol } from "./types";
import * as url from "url";
import * as jsst from "json-schema-strictly-typed";
import { RequestSchema } from "./types";
import { Schema } from "loas3/dist/generated/full";

/**
 * Find parameters from path.
 * Example: /v1/pets/{petId}/{id} => ["petId", "id"]
 */
export const findParameters = (s: string): string[] => {
  const pattern = /(?:\/{(\w+)})/g;
  let match = pattern.exec(s);
  const matches = [];
  while (match != null) {
    matches.push(match[1]);
    match = pattern.exec(s);
  }
  return matches;
};

const gen = (template: RequestTemplate): RequestSchema[] => {
  return flatten(
    template.servers.map(server => {
      const serverUrl = url.parse(server.url); // TODO
      const path = serverUrl.path + template.path;

      const trimmedProtocol = (serverUrl.protocol && serverUrl.protocol.replace(":", "")) || "";

      const protocol = (isProtocol(trimmedProtocol) && trimmedProtocol) || "https";

      const pathParameters = findParameters(path);

      const parameters = fromPairs(
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
          path,
          pathname: path, // TODO Fill in parameters
          protocol,
          query: {}, // TODO Fill in
          body: undefined, // TODO  Fill in
        },
        parameters, // TODO Resolve and update
      };
      return requestSchema;
    })
  );
};

export default gen;
