import GenerateRequests from "../../commands/generate/requests";

describe("Creating templates command", () => {
  it("does not throw when given a path to existing openapi yaml", async () => {
    const spy = jest.spyOn(process.stdout, "write");
    await GenerateRequests.run(["src/__tests__/resources/petstore-templates.yaml"]);
    expect(spy).toHaveBeenCalled();
  });
  it("throws when given a path to non-existing openapi yaml", async () => {
    await expect(GenerateRequests.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
