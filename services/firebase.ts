import { initializeApp } from "firebase/app";
import { DataSnapshot } from "@firebase/database";
import { toast } from "react-toastify";
import { UserData } from "@/types/firebase";
import { format } from "date-fns";
import { calcWalletValues } from "@/services/calc";

export function initFirebase() {
  initializeApp({
    apiKey: "AIzaSyDkhPaMt3aQHG4kWPGkNb-BTz3ty9QehkA",
    authDomain: "scooter-wallet.firebaseapp.com",
    databaseURL:
      "https://scooter-wallet-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scooter-wallet",
    storageBucket: "scooter-wallet.appspot.com",
    messagingSenderId: "985892298962",
    appId: "1:985892298962:web:54f6f6a8ba42c1c60b4d0b",
  });
}

export function getAllWalletNames(userSnapshot: DataSnapshot) {
  try {
    if (!userSnapshot.exists()) return [];

    return [
      ...new Set(
        Object.values(userSnapshot.val()).reduce<string[]>(
          (acc, { wallets }: any) => [...acc, ...Object.keys(wallets)],
          [],
        ),
      ),
    ];
  } catch (error) {
    toast.error(String(error));
    return [];
  }
}

export function getTableData(
  userSnapshot: DataSnapshot,
): Record<string, number | string>[] {
  try {
    if (!userSnapshot.exists()) return [];

    const userData = userSnapshot.val() as UserData;
    return Object.entries(userData).map(([timestamp, { wallets, rates }]) => ({
      key: timestamp,
      date: format(new Date(+timestamp), "dd.MM.yyyy"),
      ...calcWalletValues(wallets, rates),
    }));
  } catch (error) {
    toast.error(String(error));
    return [];
  }
}
