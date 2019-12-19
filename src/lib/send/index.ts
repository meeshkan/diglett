import { ISerializedRequest } from "../types";
import { RequestQueueSender } from "./request-queue";
import debug from "debug";
import { isLeft } from "fp-ts/lib/Either";
import { readJsonl, readYaml } from "../utils";
import { TaskEither, map as mapTe, mapLeft } from "fp-ts/lib/TaskEither";
import { Task } from "fp-ts/lib/Task";
import { fakeSendRequest } from "./request-sender";
import { IIncomingHeaders } from "../types";
import Send from "../../commands/send";

const debugLog = debug("diglett:bombard");

export interface ISerializedResponse {
  code: number;
  body?: string;
}

export type RequestResponsePair = {
  req: ISerializedRequest;
  res: ISerializedResponse;
};

export type FailedRequest = {
  req: ISerializedRequest;
  err: Error;
};

export interface BombardResult {
  failed: Array<FailedRequest>;
  succeeded: Array<RequestResponsePair>;
}

export const bombardFp = (requests: ISerializedRequest[], config: SendOptions): Task<BombardResult> => {
  debugLog(`Sending ${requests.length} requests`);
  const sendRequest = config.sendRequest;
  const batchSender = new RequestQueueSender(sendRequest);
  const taskEithers: TaskEither<Error, ISerializedResponse>[] = batchSender.sendBatchFp(requests);
  const results: TaskEither<FailedRequest, RequestResponsePair>[] = taskEithers
    .map((taskEither, i) => mapLeft((e: Error) => ({ req: requests[i], err: e }))(taskEither))
    .map((taskEither, i) => mapTe((res: ISerializedResponse) => ({ req: requests[i], res }))(taskEither));

  // Super hacky way to collect results until I'm better at fp-ts :D
  // Should do some kind of traverse instead
  return () =>
    new Promise(async (resolve, reject) => {
      try {
        const eithers = await Promise.all(results.map(taskEither => taskEither()));

        const result = eithers.reduce(
          (acc, val) => {
            if (isLeft(val)) {
              return { ...acc, failed: acc.failed.concat(val.left) };
            }
            return { ...acc, succeeded: acc.succeeded.concat(val.right) };
          },
          { succeeded: [] as RequestResponsePair[], failed: [] as FailedRequest[] }
        );
        batchSender.stop();
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        batchSender.stop();
      }
    });
};

interface SendOptions {
  sendRequest: (req: ISerializedRequest) => Promise<ISerializedResponse>;
  headers: IIncomingHeaders;
}

export const resolveConfig = (configOpt?: Partial<SendOptions>): SendOptions => {
  const defaults = {
    sendRequest: fakeSendRequest,
    headers: {},
  };

  return configOpt ? { ...defaults, ...configOpt } : defaults;
};

export const send = async (
  requests: ISerializedRequest[],
  configOpt?: Partial<SendOptions>
): Promise<RequestResponsePair[]> => {
  const config = resolveConfig(configOpt);

  const headers = config.headers ? config.headers : {};

  const augmentedRequests = requests.map(req => addHeaders(req, headers));

  console.log("Augmented", augmentedRequests);

  const results = await bombardFp(augmentedRequests, config)();

  // TODO More graceful handling of successes and failures
  if (results.failed.length > 0) {
    throw Error(`Failed: ${results.failed.map(err => err.err.message).join(", ")}`);
  }

  return results.succeeded;
};

const addHeaders = (req: ISerializedRequest, headers: IIncomingHeaders): ISerializedRequest => {
  debugLog("Adding headers", headers);
  const existingHeaders = req.headers || {};
  // TODO
  const merged = { ...existingHeaders, ...headers };
  return { ...req, headers: merged };
};

export const sendFromFile = async (path: string, configOpt?: Partial<SendOptions>): Promise<RequestResponsePair[]> => {
  if (!(path.endsWith(".yaml") || path.endsWith(".jsonl"))) {
    throw Error(`Unknown requests file format ${path}`);
  }

  const requests: ISerializedRequest[] = path.endsWith(".yaml") ? readYaml(path) : readJsonl(path);
  return send(requests, configOpt);
};
