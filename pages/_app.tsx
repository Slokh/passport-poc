import type { AppProps } from "next/app";
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { WalletsProvider } from "../context/wallets";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider
      theme={extendTheme(withDefaultColorScheme({ colorScheme: "gray" }))}
    >
      <WalletsProvider>
        <Head>
          <title>Passport</title>
        </Head>
        <Component {...pageProps} />
      </WalletsProvider>
    </ChakraProvider>
  );
}

export default MyApp;
