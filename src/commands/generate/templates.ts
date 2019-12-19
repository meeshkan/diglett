import debug from "debug";
import { Command, flags } from "@oclif/command";
import createTemplates from "../../lib/templates";
import * as jsYaml from "js-yaml";

export default class GenerateTemplates extends Command {
  static description = "Create templates from OpenAPI specification";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "openapi", description: "Path to OpenAPI specification", required: true }];

  async run() {
    const { args } = this.parse(GenerateTemplates);

    const openapi = args.openapi;

    const createResult = await createTemplates(openapi);

    // Hack to avoid JSYaml exception with undefined type
    this.log(jsYaml.safeDump(createResult, { skipInvalid: true }));
  }
}
