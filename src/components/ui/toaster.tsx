'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/lib/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Dialog key={id} defaultOpen={true}>
          <DialogContent>
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
              <div className="pt-4">{action}</div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
