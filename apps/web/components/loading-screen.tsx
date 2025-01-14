"use client";

import { motion } from "framer-motion";
import { LoaderIcon } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <LoaderIcon className="h-16 w-16 text-primary" />
      </motion.div>
    </div>
  );
}
