import gen from "../../lib/requests";
import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";

const PETSTORE_TEMPLATES = jsYaml.safeLoad(
  fs.readFileSync(path.join(__dirname, "..", "resources", "petstore-templates.yaml")).toString()
);

describe("Generating requests", () => {
  const requests = gen(PETSTORE_TEMPLATES);
  it("should generate three requests", () => {
    expect(requests).toHaveLength(3);
  });
  it("should generate request with expected values", () => {
    const req = requests[0];
    expect(req).toHaveProperty("host", "petstore.swagger.io");
  });
});
