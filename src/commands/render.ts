import chalk from "chalk";
import debug from "debug";
import { Command, flags } from "@oclif/command";
import createRequests from "../lib/render";

const debugLog = debug("diglett:render");

export default class RenderCommand extends Command {
  static description = "Render requests from template";

  static flags = {
    help: flags.help({ char: "h" }),
    filterDuplicates: flags.boolean({
      char: "d",
      description: "Filter duplicates",
      default: false,
      name: "remove-duplicates",
    }),
    items: flags.integer({
      char: "n",
      description: "How many requests to generate per one template",
      default: 1,
    }),
  };

  static args = [{ name: "template", description: "Path to template", required: true }];

  async run() {
    const { args, flags } = this.parse(RenderCommand);

    const nItems = flags.items;
    const removeDuplicates = flags.filterDuplicates;

    if (nItems < 0) {
      throw Error(`Invalid number of items: ${nItems}`);
    }

    const template = args.template;
    debugLog(`Reading from file "${chalk.bold.magenta(template)}"`);

    const options = {
      nItems,
      removeDuplicates,
    };

    const createResult = createRequests(template, options);

    createResult.forEach(line => this.log(JSON.stringify(line)));
  }
}
