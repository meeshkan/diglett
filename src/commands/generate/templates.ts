import chalk from "chalk";
import debug from "debug";
import { Command, flags } from "@oclif/command";
import createTemplates from "../../lib/templates";
import * as jsYaml from "js-yaml";

const debugLog = debug("diglett");

export default class GenerateTemplates extends Command {
  static description = "Create templates for creating requests based on OpenAPI specification";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    config: flags.string({ char: "c", description: "Path to configuration JSON", default: "scrape-config.yaml" }),
  };

  static args = [{ name: "openapi", description: "Path to OpenAPI specification", required: true }];

  async run() {
    const { args, flags } = this.parse(GenerateTemplates);

    const openapi = args.openapi;
    const config = flags.config;
    debugLog(
      `Reading from file "${chalk.bold.magenta(openapi)}" with configuration from "${chalk.bold.magenta(config)}"`
    );

    const createResult = await createTemplates(openapi, config);

    // Hack to avoid JSYaml exception with undefined type
    this.log(jsYaml.safeDump(createResult, { skipInvalid: true }));
  }
}
