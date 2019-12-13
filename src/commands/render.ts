import chalk from "chalk";
import debug from "debug";
import { Command, flags } from "@oclif/command";
import createRequests from "../lib/requests";
import * as jsYaml from "js-yaml";

const debugLog = debug("diglett:render");

export default class RenderCommand extends Command {
  static description = "Render requests from template";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "template", description: "Path to template", required: true }];

  async run() {
    const { args } = this.parse(RenderCommand);

    const template = args.template;
    debugLog(`Reading from file "${chalk.bold.magenta(template)}"`);

    const createResult = createRequests(template);

    // `skipInvalid` hack to avoid JSYaml exception with undefined type
    const as_string = jsYaml.safeDump(createResult, { skipInvalid: true });
    this.log(as_string);
  }
}
