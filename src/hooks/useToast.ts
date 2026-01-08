"use client";

import { useCallback, useState } from "react";

export type ToastOptions = {
  autoHideMs?: number;
};

export const useToast = (options?: ToastOptions) => {
  const { autoHideMs = 3000 } = options || {};
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback(
    (nextMessage: string) => {
      setMessage(nextMessage);

      if (autoHideMs > 0) {
        window.setTimeout(() => {
          setMessage((current) => (current === nextMessage ? null : current));
        }, autoHideMs);
      }
    },
    [autoHideMs]
  );

  const hideToast = useCallback(() => {
    setMessage(null);
  }, []);

  return { message, showToast, hideToast };
};

