import { flatten } from "lodash";
import { RequestTemplate, ISerializedRequest, isProtocol } from "./types";
import * as url from "url";

const gen = (template: RequestTemplate): ISerializedRequest[] => {
  return flatten(
    template.servers.map(server => {
      const serverUrl = url.parse(server.url); // TODO
      const path = serverUrl.path + template.path;

      const trimmedProtocol = (serverUrl.protocol && serverUrl.protocol.replace(":", "")) || "";

      const protocol = (isProtocol(trimmedProtocol) && trimmedProtocol) || "https";

      const example: ISerializedRequest = {
        method: template.method,
        host: serverUrl.hostname!,
        path,
        pathname: path, // TODO Fill in parameters
        protocol,
        query: {}, // TODO Fill in
        body: undefined, // TODO  Fill in
      };
      return [example];
    })
  );
};

export default gen;
