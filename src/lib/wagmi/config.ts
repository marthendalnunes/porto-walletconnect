import { porto } from 'porto/wagmi';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia, mainnet } from 'wagmi/chains';

export const portoConnector = porto();

export const supportedChains = [base, baseSepolia];
export const supportedChainIds = [base.id, baseSepolia.id, mainnet.id];

export function getConfig() {
  return createConfig({
    chains: [base, baseSepolia, mainnet],
    connectors: [porto()],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
      [mainnet.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
