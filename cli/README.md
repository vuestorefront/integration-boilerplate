# The VSF Integration Builder's CLI

The VSF Integration Builder's CLI is a local command line interface built to help you move quickly when creating an integration. It provides a fast and efficient way to scaffold new methods and perform various tasks related to your integration project.

## Usage
run `yarn vsf` to see the available commands.

### Add a new endpoint
example: `yarn vsf add endpoint getProducts`


## Making changes to the CLI
Feel free to make as many changes as you like to the CLI. You own it now. If you'd like to make changes to the templates, you can find them in the `templates` folder. If you'd like to add new commands, you can find them in the `commands` folder.

But sure to run `yarn build:cli` from the project root directory after making changes to the cli. This will compile the typescript into javascript and make it available to run.

## Contributions
If you'd like improve this cli for all integrators, please feel free to make a PR the in [integration boilerplate repo](https://github.com/vuestorefront/integration-boilerplate). We're happy to see what you can come up with.
