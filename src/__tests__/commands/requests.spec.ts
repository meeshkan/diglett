import GenerateRequests from "../../commands/generate/requests";

describe("Creating requests command", () => {
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
    await GenerateRequests.run(["templates/petstore-templates.yaml"]);
    expect(writtenStdout).toMatch(/^-/);
  });
  it("throws when given a path to non-existing openapi yaml", async () => {
    await expect(GenerateRequests.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
