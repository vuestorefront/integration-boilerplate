import { useState } from 'react';
import { sdk } from './_app';
import { SfButton } from '@storefront-ui/react';

export default function Home() {
  const [data, setData] = useState('');

  const hitExampleMethodApi = async () => {
    const { data } = await sdk.boilerplate.exampleMethod('test');

    console.log(data);

    setData(data);
  };

  return (
    <>
      <main className="flex flex-col items-center py-24 gap-12  text-white">
        <h1 className="typography-headline-2 font-semibold">Welcome!</h1>
        <p className="typography-headline-3">
          Start building Vue Storefront SDK Integration Boilerplate
        </p>

        <p className="typography-headline-3">
          Make your first API call using SDK
        </p>
        <SfButton type="button" onClick={hitExampleMethodApi}>
          Make SDK API call
        </SfButton>

        <div className="w-96 h-12 bg-gray-900 rounded-md flex items-center justify-center">
          {!data ? 'Click the button' : data}
        </div>
      </main>
    </>
  );
}
