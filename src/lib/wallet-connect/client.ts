import { WalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';

if (!process.env.NEXT_PUBLIC_WALLETKIT_PROJECT_ID) {
  throw new Error('WALLETKIT_PROJECT_ID is not defined');
}

export async function createWalletKitClient() {
  const core = new Core({
    projectId: process.env.NEXT_PUBLIC_WALLETKIT_PROJECT_ID,
  });
  const walletKitClient = await WalletKit.init({
    core,
    metadata: {
      name: 'Porto WalletConnect',
      description: 'Connect Porto to any Dapp using WalletConnect',
      url: 'https://porto-walletconnect.vercel.app/',
      icons: [],
    },
    signConfig: {
      disableRequestQueue: true,
    },
  });

  try {
    const clientId =
      await walletKitClient.engine.signClient.core.crypto.getClientId();
    if (localStorage) {
      localStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId);
    }
  } catch (error) {
    console.error(
      'Failed to set WalletConnect clientId in localStorage: ',
      error,
    );
  }

  return walletKitClient;
}
