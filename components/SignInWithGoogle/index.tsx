"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import authWithGoogle from "@/services/auth";
import { FirebaseError } from "@firebase/util";

const SignInWithGoogle = () => {
  const [error, setError] = useState("");

  const onClick = async () => {
    try {
      await authWithGoogle();
    } catch (e) {
      const err = e as FirebaseError;
      setError(err.message);
    }
  };

  return (
    <div className={"flex flex-col summary-center justify-center"}>
      <Button onClick={onClick}>Sing In with Google</Button>
      {error && <div className={"text-danger mt-2"}>{error}</div>}
    </div>
  );
};

export default SignInWithGoogle;
