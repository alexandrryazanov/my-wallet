import { useContext } from "react";
import { ConfirmationContext } from "@/contexts/ConfirmationContext/context";

const useConfirmation = () => useContext(ConfirmationContext);

export default useConfirmation;