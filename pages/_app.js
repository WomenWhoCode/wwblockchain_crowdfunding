import Layout from "../comps/Layout";
import "../styles/global.css";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import "regenerator-runtime/runtime";
import { NextUIProvider } from '@nextui-org/react';

function MyApp({ Component, pageProps }) {
  const supportedChainIds = [80001, 4]; // 80001 is for Mumbai Testnet Network and 4 is for Rinkeby Testnet Network

  const connectors = {
    injected: {},
  };

  return (
    <NextUIProvider>
      <Layout>
       <ThirdwebWeb3Provider
        supportedChainIds={supportedChainIds}
        connectors={connectors}
      >
        <Component {...pageProps} />
        </ThirdwebWeb3Provider>
      </Layout>
    </NextUIProvider>
  );
}

export default MyApp;