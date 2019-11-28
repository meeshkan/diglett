import chalk from "chalk";
import debug from "debug";
import { Command, flags } from "@oclif/command";
import bombard from "../lib/bombard";
import { sendRequest as sendRequestReal, fakeSendRequest } from "../lib/bombard/request-sender";
import * as jsYaml from "js-yaml";

const debugLog = debug("api-hitter");

export default class Bombard extends Command {
  static description = "Send requests to an API";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    config: flags.string({ char: "c", description: "Path to configuration JSON", default: "scrape-config.yaml" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "requests", description: "Path to requests.yaml", required: true }];

  async run() {
    const { args, flags } = this.parse(Bombard);

    const requestsYaml = args.requests;
    const config = flags.config;
    debugLog(
      `Reading from file "${chalk.bold.magenta(requestsYaml)}" with configuration from "${chalk.bold.magenta(config)}"`
    );

    const shouldRunForReal = !!flags.force;

    const sendRequest = shouldRunForReal ? sendRequestReal : fakeSendRequest;

    const result = await bombard(requestsYaml, { sendRequest });
    this.log(jsYaml.safeDump(result));
    debugLog("Finished.");
  }
}
