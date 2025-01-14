"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CodeIcon } from "lucide-react";
import { FeaturesList } from "@/components/features-list";

export function GetStarted() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <CodeIcon className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
          Welcome to WebBuilder Platform
        </h1>
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            Build websites effortlessly with our cutting-edge platform. Enjoy
            real-time editing, intuitive tools, and seamless deployment—all in
            one place.
          </p>

          <FeaturesList />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Button
            onClick={() => router.push("/auth/login")}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
