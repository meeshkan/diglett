import { bombard, bombardFromFile } from "../../../lib/send";
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
};
const res = { code: 200 };

describe("Sending requests", () => {
  it("returns empty array for no requests", async () => {
    const sendMock = jest.fn().mockReturnValue(Promise.resolve(res));
    const result = await bombard([], { sendRequest: sendMock });
    expect(result).toEqual([]);
  });

  it("uses the given fake sender", async () => {
    const sendMock = jest.fn().mockReturnValue(Promise.resolve(res));
    const result = await bombard([req], { sendRequest: sendMock });
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(req);
    expect(result).toEqual([{ req, res }]);
  });
});

describe("Sending requests from file", () => {
  it("works for a JSONL file containing requests", async () => {
    const sendMock = jest.fn().mockReturnValue(Promise.resolve(res));
    const result = await bombardFromFile(REQUESTS_JSONL, { sendRequest: sendMock });
    expect(result).toHaveLength(3);
    expect(sendMock).toHaveBeenCalledTimes(3);
  });
});
