import { ISerializedRequest } from "../types";
import { ISerializedResponse } from ".";
import debug from "debug";
import * as BetterQueue from "better-queue";
import { Either, toError } from "fp-ts/lib/Either";
import { map, taskEither, TaskEither, tryCatch } from "fp-ts/lib/TaskEither";
import { array } from "fp-ts/lib/array";

const debugLog = debug("api-hitter:request-sender");

export class RequestQueue<I, O> {
  private readonly queue: BetterQueue;
  private static config = { afterProcessDelay: 5000 };
  constructor(processTask: (i: I) => Promise<O>) {
    const processFn: BetterQueue.ProcessFunction<I, O> = async (task: I, cb: (error?: any, result?: O) => void) => {
      try {
        debugLog(`Processing task: ${JSON.stringify(task)}`);
        const result = await processTask(task);
        debugLog(`Processed task: ${JSON.stringify(task)}`);
        cb(null, result);
      } catch (err) {
        debugLog(`Failed processing task: ${JSON.stringify(task)}, error: ${err.message}`);
        cb(err);
      }
    };
    this.queue = new BetterQueue<I, O>({ process: processFn, ...RequestQueue.config });
  }

  async push(i: I): Promise<O> {
    return new Promise((resolve, reject) => {
      this.queue
        .push(i)
        .on("failed", (err: any) => {
          reject(err);
        })
        .on("finish", (result: O) => {
          resolve(result);
        });
    });
  }

  async stop() {
    return new Promise<void>(resolve => {
      this.queue.destroy(resolve);
    });
  }
}

export class BatchSender {
  private readonly queue: RequestQueue<ISerializedRequest, ISerializedResponse>;
  constructor(send: (req: ISerializedRequest) => Promise<ISerializedResponse>) {
    this.queue = new RequestQueue(send);
  }

  async send(req: ISerializedRequest): Promise<ISerializedResponse> {
    debugLog(`Sending request: ${JSON.stringify(req)}`);
    return Promise.resolve({ code: 200 });
  }

  /**
   * Get array of tasks for sending request-response pairs.
   * Tasks are not squashed into `TaskEither<Error, Array<ISerializedResponse>>`
   * to ensure the tasks can be easily linked to the corresponding requests.
   * @param reqs Requests to send
   * @return Array of tasks
   */
  sendBatchFp(reqs: ISerializedRequest[]): Array<TaskEither<Error, ISerializedResponse>> {
    return reqs.map((req: ISerializedRequest) => tryCatch(() => this.queue.push(req), toError));
  }

  async sendBatch(reqs: ISerializedRequest[]): Promise<Array<Either<Error, ISerializedResponse>>> {
    const tasks = this.sendBatchFp(reqs);
    return Promise.all(tasks.map(task => task()));
  }

  async stop() {
    await this.queue.stop();
  }
}
