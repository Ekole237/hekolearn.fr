"use client";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Image
        src="/logo.svg"
        alt="logo"
        width={100}
        height={100}
        className="w-20 h-20"
      />
      <h1 className="text-6xl font-bold">Hekolearn</h1>
      <p className="text-2xl">
        Hekolearn est un site de réservation de billets pour les évènements
        sportifs organisés par l'association Heko.
      </p>
      <button onClick={() => router.push("/login")}>Login</button>
    </div>
  );
}
