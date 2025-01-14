"use client";

import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>("");
  const [effectiveType, setEffectiveType] = useState<string>("");

  useEffect(() => {
    // État initial
    setIsOnline(navigator.onLine);
    
    // Gestion des événements de connexion
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Détection de la qualité de connexion si disponible
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionInfo = () => {
        setConnectionType(connection.type);
        setEffectiveType(connection.effectiveType);
      };

      connection.addEventListener("change", updateConnectionInfo);
      updateConnectionInfo();

      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    connectionType,
    effectiveType,
    isLowBandwidth: effectiveType === "slow-2g" || effectiveType === "2g",
  };
}
