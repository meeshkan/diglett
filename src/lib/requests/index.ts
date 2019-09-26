import { RequestsTemplate, ISerializedRequest } from "../templates/types";

export function* generate(requestsTemplate: RequestsTemplate): IterableIterator<ISerializedRequest> {
  for (const req of requestsTemplate.templates) {
    yield req.req; // TODO Fill in etc.
  }
}

export const generateArray = (requestsTemplate: RequestsTemplate): ISerializedRequest[] => {
  const generator = generate(requestsTemplate);

  return Array.from(generator);
};

export default generateArray;
