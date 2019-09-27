import { Parameter, RequestBody, Schema, Server } from "loas3/dist/generated/full";
import { HTTPMethod, ISerializedRequest } from "../types";

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

export type RequestsTemplate = { defaults: Partial<ISerializedRequest>; templates: RequestSchema[] };

export interface ParameterSchema {
  required: boolean;
  schema: Schema;
}

export type RequestSchema = {
  req: ISerializedRequest;
  parameters: Record<string, ParameterSchema>;
  body?: RequestBody;
};
