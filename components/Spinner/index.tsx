import React from "react";
import { Spinner as NextUiSpinner } from "@nextui-org/spinner";

const Spinner = () => {
  return (
    <div
      className={
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      }
    >
      <NextUiSpinner color={"white"} />
    </div>
  );
};

export default Spinner;
