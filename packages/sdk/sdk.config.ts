import { initVSFSDK } from '@vsf-enterprise/sdk';
import { bolierplateSDK, Boilerplate} from './src';

export const sdk = initVSFSDK<Boilerplate, any>({
  commerce: {
    connector: bolierplateSDK({
      apiUrl: 'http://localhost:8181'
    }),
    beforePlugins: {},
    afterPlugins: {}
  }
});
