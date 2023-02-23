# New integration boilerplate for VSF 2 integrations

This is a new integration boilerplate for VSF 2 integrations based on the SDK.

## Requirements:

- NodeJS v16 or later
- [Yarn](https://yarnpkg.com/)

## Repository structure

This repository contains a few necessary packages to start building your new integration:

- `api-client` - API Client that is running on the middleware and creating a server-to-server connection with a service provider (e.g. commerce backend). It contains an `exampleEndpoint` with interfaces and unit tests, that can be used as an example for the rest API endpoints,
- `sdk`- SDK Connector which can be considered as a communication layer between the storefront and the middleware. It contains an `exampleMethod` with example documentation, unit & integration tests, that can be sued as an example for the rest SDK connector methods,
- `demo` - Demonstrates the usage of `api-client` by creating an express server app. You can use this directory to demonstrate the usage of the integration.
- `docs` - VuePress documentation with configured API extractor, to create an API Reference based on the `api-client` and `sdk` methods & interfaces.

## Getting started

1. Use this repository as a template.
2. Navigate to `api-client` package and change all `boilerplate` occurrences to your integration name,
3. Navigate to `sdk` package and change all `boilerplate` occurrences to your integration name,
4. Navigate to `docs` package and change all `boilerplate` occurrences to your integration name,
5. Install the dependencies,

```bash
yarn
```

5. Build the packages,

```bash
yarn build
```

6. Test the packages,

```bash
yarn test
```

7.  That's it. Now you can start the development,
8.  Enjoy.
