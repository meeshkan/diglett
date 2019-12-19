import chalk from "chalk";
import debug from "debug";
import { Command, flags } from "@oclif/command";
import { sendFromFile } from "../lib/send";
import { sendRequest as sendRequestReal, fakeSendRequest } from "../lib/send/request-sender";
import { IIncomingHeaders } from "../lib/types";

const debugLog = debug("diglett");

const parseHeaders = (headerArgs: string[]): IIncomingHeaders => {
  const parsed = headerArgs.map(line => parseHeaderArgument(line));

  const headers: Record<string, string> = {};

  parsed.forEach(tuple => {
    const key = tuple[0];
    const value = tuple[1];
    headers[key] = value;
  });

  return headers;
};

const parseHeaderArgument = (line: string) => {
  const [name, value] = line.split(/:(.+)/);
  if (typeof value === "undefined") {
    throw Error("Invalid header: " + line);
  }
  return [name, value];
};

export default class Send extends Command {
  static description = "Send requests to an API, also supports dry-run";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
    headers: flags.string({
      char: "H",
      multiple: true,
      description: "request headers in form 'X-My-Header:123'",
    }),
  };

  static args = [{ name: "requests", description: "Path to requests file", required: true }];

  async run() {
    const { args, flags } = this.parse(Send);

    const headers = flags.headers || [];

    const parsedHeaders: IIncomingHeaders = parseHeaders(headers);

    debugLog("Parsed headers", parsedHeaders);

    const requestsYaml = args.requests;
    debugLog(`Reading from file "${chalk.bold.magenta(requestsYaml)}`);

    const shouldRunForReal = !!flags.force;

    const sendRequest = shouldRunForReal ? sendRequestReal : fakeSendRequest;

    const options = { sendRequest, headers: parsedHeaders };

    const result = await sendFromFile(requestsYaml, options);

    result.forEach(line => this.log(JSON.stringify(line)));

    debugLog("Finished.");
  }
}
