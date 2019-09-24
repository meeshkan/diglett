import Scrape from "../../commands/scrape";

describe("Scrape command", () => {
  it("does not throw when given a path to existing openapi yaml", async () => {
    const spy = jest.spyOn(process.stdout, "write");
    await Scrape.run(["src/__tests__/resources/petstore.yaml"]);
    expect(spy).toHaveBeenCalled();
  });
  it("throws when given a path to non-existing openapi yaml", async () => {
    await expect(Scrape.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
