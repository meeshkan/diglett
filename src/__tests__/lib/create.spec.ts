import * as path from "path";
import create, { extractOps, generateFrom, readOpenAPI } from "../../lib/create";
import { OpenAPIObject } from "loas3/dist/generated/full";

const petstoreYaml = path.join(__dirname, "..", "resources", "petstore.yaml");

describe("Creating request templates", () => {
  it("creates three templates for petstore", async () => {
    const templates = await create(petstoreYaml, {});
    expect(templates.templates).toHaveLength(3);
  });
});

describe("Extracting request templates", () => {
  describe("for petstore", () => {
    let petstore: OpenAPIObject;

    beforeAll(async () => {
      petstore = await readOpenAPI(petstoreYaml);
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
    petstore = await readOpenAPI(petstoreYaml);
  });

  it("generates three requests from petstore", () => {
    const requestSchemas = generateFrom(petstore);
    expect(requestSchemas.templates).toHaveLength(3);
  });

  it("generates request with no parameters as fixed", () => {
    const requestSchemas = generateFrom(petstore);
    const requestSchema = requestSchemas.templates[0];
    const req = requestSchema.req;
    expect(req).toHaveProperty("host", "petstore.swagger.io");
    expect(req).toHaveProperty("path", "/v1/pets");
    expect(req).toHaveProperty("protocol", "http");
    expect(req).toHaveProperty("method", "get");
    expect(requestSchema).toHaveProperty("parameters", {});
  });

  it("generates request with parameters having schema", () => {
    const requestSchemas = generateFrom(petstore);
    const requestSchema = requestSchemas.templates[2];
    const req = requestSchema.req;
    expect(req).toHaveProperty("host", "petstore.swagger.io");
    expect(req).toHaveProperty("path", "/v1/pets/{petId}");
    expect(req).toHaveProperty("protocol", "http");
    expect(req).toHaveProperty("method", "get");

    const expectedParameters = {
      petId: {
        required: true,
        schema: {
          type: "string",
        },
      },
    };
    expect(requestSchema).toHaveProperty("parameters", expectedParameters);
  });
});
