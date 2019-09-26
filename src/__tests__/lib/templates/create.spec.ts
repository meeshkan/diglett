import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";
import create, { extractOps, generateFrom, readOpenAPI } from "../../../lib/templates";
import { OpenAPIObject } from "loas3/dist/generated/full";

const OPENAPI_DIR = path.resolve(__dirname, "..", "..", "..", "..", "openapi");
const PETSTORE_YAML = path.join(OPENAPI_DIR, "petstore.yaml");
const LINK_EXAMPLE_YAML = path.join(OPENAPI_DIR, "link-example.yaml");

const PETSTORE_TEMPLATES = jsYaml.safeLoad(
  fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "templates", "petstore-templates.yaml")).toString()
);

describe("Creating request templates", () => {
  it("creates three templates for petstore", async () => {
    const templates = await create(PETSTORE_YAML, {});
    expect(templates.templates).toHaveLength(3);
  });
});

describe("Extracting request templates", () => {
  describe("for petstore", () => {
    let petstore: OpenAPIObject;

    beforeAll(async () => {
      petstore = await readOpenAPI(PETSTORE_YAML);
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
  let linkExample: OpenAPIObject;

  beforeAll(async () => {
    petstore = await readOpenAPI(PETSTORE_YAML);
    linkExample = await readOpenAPI(LINK_EXAMPLE_YAML);
  });

  describe("for link example", () => {
    it("produces template with six request templates", () => {
      const requestsTemplate = generateFrom(linkExample);
      expect(requestsTemplate.templates).toHaveLength(6);
    });
    it("has as fourth request template also query parameters", () => {
      const requestsTemplate = generateFrom(linkExample);
      const reqTemplate = requestsTemplate.templates[3];
      expect(reqTemplate).toBeDefined();
      const req = reqTemplate.req;
      expect(req).toHaveProperty("query", { state: "{{ state }}" });
      const parameters = reqTemplate.parameters;
      expect(parameters).toHaveProperty("state", {
        required: false,
        schema: { type: "string", enum: ["open", "merged", "declined"] },
      });
    });
  });

  describe("for petstore", () => {
    it("generates template with three request templates from petstore", () => {
      const requestsTemplate = generateFrom(petstore);
      expect(requestsTemplate.templates).toHaveLength(3);
    });

    it("generates requests template with query parameters", () => {
      const requestsTemplate = generateFrom(petstore);
      const requestSchema = requestsTemplate.templates[0];
      const req = requestSchema.req;
      expect(req).toHaveProperty("host", "petstore.swagger.io");
      expect(req).toHaveProperty("path", "/v1/pets");
      expect(req).toHaveProperty("protocol", "http");
      expect(req).toHaveProperty("method", "get");
      expect(requestSchema).toHaveProperty("parameters", {
        limit: { required: false, schema: { format: "int32", type: "integer" } },
      });
    });

    it("generates request with parameters having schema", () => {
      const requestSchemas = generateFrom(petstore);
      const requestSchema = requestSchemas.templates[2];
      const req = requestSchema.req;
      expect(req).toHaveProperty("host", "petstore.swagger.io");
      expect(req).toHaveProperty("path", "/v1/pets/{{ petId }}");
      expect(req).toHaveProperty("protocol", "http");
      expect(req).toHaveProperty("method", "get");

      const expectedParameters = {
        petId: {
          required: true,
          schema: {
            type: "string",
            pattern: "^\\w+$",
          },
        },
      };
      expect(requestSchema).toHaveProperty("parameters", expectedParameters);
    });

    it("should produce the expected template", () => {
      const requestSchemas = generateFrom(petstore);
      expect(requestSchemas).toEqual(PETSTORE_TEMPLATES);
    });
  });
});
