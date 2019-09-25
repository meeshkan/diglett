import * as path from "path";
import { extractOps, readOpenAPI } from "../../lib/create";
import { OpenAPIObject } from "loas3/dist/generated/full";

describe("Extracting request templates", () => {
  let petstore: OpenAPIObject;

  beforeAll(async () => {
    petstore = await readOpenAPI(path.join(__dirname, "..", "resources", "petstore.yaml"));
  });

  it("finds three operations", () => {
    const extracted = extractOps(petstore);
    expect(extracted).toHaveLength(3);
  });
});
