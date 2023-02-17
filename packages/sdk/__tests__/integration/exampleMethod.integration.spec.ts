import { sdk } from '../../sdk.config';

describe('[Integration Boilerplate SDK][integration] exampleMethod', () => {

  it('does something ;)', async () => {
    const EXPECTED_RESPONSE = { success: 1 }

    const res = await sdk.commerce.exampleMethod({
      id: 1
    });

    expect(res).toEqual(EXPECTED_RESPONSE);
  });
});
