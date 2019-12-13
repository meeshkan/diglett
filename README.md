# Diglett

[![CircleCI](https://circleci.com/gh/Meeshkan/diglett.svg?style=svg)](https://circleci.com/gh/Meeshkan/diglett)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [Usage](#usage)
- [Development](#development)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
# In the repository root
# Install dependencies
$ yarn
# Invoke the CLI
$ diglett --help
```

For development, create link to `diglett` by running `yarn link` in the repository root.

## Generate template for generating requests

```sh-session
$ DEBUG=* diglett generate:templates openapi/petstore.yaml
```

See example output in [petstore-templates.yaml](./templates/petstore-templates.yaml).

## Generate requests from template

```sh-session
$ DEBUG=* diglett generate:requests templates/petstore-templates.yaml
```

See example output in [petstore-requests.yaml](./requests/petstore-requests.yaml).

## Send requests from file

```sh-session
# Dry-run by default
$ DEBUG=* diglett send requests/petstore-requests.yaml

# Add "-f" flag to send requests
diglett send -f requests/petstore-requests.yaml
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

Link the executable so it's available as `diglett`:

```sh
yarn link
diglett --help  # Local version
```
