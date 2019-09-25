import Create from "../../commands/create";

describe("Scrape command", () => {
  it("does not throw when given a path to existing openapi yaml", async () => {
    const spy = jest.spyOn(process.stdout, "write");
    await Create.run(["src/__tests__/resources/petstore.yaml"]);
    expect(spy).toHaveBeenCalled();
  });
  it("throws when given a path to non-existing openapi yaml", async () => {
    await expect(Create.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
