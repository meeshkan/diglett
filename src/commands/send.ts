import chalk from "chalk";
import debug from "debug";
import { Command, flags } from "@oclif/command";
import bombard from "../lib/send";
import { sendRequest as sendRequestReal, fakeSendRequest } from "../lib/send/request-sender";
import * as jsYaml from "js-yaml";

const debugLog = debug("diglett");

export default class Send extends Command {
  static description = "Send requests to an API, also supports dry-run";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "requests", description: "Path to requests file", required: true }];

  async run() {
    const { args, flags } = this.parse(Send);

    const requestsYaml = args.requests;
    debugLog(`Reading from file "${chalk.bold.magenta(requestsYaml)}`);

    const shouldRunForReal = !!flags.force;

    const sendRequest = shouldRunForReal ? sendRequestReal : fakeSendRequest;

    const result = await bombard(requestsYaml, { sendRequest });
    result.forEach(line => this.log(JSON.stringify(line)));
    debugLog("Finished.");
  }
}
