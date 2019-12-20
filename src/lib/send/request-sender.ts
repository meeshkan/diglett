import { ISerializedRequest, ISerializedResponse } from "../types";
import debug from "debug";
import { fetch, Headers } from "../fetch-types";

const debugLog = debug("diglett:request-sender");

/**
 * Build a `Headers` object from request headers.
 * @param request Serialized request.
 */
export const buildHeaders = (request: ISerializedRequest): Headers => {
  const headers = new Headers();
  if (typeof request.headers !== "undefined") {
    Object.entries(request.headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        headers.append(key, value);
      } else if (Array.isArray(value)) {
        headers.append(key, value.join(","));
      }
    });
  }
  return headers;
};

/**
 * Create a `Fetch` API compliant request from {@link ISerializedRequest}.
 * @param request Serialized request.
 * @returns URL and init.
 */
export const prepareFetch = (request: ISerializedRequest): [RequestInfo, RequestInit] => {
  const url = `${request.protocol}://${request.host}${request.path}`;
  const headers = buildHeaders(request);
  const stringBody = typeof request.body === "object" ? JSON.stringify(request.body) : request.body;
  return [url, { method: request.method, headers, body: stringBody }];
};

/**
 * Send a serialized request with `fetch`.
 * @param request Serialized request.
 */
export const sendRequest = async (request: ISerializedRequest): Promise<ISerializedResponse> => {
  const [url, init] = prepareFetch(request);
  try {
    debugLog("Sending request", JSON.stringify(url), JSON.stringify(init));
    const response = await fetch(url, init);
    const statusCode = response.status;
    const text = await response.text();
    const headers = {}; // TODO
    return {
      statusCode,
      body: text,
      headers,
    };
  } catch (err) {
    debugLog("Failed sending request", err);
    throw err;
  }
};

export const fakeSendRequest = async (req: ISerializedRequest): Promise<ISerializedResponse> => {
  debugLog("Serialized request", JSON.stringify(req));
  const [url, init] = prepareFetch(req);
  debugLog("Faking sending request", JSON.stringify(url), JSON.stringify(init));
  return Promise.resolve({ statusCode: 200, body: '{ "message": "ok" }', headers: {} });
};
