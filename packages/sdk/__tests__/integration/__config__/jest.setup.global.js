import { createServer } from '@vue-storefront/middleware';

const middlewareConfig = {
  integrations: {
    boilerplate: {
      location: '@vsf-enterprise/integration-boilerplate-api/server',
      configuration: {},
    },
  }
};

export default async () => {
  const app = await createServer(middlewareConfig);
  const server = await runMiddleware(app);

  // eslint-disable-next-line
  globalThis.__MIDDLEWARE__ = server;
};

async function runMiddleware (app) {
  return new Promise(resolve => {
    const server = app.listen(8181, async () => {
      resolve(server);
    });
  });
}
