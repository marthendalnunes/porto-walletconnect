import { porto } from 'porto/wagmi';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { baseSepolia, mainnet } from 'wagmi/chains';

export const portoConnector = porto();

export const supportedChains = [baseSepolia];
export const supportedChainIds = [baseSepolia.id, mainnet.id];

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, mainnet],
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
