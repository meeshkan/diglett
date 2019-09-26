import { RequestsTemplate, ISerializedRequest } from "../templates/types";
import * as jsYaml from "js-yaml";
import * as fs from "fs";

const readTemplate = (path: string) => {
  if (!fs.existsSync(path)) {
    throw Error(`File not found: ${path}`);
  }
  return jsYaml.safeLoad(fs.readFileSync(path).toString());
};

export function* generate(requestsTemplate: RequestsTemplate): IterableIterator<ISerializedRequest> {
  for (const req of requestsTemplate.templates) {
    yield req.req; // TODO Fill in etc.
  }
}

export const generateArray = (pathOrRequestsTemplate: string | RequestsTemplate): ISerializedRequest[] => {
  const template =
    typeof pathOrRequestsTemplate === "string" ? readTemplate(pathOrRequestsTemplate) : pathOrRequestsTemplate;

  const generator = generate(template);

  return Array.from(generator);
};

export default generateArray;
