# SDK Based Integration Boilerplate for VSF 2

## Creating a new integration? 
The fastest way to get started is to use our CLI to generate a new integration boilerplate

```bash
 npx @vue-storefront/cli create integration
```

The CLI will ask you a few questions and generate a new integration boilerplate based on your answers.

For more information about creating a custom integration using the VSF SDK, please visit the [documentation](https://docs.vuestorefront.io/integrations/custom/quick-start).

From the project root, you can run the one of following commands, depending on your package manager:

```bash
yarn dev
```
or
```bash
npm run dev 
```

This will do the following: 
- start the development server for the `playground/app` application.
- start the middleware server for the `playground/middleware` application.

## Adding an endpoint

```bash
npx @vue-storefront/cli  add endpoint getSomething
```

This will do the following:
- add a new endpoint to the `api-client` package
- add a new method to the `sdk` package
- add a new route to the `playground/middleware` application
- add a new route to the `playground/app` application


### Using vs Contributing
Using the CLI is the recommended way to create a new integration boilerplate. 
However, if you're planning to contribute, you can follow the steps below.
___
## Would you like to contribute?

This is an open-source project. Feel free to contribute by creating a new issue or submitting a pull request. 
We highly recommend opening an issue and getting feedback *before* submitting a pull request, to avoid unnecessary work.

If we feel your contribution would benefit the community, and it adheres to our standards, 
we would be delighted to accept your pull requests.

> **For internal use only.**
> All changes are recorded in the [CHANGELOG.md](CHANGELOG.md) file.

This is a new integration boilerplate for VSF 2 integrations based on the SDK.

## Requirements:

- NodeJS v16 or later,
- [Yarn](https://yarnpkg.com/).

## Repository structure

This repository contains a few necessary packages to help you get started building your new integration:

- `playground/app` - (created during CLI initialization) Demonstrates the usage of `api-client` by creating an express server app. You can use this directory to demonstrate the usage of the integration.
- `playground/middleware` - An express app that uses the `api-client` to create a server-to-server connection with service providers (e.g. commerce backend).
- `packages/api-client` - The service the middleware uses. It contains an `exampleEndpoint` that can be used as an example for the other API endpoints,
- `packages/sdk`- Think of the SDK Connector as a communication layer between the storefront and the middleware. It contains an `exampleMethod` with example documentation, unit & integration tests, that can be used as an example for the rest SDK connector methods.
- `docs` - VuePress documentation with configured API extractor, to create an API Reference based on the `api-client` and `sdk` methods & interfaces.

## Getting started

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

7.  That's it. Now you can start the developing your contribution,
8.  Enjoy.
