import render, { renderObject } from "../../../lib/render";
import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";

const PETSTORE_TEMPLATES = jsYaml.safeLoad(
  fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "templates", "petstore-templates.yaml")).toString()
);

describe("Rendering requests from petstore", () => {
  const requests = render(PETSTORE_TEMPLATES);
  it("should render three requests", () => {
    expect(requests).toHaveLength(3);
  });
  it("should render a request when there are no values to fill in", () => {
    const req = requests[0];
    expect(req).toHaveProperty("host", "petstore.swagger.io");
  });
  it("should render a request when there's post request body", () => {
    const req = requests[1];
    expect(req).toHaveProperty("body");
    const body = JSON.parse(req.body as any);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("name");
  });
  it("should render a request when there are parameters to fill in", () => {
    const req = requests[2];
    expect(req).toHaveProperty("host", "petstore.swagger.io");
    expect(req).toHaveProperty("path", expect.stringMatching(/^\/v1\/pets\/\w+$/));
    // Zoom in more
    const generatedValue = req.path.split("/")[3];
    expect(generatedValue.length).toBeGreaterThan(0);
  });

  describe("rendering multiple", () => {
    it("should render as many requests per template as instructed", () => {
      const rendered = render(PETSTORE_TEMPLATES, { nItems: 5 });
      expect(rendered).toHaveLength(15); // Three templates times five
    });
  });
});

describe("Rendering object", () => {
  it("renders nested object", () => {
    const testObj = {
      number: 1,
      string: "something",
      obj: {
        string: "Hello {{ name }}",
      },
    };
    const name = "Jick";
    const rendered = renderObject(testObj, { name });
    expect(rendered).toEqual({
      number: 1,
      string: "something",
      obj: {
        string: `Hello ${name}`,
      },
    });
  });
});
