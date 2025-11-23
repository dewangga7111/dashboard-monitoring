"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

type ConfirmParams = {
  message: string;
  onConfirm: () => void;
  header?: string;
  cancelText?: string;
  confirmText?: string;
};

type ConfirmationContextType = {
  confirm: (params: ConfirmParams) => void;
};

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);
  const [header, setHeader] = useState("Confirmation");
  const [cancelText, setCancelText] = useState("No");
  const [confirmText, setConfirmText] = useState("Yes");

  const confirm = ({
    message,
    onConfirm,
    header = "Confirmation",
    cancelText = "No",
    confirmText = "Yes",
  }: ConfirmParams) => {
    //close all active popovers
    window.dispatchEvent(new Event("close-all-popovers"));
    setMessage(message);
    setOnConfirmAction(() => onConfirm);
    setHeader(header);
    setCancelText(cancelText);
    setConfirmText(confirmText);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onConfirmAction?.();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}

      {/* ✅ Global Modal Rendered Once */}
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDismissable={false}
        backdrop="blur"
        placement="center"
        hideCloseButton={true}
      >
        <ModalContent>
          <ModalHeader className="justify-center text-center text-lg font-semibold">
            {header}
          </ModalHeader>
          <ModalBody className="text-center">
            <p className="text-default-600">{message}</p>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-4">
            <Button variant="flat" color="primary" onPress={handleCancel}>
              {cancelText}
            </Button>
            <Button color="primary" onPress={handleConfirm}>
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = (): ConfirmationContextType => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationProvider");
  }
  return context;
};
