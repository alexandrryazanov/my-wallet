import React, { PropsWithChildren, useState } from "react";
import { ConfirmationContext } from "@/contexts/ConfirmationContext/context";
import ConfirmationModal from "@/components/ConfirmationModal";

const ConfirmationProvider = ({ children }: PropsWithChildren) => {
  const [modalProps, setModalProps] = useState<{
    isOpen: boolean;
    text?: string;
    onOkClick: () => void;
  }>({ onOkClick: () => {}, isOpen: false });

  const showConfirmationPopup =
    (onConfirm: () => void, text?: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      setModalProps({ onOkClick: onConfirm, text, isOpen: true });
    };

  const setIsOpen = (isOpen: boolean) =>
    setModalProps((p) => ({ ...p, isOpen }));

  return (
    <ConfirmationContext.Provider value={{ showConfirmationPopup }}>
      {children}
      <ConfirmationModal
        text={modalProps.text}
        onOkClick={modalProps.onOkClick}
        isOpen={modalProps.isOpen}
        setIsOpen={setIsOpen}
      />
    </ConfirmationContext.Provider>
  );
};

export default ConfirmationProvider;
