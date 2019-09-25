import * as path from "path";
import { extractOps, readOpenAPI } from "../../lib/create";
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
