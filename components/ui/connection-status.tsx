"use client";

import { useNetworkStatus } from "@/hooks/use-network-status";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ConnectionStatus() {
  const { isOnline, isLowBandwidth } = useNetworkStatus();

  return (
    <AnimatePresence>
      {(!isOnline || isLowBandwidth) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={cn(
            "fixed top-0 right-0 m-4 p-3 rounded-lg shadow-lg z-50 flex items-center gap-2",
            isOnline
              ? "bg-yellow-500/90 text-yellow-950"
              : "bg-red-500/90 text-white"
          )}
        >
          {isOnline ? (
            <>
              <AlertTriangle className="h-5 w-5" />
              <span>Connexion lente</span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5" />
              <span>Hors ligne</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
