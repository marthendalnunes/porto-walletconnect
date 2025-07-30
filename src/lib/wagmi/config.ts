import { porto } from 'porto/wagmi';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { baseSepolia, mainnet } from 'wagmi/chains';

export const portoConnector = porto();

// Adding mainnet only for being able to connecting to dapps via wc
export const supportedChains = [baseSepolia, mainnet] as const;

export function getConfig() {
  return createConfig({
    chains: supportedChains,
    connectors: [porto()],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
