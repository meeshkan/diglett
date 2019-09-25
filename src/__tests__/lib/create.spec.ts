import * as path from "path";
import create, { extractOps, generateFrom, readOpenAPI } from "../../lib/create";
import { OpenAPIObject } from "loas3/dist/generated/full";

describe("Extracting request templates", () => {
  describe("for petstore", () => {
    let petstore: OpenAPIObject;

    beforeAll(async () => {
      petstore = await readOpenAPI(path.join(__dirname, "..", "resources", "petstore.yaml"));
    });

    it("finds three operations for petstore", () => {
      const extracted = extractOps(petstore);
      expect(extracted).toHaveLength(3);
    });

    it("finds one server for the first operation", () => {
      const extracted = extractOps(petstore);
      const first = extracted[0];
      const expectedServer = { url: "http://petstore.swagger.io/v1" };
      expect(first).toHaveProperty("servers", [expectedServer]);
    });
  });
});

describe("creating requests from OpenAPI", () => {
  let petstore: OpenAPIObject;

  beforeAll(async () => {
    petstore = await readOpenAPI(path.join(__dirname, "..", "resources", "petstore.yaml"));
  });

  it("generates three requests from petstore", () => {
    const requests = generateFrom(petstore);
    expect(requests).toHaveLength(3);
  });

  it("generates request with no parameters as fixed", () => {
    const requests = generateFrom(petstore);
    const req = requests[0];
    expect(req).toHaveProperty("host", "petstore.swagger.io");
    expect(req).toHaveProperty("path", "/v1/pets");
    expect(req).toHaveProperty("protocol", "http");
    expect(req).toHaveProperty("method", "get");
  });
});
