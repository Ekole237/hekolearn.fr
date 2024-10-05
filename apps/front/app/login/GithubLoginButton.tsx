"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface GithubLoginButtonProps {
  setIsLoading: (isLoading: boolean) => void;
}
export default function GithubLoginButton({
  setIsLoading,
}: GithubLoginButtonProps) {
  const router = useRouter();
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const handleGithubLogin = async () => {
    setIsButtonLoading(true);
    setIsLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/github/redirect`, {
      method: "GET",
      mode: "no-cors",
      // credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setIsButtonLoading(false);
        setIsLoading(false);
        return router.push(
          `${process.env.NEXT_PUBLIC_API_URL}/oauth/github/redirect`,
        );
      })
      .catch((error) => {
        console.log(error);
        setIsButtonLoading(false);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsButtonLoading(false);
      });
  };

  return (
    <button
      onClick={handleGithubLogin}
      disabled={isButtonLoading}
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
        isButtonLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {isButtonLoading ? "Chargement..." : "Se connecter avec GitHub"}
    </button>
  );
}
