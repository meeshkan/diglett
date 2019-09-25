import gen, { findParameters } from "../../lib/create/gen";

describe("Generating request schemas", () => {
  it("should find parameters from path", () => {
    const string = "/v1/pets/{petId}/{id}";
    expect(findParameters(string)).toEqual(["petId", "id"]);
  });

  it("should generate schema from given template", () => {});
});
