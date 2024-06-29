import { NextResponse } from "next/server";
import { child, getDatabase, get, ref, set } from "@firebase/database";
import { initializeApp } from "firebase/app";

initializeApp({
  databaseURL:
    "https://scooter-wallet-default-rtdb.asia-southeast1.firebasedatabase.app",
});

export async function GET() {
  try {
    const dbRef = ref(getDatabase());

    const snapshot = await get(child(dbRef, "users/1"));

    if (snapshot.exists()) {
      return NextResponse.json({ user: snapshot.val() });
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

export async function POST() {
  try {
    const dbRef = ref(getDatabase());

    set(child(dbRef, "users/1"), {
      name: "Mike",
      email: "test@test.ru",
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to POSTING users" });
  }
}
