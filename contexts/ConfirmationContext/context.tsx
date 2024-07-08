import React from "react";
import { IConfirmationContext } from "@/contexts/ConfirmationContext/types";

export const ConfirmationContext = React.createContext<IConfirmationContext>(
  {} as IConfirmationContext,
);
