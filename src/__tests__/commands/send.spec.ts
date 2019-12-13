import Send from "../../commands/send";

describe("Send command", () => {
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

  it("logs empty array to stdout when given a path to file with empty array", async () => {
    await Send.run(["requests/empty.yaml"]);
    expect(writtenStdout).toEqual("");
  });
  it("throws when given a path to non-existing openapi yaml", async () => {
    await expect(Send.run(["dfhsdgsd.yaml"])).rejects.toThrow("File not found");
  });
});
