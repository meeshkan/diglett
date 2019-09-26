import { flatten, fromPairs } from "lodash";
import { RequestTemplate, isProtocol } from "./types";
import * as url from "url";
import { RequestSchema } from "./types";
import { isSchema, Schema } from "loas3/dist/generated/full";

const PATH_PARAMETER_PATTERN = /(?:\/(?:{(\w+)}|:(\w+)))/g;

/**
 * Find parameters from path and replace the string with jinja format
 * Example: /v1/pets/{petId}/{id} => ["petId", "id"]
 */
export const pathToJinja = (path: string): { path: string; parameters: string[] } => {
  let match = PATH_PARAMETER_PATTERN.exec(path);
  const matches = [];
  let outPath = path;
  while (match != null) {
    const param = match[1] || match[2]; // Eww hack, I'm so bad at regex
    matches.push(param);
    outPath = outPath.replace(match[0], `/{{ ${param} }}`);
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

      const queryParameterToSchema = fromPairs(
        template.parameters
          .filter(parameter => parameter.in === "query")
          .map(param => {
            const schema = param.schema;
            if (!isSchema(schema)) {
              throw Error(`Not a schema: ${JSON.stringify(schema)}`);
            }
            return [param.name, { required: param.required || false, schema }];
          })
      );

      const pathParameterToSchema = fromPairs(
        pathParameters.map(parameter => {
          const param = template.parameters.find(param => param.name === parameter);
          if (!param) {
            throw Error(`No parameter found for ${parameter}`);
          }

          if (!param.schema) {
            throw Error(`No schema found for ${parameter}`);
          }

          // Tweak schema
          const pathParamSchema = param.schema;
          if (!isSchema(pathParamSchema)) {
            throw Error(`Not a schema: ${JSON.stringify(pathParamSchema)}`);
          }

          const schemaWithPattern = pathParamSchema.pattern
            ? pathParamSchema
            : { ...pathParamSchema, pattern: "^\\w+$" };

          return [
            parameter,
            {
              required: param.required || true, // Path parameters always required
              schema: schemaWithPattern,
            },
          ];
        })
      );

      const query = fromPairs(Object.keys(queryParameterToSchema).map(key => [key, `{{ ${key} }}`]));

      const queryParameter: string =
        Object.keys(query).length === 0
          ? ""
          : "?" +
            Object.entries(query)
              .map(([key, value]) => `${key}=${value}`)
              .join("&");

      const requestSchema: RequestSchema = {
        req: {
          method: template.method,
          host: serverUrl.hostname!,
          path: cleanPath + queryParameter,
          pathname: cleanPath,
          protocol,
          query,
          body: undefined, // TODO  Fill in
        },
        parameters: {
          ...pathParameterToSchema,
          ...queryParameterToSchema,
        },
      };
      return requestSchema;
    })
  );
};

export default gen;
