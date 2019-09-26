# API hitter

[![Build Status](https://dev.azure.com/meeshkan/meeshkan-node-apps/_apis/build/status/Meeshkan.api-hitter?branchName=master)](https://dev.azure.com/meeshkan/meeshkan-node-apps/_build/latest?definitionId=26&branchName=master)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [Usage](#usage)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ api-hitter --help
```

## Generate template for generating requests

```sh-session
$ api-hitter generate:templates openapi/petstore.yaml
```

## Generate requests from template

```sh-session
$ api-hitter generate:requests templates/petstore-templates.yaml
```

<!-- usagestop -->

## Development

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

Link the executable so it's available as `api-hitter`:

```sh
yarn link
```
