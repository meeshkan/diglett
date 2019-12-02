import chalk from "chalk";
import debug from "debug";
import { Command, flags } from "@oclif/command";
import createRequests from "../../lib/requests";
import * as jsYaml from "js-yaml";

const debugLog = debug("diglett:generate:requests");

export default class GenerateRequests extends Command {
  static description = "Create fake requests based on the template";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    config: flags.string({ char: "c", description: "Path to configuration JSON", default: "scrape-config.yaml" }),
  };

  static args = [{ name: "template", description: "Path to template", required: true }];

  async run() {
    const { args } = this.parse(GenerateRequests);

    const template = args.template;
    debugLog(`Reading from file "${chalk.bold.magenta(template)}"`);

    const createResult = await createRequests(template);

    // Hack to avoid JSYaml exception with undefined type
    this.log(jsYaml.safeDump(createResult, { skipInvalid: true }));
  }
}
