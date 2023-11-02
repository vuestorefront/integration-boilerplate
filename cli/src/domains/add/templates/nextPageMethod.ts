import { Template } from "./types";
import { capitalizeFirst } from "../capitalizeFirst";
import { config } from '../../../../cli.config'

export const nextPageMethod: Template = ({ name }) => ({
  path: `playground/app/src/pages/methods/${name}.tsx`,
  contents: `import { useState } from 'react';
  import { sdk } from '@/pages/_app';
  import { SfButton } from '@storefront-ui/react';
  import { RenderJson } from '@/components/RenderJson';
  
  export default function Page${capitalizeFirst(name)}() {
    const [data, setData] = useState<null | Object>(null);
  
    const hitExampleMethodApi = async () => {
      const data = await sdk.${config.integrationName}.${name}('test');
  
      setData(data);
    };
  
    return (
      <>
        <main className="flex flex-col items-center py-24 gap-12  text-white">
          <SfButton type="button" onClick={hitExampleMethodApi}>
            Call ${name}
          </SfButton>
  
          <div className="w-[500px] h-min-12 h-auto p-4 bg-gray-900 rounded-md flex items-center justify-center">
            {!data ? 'Click the button' : <RenderJson json={data} />}
          </div>
        </main>
      </>
    );
  }  
`})
