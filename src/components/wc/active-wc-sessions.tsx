'use client';

import { useActiveSessions } from '@/lib/wallet-connect/hooks/use-active-connections';
import { useDisconnectWc } from '@/lib/wallet-connect/hooks/use-wc-disconnect';
import { LucideX } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function ActiveWcSessions() {
  const { isConnected } = useAccount();
  const { disconnectWc } = useDisconnectWc();
  const activeWcSessionsQuery = useActiveSessions();

  const wcSessions = useMemo(() => {
    if (!activeWcSessionsQuery.data) {
      return;
    }
    return Object.values(activeWcSessionsQuery.data);
  }, [activeWcSessionsQuery.data]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="mb-4 text-center font-semibold text-3xl">Connections</h3>
      {(!wcSessions || wcSessions.length === 0) && (
        <div className="text-center text-lg text-neutral-500">
          No connections
        </div>
      )}
      {wcSessions && wcSessions.length > 0 && (
        <div className="flex max-h-[600px] w-full flex-col items-center gap-y-6 overflow-auto">
          {wcSessions.map((session) => (
            <Card className="w-full" key={session?.topic}>
              <CardContent className="flex w-full items-center justify-between px-5 py-4 pt-4">
                <div className="flex items-center gap-x-3">
                  <Image
                    alt="logo"
                    className="rounded-lg"
                    src={
                      session.peer.metadata.icons[0] ?? '/images/logo-xl.png'
                    }
                    width={28}
                    height={28}
                  />
                  <div className="font-bold text-xl">
                    {session.peer.metadata.name}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!disconnectWc}
                  onClick={() => disconnectWc?.({ topic: session.topic })}
                >
                  <LucideX />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
