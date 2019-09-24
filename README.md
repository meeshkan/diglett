api-client-cli
==============



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/api-client-cli.svg)](https://npmjs.org/package/api-client-cli)
[![Downloads/week](https://img.shields.io/npm/dw/api-client-cli.svg)](https://npmjs.org/package/api-client-cli)
[![License](https://img.shields.io/npm/l/api-client-cli.svg)](https://github.com/meeshkan/api-client-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g api-client-cli
$ api-client-cli COMMAND
running command...
$ api-client-cli (-v|--version|version)
api-client-cli/0.0.0 darwin-x64 node-v10.16.0
$ api-client-cli --help [COMMAND]
USAGE
  $ api-client-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`api-client-cli hello [FILE]`](#api-client-cli-hello-file)
* [`api-client-cli help [COMMAND]`](#api-client-cli-help-command)

## `api-client-cli hello [FILE]`

describe the command here

```
USAGE
  $ api-client-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ api-client-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/meeshkan/api-client-cli/blob/v0.0.0/src/commands/hello.ts)_

## `api-client-cli help [COMMAND]`

display help for api-client-cli

```
USAGE
  $ api-client-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_
<!-- commandsstop -->
