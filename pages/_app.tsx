import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ProgressBar from "@badrap/bar-of-progress";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/chakraTheme";
import { Router } from "next/router";
const config = {};

const progress = new ProgressBar({
  size: 4,
  color: "#29e",
  className: "z-50",
  delay: 100,
});

// Setup of the router events for the progress bar
Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <Component {...pageProps} />
    </ThirdwebProvider>
    </ChakraProvider>
  );
};

export default MyApp
