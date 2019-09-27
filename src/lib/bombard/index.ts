import { ISerializedRequest } from "../types";
import { BatchSender } from "./request-sender";
import debug from "debug";
import { Either, either, isLeft } from "fp-ts/lib/Either";
import { array, zip } from "fp-ts/lib/Array";
import { readYaml } from "../utils";

const debugLog = debug("api-hitter:bombard");

export interface ISerializedResponse {
  code: number;
}

export type RequestResponsePair = {
  req: ISerializedRequest;
  res: ISerializedResponse;
};

export const send = async (req: ISerializedRequest): Promise<ISerializedResponse> => {
  debugLog(`Faking sending request: ${JSON.stringify(req)}`);
  return Promise.resolve({ code: 200 });
};

export const bombard = async (requests: ISerializedRequest[], config: any): Promise<RequestResponsePair[]> => {
  debugLog(`Sending ${requests.length} requests`);
  const requestSender = new BatchSender(send);
  const responses: Array<Either<Error, ISerializedResponse>> = await requestSender.sendBatch(requests);
  requestSender.stop();
  const collect: Either<Error, ISerializedResponse[]> = array.sequence(either)(responses);
  if (isLeft(collect)) {
    throw collect.left; // TODO More graceful handling of errors
  }
  return zip(requests, collect.right).map(([req, res]) => ({ req, res }));
};

export const bombardFromFile = async (path: string): Promise<RequestResponsePair[]> => {
  const requests = readYaml(path);
  // TODO Validate requests
  return bombard(requests, {});
};

export default bombardFromFile;
