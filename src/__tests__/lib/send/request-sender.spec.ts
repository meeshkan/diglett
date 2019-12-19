import { prepareFetch } from "../../../lib/send/request-sender";
import { ISerializedRequest } from "../../../lib/types";
import { Headers } from "../../../lib/fetch-types";

const req: ISerializedRequest = {
  method: "get",
  host: "petstore.swagger.io",
  path: "/v1/pets",
  pathname: "/v1/pets",
  protocol: "http",
  query: {},
  headers: {
    "x-test": "x-value",
  },
};

describe("Preparing fetch", () => {
  it("should prepare a GET request as expected", () => {
    const [url, init] = prepareFetch(req);
    expect(url).toBe("http://petstore.swagger.io/v1/pets");
    expect(init.method).toBe("get");
    expect(init.headers).toBeDefined();
    if (!(init.headers instanceof Headers)) {
      throw Error(`Unexpected type for init.headers`);
    }
    expect(init.headers!.get("x-test")).toEqual("x-value");
  });
});
