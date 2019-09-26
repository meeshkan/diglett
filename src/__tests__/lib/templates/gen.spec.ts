import { pathToJinja } from "../../../lib/templates/gen";

describe("Generating request schemas", () => {
  it("should find parameters from path with braces", () => {
    const string = "/v1/pets/{petId}/{id}";
    expect(pathToJinja(string)).toEqual({ path: "/v1/pets/{{ petId }}/{{ id }}", parameters: ["petId", "id"] });
  });

  it("should find parameters from path with colons", () => {
    const string = "/v1/pets/:petId/:id";
    expect(pathToJinja(string)).toEqual({ path: "/v1/pets/{{ petId }}/{{ id }}", parameters: ["petId", "id"] });
  });
});
