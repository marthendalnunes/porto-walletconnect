import { porto } from 'porto/wagmi';

import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  berachain,
  berachainBepolia,
  celo,
  gnosis,
  hoodi,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from 'wagmi/chains';

export const portoConnector = porto();

export const supportedChains = [
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  berachain,
  berachainBepolia,
  celo,
  gnosis,
  hoodi,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
] as const;

const transports = supportedChains.reduce(
  (acc, { id }) => {
    acc[id] = http();
    return acc;
  },
  {} as Record<(typeof supportedChains)[number]['id'], ReturnType<typeof http>>,
);

export function getConfig() {
  return createConfig({
    chains: supportedChains,
    connectors: [porto()],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports,
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
