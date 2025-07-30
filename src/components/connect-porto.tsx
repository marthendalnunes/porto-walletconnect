'use client';

import { useConnect, useConnectors } from 'wagmi';
import { Button } from './ui/button';

export function ConnectPorto() {
  const { connect, isPending } = useConnect();

  const connectors = useConnectors();
  return connectors?.map((connector) => (
    <Button
      size="lg"
      onClick={() =>
        connect({
          connector,
        })
      }
      disabled={isPending}
    >
      Connect Porto
    </Button>
  ));
}
