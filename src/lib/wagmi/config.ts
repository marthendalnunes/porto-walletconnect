import { porto } from 'porto/wagmi';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export const portoConnector = porto();

export const supportedChains = [baseSepolia];
export const supportedChainIds = [baseSepolia.id];

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [porto()],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
