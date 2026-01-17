"use client";

import {
  DialogTitle,
  Dialog as HeadlessDialog,
  Transition,
  Description,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const sizes: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnEsc = true,
  closeOnBackdropClick = true,
  className = "",
}: ModalProps) {
  const handleBackdropClose = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="relative z-50"
        onClose={closeOnEsc ? onClose : handleBackdropClose}
      >
        {/* Backdrop with blur */}
        <TransitionChild
          as={Fragment}
          enter="ease-spring duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Panel with spring animation */}
            <TransitionChild
              as={Fragment}
              enter="ease-spring duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`relative w-full ${sizes[size]} transform overflow-hidden rounded-xl bg-glass-medium backdrop-blur-2xl border border-glass-border p-6 shadow-2xl transition-all ${className}`}
              >
                {showCloseButton && (
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-neon rounded-md p-1"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                )}

                {title && (
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-6 text-foreground"
                  >
                    {title}
                  </DialogTitle>
                )}

                {description && (
                  <Description className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </Description>
                )}

                <div className={`${title || description ? "mt-4" : ""}`}>
                  {children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
