import GenerateTemplates from "../../commands/generate/templates";

describe("Creating templates command", () => {
  it("does not throw when given a path to existing openapi yaml", async () => {
    const spy = jest.spyOn(process.stdout, "write");
    await GenerateTemplates.run(["src/__tests__/resources/petstore.yaml"]);
    expect(spy).toHaveBeenCalled();
  });
  it("throws when given a path to non-existing openapi yaml", async () => {
    await expect(GenerateTemplates.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
