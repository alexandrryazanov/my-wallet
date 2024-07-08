import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { IoWarningOutline } from "react-icons/io5";
import { COLORS } from "@/config/colors";

const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  onOkClick,
  text,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOkClick: () => void;
  text?: string;
}) => {
  return (
    <Modal isOpen={isOpen} placement={"center"} onOpenChange={setIsOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Are you sure?
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-6">
                <IoWarningOutline
                  size={48}
                  color={COLORS.MID_YELLOW}
                  className={"min-w-[48px]"}
                />
                <p>{text || "Please confirm this action..."}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                No
              </Button>
              <Button
                color="warning"
                onPress={() => {
                  onOkClick();
                  onClose();
                }}
              >
                Yes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
