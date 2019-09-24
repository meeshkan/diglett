import debug from "debug";
import * as fs from "fs";
import * as path from "path";
import * as jsYaml from "js-yaml";

interface ScrapeResult {}

const debugLog = debug("api-client:scrape");

type OpenAPI = any;

const readOpenAPI = (openapiPath: string): OpenAPI => {
  const fullPath = path.resolve(process.cwd(), openapiPath);

  if (!fs.existsSync(fullPath)) {
  }

  const extension = path.extname(fullPath);

  if (!/ya?ml/.test(extension)) {
    throw Error(`Found extension ${extension}, expected y(a)ml.`);
  }

  const content = fs.readFileSync(fullPath, { encoding: "utf-8" });

  return jsYaml.safeLoad(content);
};

const scrape = async (openapiPath: string, config: any): Promise<ScrapeResult[]> => {
  const openapi = readOpenAPI(openapiPath);
  debugLog("Got OpenAPI", JSON.stringify(openapi));
  return [];
};

export default scrape;
