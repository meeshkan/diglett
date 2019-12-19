import RenderCommand from "../../commands/render";

describe("Rendering requests command", () => {
  let processStdoutSpy: jest.SpyInstance;
  let writtenStdout: string;

  beforeEach(() => {
    writtenStdout = "";
    processStdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation(str => {
      writtenStdout += str;
      return false;
    });
  });

  afterEach(() => {
    processStdoutSpy.mockReset();
    processStdoutSpy.mockRestore();
  });

  it("does not throw when given a path to existing templates yaml", async () => {
    await RenderCommand.run(["templates/petstore-templates.yaml"]);
    expect(writtenStdout).toMatch(/^{/);
  });
  it("does not throw when adding existing flags", async () => {
    await RenderCommand.run(["templates/petstore-templates.yaml", "-n", "2", "-d"]);
    expect(writtenStdout).toMatch(/^{/);
  });
  it("throws when given a path to non-existing templates yaml", async () => {
    await expect(RenderCommand.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
