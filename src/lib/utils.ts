import * as fs from "fs";
import * as jsYaml from "js-yaml";

export const readYaml = (path: string) => {
  if (!fs.existsSync(path)) {
    throw Error(`File not found: ${path}`);
  }
  return jsYaml.safeLoad(fs.readFileSync(path).toString());
};
