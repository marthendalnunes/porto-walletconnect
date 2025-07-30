import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWalletKitClient } from './use-wallet-kit-client';

export function useConnectWc() {
  const { data: walletKitClient } = useWalletKitClient();
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['wc', 'connect'],
    mutationFn: async ({
      uri,
      onPair,
    }: { uri: string | undefined; onPair?: () => Promise<void> }) => {
      if (!uri || !walletKitClient) {
        return null;
      }
      await walletKitClient.pair({ uri });
      await onPair?.();
      await queryClient.invalidateQueries({
        queryKey: ['wc-active-connections'],
      });
    },
  });

  return {
    connectWc: walletKitClient ? mutate : undefined,
    connectWcAsync: walletKitClient ? mutateAsync : undefined,
    ...rest,
  };
}
