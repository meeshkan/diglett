import { Parameter, RequestBody, Schema, Server } from "loas3/dist/generated/full";

export const RESTMethodTypes = ["get", "head", "post", "put", "patch", "delete", "options", "trace"] as const;

export type HTTPMethod = typeof RESTMethodTypes[number];

/**
 * Analogous to `IncomingHttpHeaders` in @types/node.
 * Header names are expected to be _lowercased_.
 */
export interface IIncomingHeaders {
  [header: string]: string | string[] | undefined;
}

/**
 * Analogous to `OutgoingHttpHeaders` in @types/node.
 * Allows numbers as they are converted to strings internally.
 */
export interface IOutgoingHeaders {
  [header: string]: string | string[] | number | undefined;
}

export interface IIncomingQuery {
  [key: string]: string | string[] | undefined;
}

export type IProtocol = "http" | "https";

export const isProtocol = (s: string): s is IProtocol => {
  return /https?/.test(s);
};

export interface ISerializedRequest {
  body?: string | object;
  headers?: IIncomingHeaders;
  host: string;
  method: HTTPMethod;
  /**
   * Full path containing query parameters
   */
  path: string;
  /**
   * Path name not containing query parameters
   */
  pathname: string;
  /**
   * Query parameters
   */
  query: IIncomingQuery;
  protocol: IProtocol;
}

// "Operation"
export type PartialRequestTemplate = {
  method: HTTPMethod;
  body?: RequestBody;
  parameters: Parameter[];
  servers: Server[];
};

/**
 * A template for creating requests, operation plus top-level stuff
 */
export type RequestTemplate = PartialRequestTemplate & {
  path: string;
};

export type CreateResult = { defaults: Partial<ISerializedRequest>; templates: RequestSchema[] };

export interface ParameterSchema {
  required: boolean;
  schema: Schema;
}

export const exampleSchema: RequestSchema = {
  req: {
    method: "get",
    host: "petstore.swagger.io",
    protocol: "https",
    path: "/v1/pets/{petId}",
    pathname: "/v1/pets/{petId}",
    query: {},
  },

  parameters: {
    petId: {
      required: true,
      schema: {
        type: "string",
      },
    },
  },
};

export type RequestSchema = { req: ISerializedRequest; parameters: Record<string, ParameterSchema> };
