import { Endpoints } from '../../types';

export const exampleEndpoint: Endpoints['exampleEndpoint'] = async (
  context,
  params
) => {
  console.log('exampleEndpoint has been called');

  // Example request could look like this:
  // return await context.client.get(`example-url?id=${params.id}`);
  return { data: 'Hello, Vue Storefront Integrator!' };
};
