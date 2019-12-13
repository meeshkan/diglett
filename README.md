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

### Generate request templates

Request templates are templates for generating HTTP requests. For example, a request template could specify that a query parameter `id` needs to be a number. A request generated from this template could, for example, generate a random number for `id`, creating a HTTP request.

A [RequestsTemplate](./src/lib/templates/types.ts) object looks like this:

```yaml
defaults: {}
templates:
  - req:
      method: get
      host: petstore.swagger.io
      path: "/v1/pets?limit={{ limit }}"
      pathname: /v1/pets
      protocol: http
      query:
        limit: "{{ limit }}"
    parameters:
      limit:
        required: false
        schema:
          type: integer
          format: int32
```

For a full example of a templates file, see [templates/petstore-templates.yaml](./templates/petstore-templates.yaml).

`defaults` field specifies defaults that should be used in all requests. `templates` contains the actual request templates. A request template contains the `req` and `parameters` fields. In `req` object, a parameter is identified by the `{{ parameter_name }}` syntax. These signal that the values are filled in the rendering phase.

`parameters` is a dictionary with parameters as keys and [JSON schema](https://json-schema.org/) objects as values. From the JSON schema, values are generated in the rendering phase (see below) using [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker). Templates are rendered (i.e., parameters filled) using [nunjucks](https://mozilla.github.io/nunjucks/).

You can either create templates by hand or from OpenAPI schema.

#### From OpenAPI

If you have an OpenAPI schema of an API, you can create "request templates" from the schema with `generate:templates` command.

```bash
$ DEBUG=* diglett generate:templates openapi/petstore.yaml
```

This will create a YAML file containing templates from which requests can be built. See an example in [petstore-templates.yaml](./templates/petstore-templates.yaml) built from [petstore.yaml](./openapi/petstore.yaml).

### Render requests

Once you have created a file containing request templates, you can generate actual requests from them using the `render` command.

```bash
$ DEBUG=* diglett render templates/petstore-templates.yaml
```

As explained above, requests are rendered using [nunjucks](https://mozilla.github.io/nunjucks/) and [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker).

`render` command outputs a YAML array, where every object is an `ISerializedRequest` object defined in [types.ts](./src/lib/types.ts). For an example file containing requests, see the example in [petstore-requests.yaml](./requests/petstore-requests.yaml).

### Send requests from file

To send all the rendered HTTP requests from a file, use the `send` command. Before performing the requests, you should perform a "dry-run" showing what will be done instead of sending any HTTP requests:

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

Compile TypeScript:

```bash
$ yarn compile
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
