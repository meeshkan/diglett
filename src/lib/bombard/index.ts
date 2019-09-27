import { ISerializedRequest } from "../types";
import { BatchSender } from "./request-sender";
import debug from "debug";
import { Either, either, isLeft } from "fp-ts/lib/Either";
import { array, zip } from "fp-ts/lib/Array";
import { readYaml } from "../utils";
import { TaskEither, ap, map as mapTe, mapLeft, taskEither, fold } from "fp-ts/lib/TaskEither";
import { Task, task } from "fp-ts/lib/Task";

const debugLog = debug("api-hitter:bombard");

export interface ISerializedResponse {
  code: number;
}

export type RequestResponsePair = {
  req: ISerializedRequest;
  res: ISerializedResponse;
};

export type FailedRequest = {
  req: ISerializedRequest;
  err: Error;
};

export const fakeSendRequest = async (req: ISerializedRequest): Promise<ISerializedResponse> => {
  debugLog(`Faking sending request: ${JSON.stringify(req)}`);
  return Promise.resolve({ code: 200 });
};

/* export const bombardFp = (
  requests: ISerializedRequest[],
  config: any
): Task<[Array<FailedRequest>, Array<RequestResponsePair>]> => {
  debugLog(`Sending ${requests.length} requests`);
  const requestSender = new BatchSender(send);
  const taskEithers: TaskEither<Error, ISerializedResponse>[] = requestSender.sendBatchFp(requests);
  const results: TaskEither<FailedRequest, RequestResponsePair>[] = taskEithers
    .map((taskEither, i) => mapLeft((e: Error) => ({ req: requests[i], err: e }))(taskEither))
    .map((taskEither, i) => mapTe((res: ISerializedResponse) => ({ req: requests[i], res }))(taskEither));

  // Super hacky way to collect results until I'm better at fp-ts :D
  const failedRequests: FailedRequest[] = [];
  const successes: ISerializedResponse[] = [];
  const res = [failedRequests, successes];
  results.forEach(() => {
    fold<FailedRequest, ISerializedResponse, number>(
      (failed: FailedRequest) => {
        failedRequests.push(failed);
        return () => Promise.resolve(1);
      },
      (val: ISerializedResponse) => {
        successes.push(val);
        return () => Promise.resolve(1);
      }
    )(taskEither);
  });

  return () =>
    new Promise((resolve, reject) => {
      return;
    });
}; */

interface BombardOptions {
  sendRequest?: (req: ISerializedRequest) => Promise<ISerializedResponse>;
}

export const bombard = async (
  requests: ISerializedRequest[],
  config?: BombardOptions
): Promise<RequestResponsePair[]> => {
  debugLog(`Sending ${requests.length} requests`);
  const sendRequest = (config && config.sendRequest) || fakeSendRequest;
  const batchSender = new BatchSender(sendRequest);
  try {
    const batchResult: Either<Error, ISerializedResponse>[] = await batchSender.sendBatch(requests);
    const collect: Either<Error, ISerializedResponse[]> = array.sequence(either)(batchResult);
    if (isLeft(collect)) {
      throw collect.left; // TODO More graceful handling of errors
    }
    return zip(requests, collect.right).map(([req, res]) => ({ req, res }));
  } catch (err) {
    throw err;
  } finally {
    await batchSender.stop();
  }
};

export const bombardFromFile = async (path: string): Promise<RequestResponsePair[]> => {
  const requests = readYaml(path);
  // TODO Validate requests
  return bombard(requests, {});
};

export default bombardFromFile;
