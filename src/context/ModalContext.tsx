"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type ModalOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type ModalContextType = {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions>({});

  const openModal = (opts: ModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOptions({});
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/* Global Modal component */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Blur arka plan */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>

          {/* Modal kutusu */}
          <div className="relative bg-white rounded p-6 w-96 z-10">
            <h2 className="text-xl font-bold mb-4">{options.title}</h2>
            <p className="mb-6">{options.message}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  options.onCancel?.();
                  closeModal();
                }}
              >
                {options.cancelText || "Vazgeç"}
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  options.onConfirm?.();
                  closeModal();
                }}
              >
                {options.confirmText || "Onayla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
