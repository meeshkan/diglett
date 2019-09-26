import GenerateTemplates from "../../commands/generate/templates";

describe("Creating templates command", () => {
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

  it("does not throw when given a path to existing openapi yaml", async () => {
    await GenerateTemplates.run(["src/__tests__/resources/petstore.yaml"]);
    expect(writtenStdout).toMatch(/^defaults/);
  });
  it("throws when given a path to non-existing openapi yaml", async () => {
    await expect(GenerateTemplates.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
