"use client";

import { useCallback, useEffect, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  labelledBy?: string;
  maxWidthClassName?: string;
  onClose: () => void;
}>;

let scrollLockCount = 0;

export const ModalProvider = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    close,
    isOpen,
    open,
  };
};

export const Modal = ({
  children,
  isOpen,
  labelledBy,
  maxWidthClassName = "max-w-xl",
  onClose,
}: ModalProps) => {
  const portalRoot = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    scrollLockCount += 1;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      scrollLockCount = Math.max(0, scrollLockCount - 1);

      if (scrollLockCount === 0) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, onClose]);

  if (!portalRoot || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end bg-zinc-950/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`mx-auto flex max-h-[88vh] w-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl ${maxWidthClassName}`}
      >
        {children}
      </div>
    </div>,
    portalRoot
  );
};
