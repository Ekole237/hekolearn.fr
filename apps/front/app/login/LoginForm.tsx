"use client";

import { useState, useEffect } from "react";
import GithubLoginButton from "./GithubLoginButton";
import ErrorMessage from "./ErrorMessage";
import LogoLoader from "@/components/LogoLoader";

const getErrorMessage = (error: string): string => {
  switch (error) {
    case "access_denied":
      return "Vous avez annulé la connexion avec GitHub.";
    case "state_mismatch":
      return "Une erreur de sécurité est survenue. Veuillez réessayer.";
    default:
      return `Une erreur inattendue est survenue : ${error}`;
  }
};

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialError) {
      setErrorMessage(getErrorMessage(initialError));
    }
  }, [initialError]);

  return (
    <div className="mt-8 space-y-6">
      {isLoading && <LogoLoader />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <GithubLoginButton setIsLoading={setIsLoading} />
      {/* Ajoutez d'autres méthodes de connexion ici */}
    </div>
  );
}
