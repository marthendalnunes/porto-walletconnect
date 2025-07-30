'use client';

import { useToast } from '@/lib/hooks/use-toast';
import { useConnectWc } from '@/lib/wallet-connect/hooks/use-wc-connect';
import { useMemo, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Address } from './address';
import { ConnectPorto } from './connect-porto';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function ConnectWc() {
  // TODO: update to hookform
  const [uri, setUri] = useState<string>('');
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const connectWcMutation = useConnectWc();
  const { toast } = useToast();

  // TODO: Validate uri with hookform
  const isValidUri = useMemo(() => uri?.startsWith('wc:'), [uri]);

  function handleConnectWc() {
    if (!connectWcMutation.connectWc) {
      return;
    }
    connectWcMutation.connectWc({
      uri,
      onPair: async () => {
        toast({
          title: 'Application Connected',
          description: 'You have successfully connected to the application',
        });
      },
    });
    setUri('');
  }

  return (
    <div className="flex w-full flex-col items-center">
      {address ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Input
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="Enter your WalletConnect Uri"
            />
            <Button
              disabled={
                !isValidUri ||
                connectWcMutation.isPending ||
                !connectWcMutation.connectWc
              }
              onClick={() => handleConnectWc()}
            >
              Connect
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p>
              Connected as{' '}
              <Address
                className="font-medium"
                isLink={true}
                truncate={true}
                address={address}
              />
            </p>
            <Button variant="outline" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <ConnectPorto />
      )}
    </div>
  );
}
