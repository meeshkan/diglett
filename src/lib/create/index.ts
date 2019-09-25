import chalk from "chalk";
import debug from "debug";
import * as fs from "fs";
import * as $RefParser from "json-schema-ref-parser";
import { flatten } from "lodash";
import * as path from "path";
import {
  isParameter,
  isOpenAPIObject,
  OpenAPIObject,
  Operation,
  PathItem,
  Parameter,
  Reference,
  RequestBody,
  Server,
} from "loas3/dist/generated/full";
import * as types from "./types";
import { Fold, Iso, Lens, Optional, Prism, Traversal, fromTraversable } from "monocle-ts";
import { array, getMonoid } from "fp-ts/lib/Array";

export interface CreateResult {}

// "Operation"
export type PartialRequestTemplate = {
  method: types.HTTPMethod;
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

const debugLog = debug("api-client:scrape");

export function parseRequest(op: {
  name: types.HTTPMethod;
  operation: Operation;
  pathItem: PathItem;
  pathName: string;
}): PartialRequestTemplate {
  const parameters = (op.operation.parameters || []) as Parameter[];
  const requestBody = op.operation.requestBody;
  const servers = op.operation.servers || [];
  return {
    body: requestBody as RequestBody | undefined,
    method: op.name,
    parameters,
    servers,
  };
}

export const extractOpsForPath = ({
  pathItem,
  pathName,
}: {
  pathItem: PathItem;
  pathName: string;
}): PartialRequestTemplate[] => {
  const ops = Object.keys(pathItem);

  if (ops.length === 0) {
    debugLog(`No operations`);
    return [];
  }
  const operations = types.RESTMethodTypes.map(opName => ({ name: opName, operation: pathItem[opName] })).filter(
    op => typeof op.operation !== "undefined"
  ) as { name: types.HTTPMethod; operation: Operation }[];

  debugLog("Operations", operations);

  return operations.map(op => parseRequest({ ...op, pathItem, pathName }));
};

const serversO: Optional<OpenAPIObject, Server[]> = Optional.fromNullableProp<OpenAPIObject>()("servers");

const recordToArrayI = <T>(): Iso<Record<string, T>, Array<[string, T]>> =>
  new Iso<Record<string, T>, Array<[string, T]>>(
    s => Object.entries(s),
    a => a.reduce((q, r) => ({ ...q, [r[0]]: r[1] }), {})
  );

type PathName = string;

const pathsT: Traversal<OpenAPIObject, [PathName, PathItem]> = Lens.fromProp<OpenAPIObject>()("paths")
  .composeIso(recordToArrayI<PathItem>())
  .composeTraversal(fromTraversable(array)<[PathName, PathItem]>());

export const extractOps = (openapi: OpenAPIObject): RequestTemplate[] => {
  const servers = serversO
    .composeTraversal(fromTraversable(array)<Server>())
    .asFold()
    .getAll(openapi);

  if (servers.length === 0) {
    throw Error(`No servers in specification`);
  }

  const arrayT = fromTraversable(array);

  /**
   * A bit ridiculous way to get `parameters` from `pathItem` :D
   */
  const parametersF: Fold<PathItem, Parameter> = Optional.fromNullableProp<PathItem>()("parameters")
    .composeTraversal(arrayT())
    .composePrism(Prism.fromPredicate<Parameter | Reference, Parameter>(isParameter)) // No references expected
    .asFold();

  const templates: RequestTemplate[] = pathsT.asFold().foldMap(getMonoid<RequestTemplate>())(([pathName, pathItem]) => {
    const templatesForPath = extractOpsForPath({ pathName, pathItem });
    /**
     * Add servers and parameters from top-levels
     */
    const filled: RequestTemplate[] = templatesForPath.map(op => ({
      ...op,
      path: pathName,
      parameters: parametersF.getAll(pathItem).concat(...op.parameters),
      servers: op.servers.concat(...servers),
    }));
    return filled;
  })(openapi);

  return templates;
};

export const readOpenAPI = async (openapiPath: string): Promise<OpenAPIObject> => {
  const fullPath = path.resolve(process.cwd(), openapiPath);

  if (!fs.existsSync(fullPath)) {
    throw Error(`File not found: ${chalk.bold.magenta(fullPath)}`);
  }

  const extension = path.extname(fullPath);

  if (!/ya?ml/.test(extension)) {
    throw Error(`Found extension ${extension}, expected y(a)ml.`);
  }

  const parsed = await $RefParser.parse(fullPath);
  const schema = await $RefParser.dereference(parsed);

  if (!isOpenAPIObject(schema)) {
    throw Error(`Not an OpenAPI object`);
  }

  return schema;
};

const scrape = async (openapiPath: string, config: any): Promise<CreateResult[]> => {
  const openapi = await readOpenAPI(openapiPath);
  debugLog("Got OpenAPI", JSON.stringify(openapi));

  const requestTemplates = extractOps(openapi);

  return requestTemplates;
};

export default scrape;