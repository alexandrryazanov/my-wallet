import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default async function authWithGoogle() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const signInResult = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(signInResult);
  const token = credential?.accessToken || null;
  const user = signInResult.user;

  /*
      // Handle Errors in try/catch where use this function.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
   */

  return { token, user };
}
