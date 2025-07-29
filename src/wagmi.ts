import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { baseSepolia, mainnet, sepolia } from 'wagmi/chains';
import { porto } from 'porto/wagmi';

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
