const RESTMethodTypes = ["get", "head", "post", "put", "patch", "delete", "options", "trace"] as const;

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
