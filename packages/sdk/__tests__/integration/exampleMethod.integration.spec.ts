import { sdk } from '../../sdk.config';

describe('[Integration Boilerplate SDK][integration] exampleMethod', () => {
  it('makes a request to the middleware', async () => {
    const EXPECTED_RESPONSE = { success: true };

    const res = await sdk.commerce.exampleMethod({
      id: 1,
    });

    expect(res).toEqual(EXPECTED_RESPONSE);
  });
});
