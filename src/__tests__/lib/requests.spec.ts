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
  it("should generate request when there are no values to fill in", () => {
    const req = requests[0];
    expect(req).toHaveProperty("host", "petstore.swagger.io");
  });
  it("should generate request when there are parameters to fill in", () => {
    const req = requests[2];
    expect(req).toHaveProperty("host", "petstore.swagger.io");
    expect(req).toHaveProperty("path", expect.stringMatching(/^\/v1\/pets\/\w+$/));
    // Zoom in more
    const generatedValue = req.path.split("/")[3];
    expect(generatedValue.length).toBeGreaterThan(0);
  });
});
