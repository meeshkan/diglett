import { ISerializedRequest } from "../types";
import { ISerializedResponse } from ".";
import debug from "debug";

const debugLog = debug("api-hitter:request-sender");

export const sendRequest = (request: ISerializedRequest): Promise<ISerializedResponse> => {
  return Promise.resolve({ code: 200 });
};

export const fakeSendRequest = async (req: ISerializedRequest): Promise<ISerializedResponse> => {
  debugLog(`Faking sending request: ${JSON.stringify(req)}`);
  return Promise.resolve({ code: 200 });
};
