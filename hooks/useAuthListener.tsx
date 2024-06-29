import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function useAuthListener() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/summary");
        localStorage.setItem("uid", user.uid);
      } else {
        router.replace("/");
        localStorage.removeItem("uid");
      }
    });
  }, []);
}
