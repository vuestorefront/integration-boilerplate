import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { initSDK, buildModule } from '@vsf-enterprise/sdk';
import {
  boilerplateModule,
  BoilerplateModuleType,
} from '../../../../packages/sdk/src';

const sdkConfig = {
  boilerplate: buildModule<BoilerplateModuleType>(boilerplateModule, {
    apiUrl: 'http://0.0.0.0:8181/boilerplate',
  }),
};

export const sdk = initSDK<typeof sdkConfig>(sdkConfig);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
