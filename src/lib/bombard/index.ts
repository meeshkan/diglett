import { ISerializedRequest } from "../types";

export interface ISerializedResponse {
  code: number;
}

export type RequestResponsePair = {
  req: ISerializedRequest;
  res: ISerializedResponse;
};

const bombard = (requests: ISerializedRequest[], config: any): RequestResponsePair[] => {
  return [];
};

export default bombard;
