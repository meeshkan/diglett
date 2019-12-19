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
  it("throws when given an invalid header", async () => {
    await expect(Send.run(["dfhsdgsd.yaml", "-H", "X"])).rejects.toThrow("Invalid header");
  });
  it("does not throw when given a valid header", async () => {
    await Send.run(["requests/empty.yaml", "-H", "X:1"]);
    expect(writtenStdout).toEqual("");
  });
});
