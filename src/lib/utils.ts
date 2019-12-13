import * as fs from "fs";
import * as jsYaml from "js-yaml";

export const readYaml = (path: string) => {
  if (!fs.existsSync(path)) {
    throw Error(`File not found: ${path}`);
  }
  return jsYaml.safeLoad(fs.readFileSync(path).toString());
};

export const readJsonl = (path: string) => {
  if (!fs.existsSync(path)) {
    throw Error(`File not found: ${path}`);
  }
  const contents = fs.readFileSync(path, "utf-8");
  return contents
    .split(/\r?\n/)
    .filter(line => line != "")
    .map(line => JSON.parse(line));
};
