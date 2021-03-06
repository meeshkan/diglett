import { send, sendFromFile } from "../../../lib/send";
import { ISerializedRequest } from "../../../lib/types";
import * as path from "path";

const REQUESTS_JSONL = path.resolve(__dirname, "..", "..", "..", "..", "requests", "petstore-requests.jsonl");

const req: ISerializedRequest = {
  host: "example.com",
  method: "get",
  path: "/v1",
  pathname: "/v1",
  query: {},
  protocol: "https",
  headers: {
    "x-test": "x-value",
  },
};
const res = { code: 200 };

describe("Sending requests", () => {
  it("returns empty array for no requests", async () => {
    const sendMock = jest.fn().mockReturnValue(Promise.resolve(res));
    const result = await send([], { sendRequest: sendMock });
    expect(result).toEqual([]);
  });

  it("uses the given fake sender", async () => {
    const sendMock = jest.fn().mockReturnValue(Promise.resolve(res));
    const result = await send([req], { sendRequest: sendMock });
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(req);
    expect(result).toEqual([{ req, res }]);
  });

  it("adds headers from configuration", async () => {
    const sendMock = jest.fn().mockReturnValue(Promise.resolve(res));
    const headers = { "X-API-KEY": "VALUE" };
    const result = await send([req], { sendRequest: sendMock, headers });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const expectedReq = { ...req, headers: { ...req.headers, ...headers } };
    expect(sendMock).toHaveBeenCalledWith(expectedReq);
    expect(result).toEqual([{ req: expectedReq, res }]);
  });
});

describe("Sending requests from file", () => {
  it("works for a JSONL file containing requests", async () => {
    const sendMock = jest.fn().mockReturnValue(Promise.resolve(res));
    const result = await sendFromFile(REQUESTS_JSONL, { sendRequest: sendMock });
    expect(result).toHaveLength(3);
    expect(sendMock).toHaveBeenCalledTimes(3);
  });
});
