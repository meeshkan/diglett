# Diglett

[![CircleCI](https://circleci.com/gh/Meeshkan/diglett.svg?style=svg)](https://circleci.com/gh/Meeshkan/diglett)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

Command-line tool for automating HTTP requests.

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)

<!-- tocstop -->

## Installation

<!-- installation -->

### Install from `npm`

Available soon 🏋️‍♀️

### Install from repository

Clone the repository. In the root of the repository, run:

```bash
# Install dependencies
$ yarn

# Invoke the CLI
$ ./bin/run --help

# Alternatively, link the executable with `yarn link`:
$ yarn link

# Now `diglett` should be available in your `PATH`
$ diglett --help
```

<!-- installationstop -->

## Usage

<!-- usage -->

### Generate template for generating requests

If you have an OpenAPI schema of an API, you can create "request templates" from the schema with `generate:templates` command.

```bash
$ DEBUG=* diglett generate:templates openapi/petstore.yaml
```

This will create a YAML file containing templates from which requests can be built. See an example in [petstore-templates.yaml](./templates/petstore-templates.yaml) built from [petstore.yaml](./openapi/petstore.yaml).

### Generate requests from template

Once you have created request templates, you can generate actual requests from them using the `generate:requests` command.

```bash
$ DEBUG=* diglett generate:requests templates/petstore-templates.yaml
```

This will create a YAML file, where every object is an `ISerializedRequest` object defined in [types.ts](./src/lib/types.ts). For an example of a file containing requests, see the example in [petstore-requests.yaml](./requests/petstore-requests.yaml).

### Send requests from file

To send all the HTTP requests from a file, use the `send` command. Before performing the requests, you should perform a "dry-run" showing what will be done instead of sending any HTTP requests:

```bash
# Dry-run by default
$ DEBUG=* diglett send requests/petstore-requests.yaml
```

If everything looks good, send the requests by adding the `-f` flag:

```bash
# Add "-f" flag to send requests
diglett send requests/petstore-requests.yaml -f
```

`diglett` will send all the requests from the file using [RequestQueue](./lib/send/request-queue.ts) with a 500 ms delay between requests.

<!-- usagestop -->

## Development

<!-- development -->

Install dependencies:

```sh
$ yarn
```

Run tests:

```sh
$ yarn test
```

Execute CLI:

```sh
./bin/run --help
```

Link the executable so it's available as `diglett`:

```sh
yarn link
diglett --help  # Local version
```

<!-- developmentstop -->
