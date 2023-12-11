"use client";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "@wagmi/core/connectors";
import {
  localhost,
  avalancheFuji,
  polygonMumbai,
  optimismGoerli,
} from "wagmi/chains";
import Navbar from "@/components/Navbar";
import { Chain } from "@wagmi/core";

export const anvil = {
  id: 31337,
  name: "Anvil",
  network: "anvil-localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereuem",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["http://127.0.0.1:8545"] },
    default: { http: ["http://127.0.0.1:8545"] },
  },
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji, optimismGoerli, polygonMumbai, anvil],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  logger: {
    warn: null,
  },
  connectors: [new InjectedConnector()],
  publicClient,
  webSocketPublicClient,
});

export default function Provider({ children }) {
  return (
    <div>
      <WagmiConfig config={config}>
        <Navbar />
        <div> {children} </div>
      </WagmiConfig>
    </div>
  );
}
