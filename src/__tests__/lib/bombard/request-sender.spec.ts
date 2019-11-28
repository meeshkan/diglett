import { prepareFetch } from "../../../lib/bombard/request-sender";
import { ISerializedRequest } from "../../../lib/types";

const req: ISerializedRequest = {
  method: "get",
  host: "petstore.swagger.io",
  path: "/v1/pets",
  pathname: "/v1/pets",
  protocol: "http",
  query: {},
};

describe("Preparing fetch", () => {
  it("should prepare a GET request as expected", () => {
    const [url, init] = prepareFetch(req);
    expect(url).toBe("http://petstore.swagger.io/v1/pets");
    expect(init.headers).toBeDefined();
    expect(init.method).toBe("get");
  });
});
