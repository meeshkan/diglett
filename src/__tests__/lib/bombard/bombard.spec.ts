import { bombard } from "../../../lib/bombard";
import { ISerializedRequest } from "../../../lib/types";

const req: ISerializedRequest = {
  host: "example.com",
  method: "get",
  path: "/v1",
  pathname: "/v1",
  query: {},
  protocol: "https",
};
const res = { code: 200 };

describe("Bombard", () => {
  it("works for empty requests file", async () => {
    const result = await bombard([]);
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
