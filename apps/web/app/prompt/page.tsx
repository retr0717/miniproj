"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming Button component is reusable
import { useSession } from "next-auth/react"; // Import useSession to manage authentication state

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter(); // Next.js router hook
  const { status } = useSession(); // Use session to check authentication status

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/builder?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <div className="flex justify-center mb-4">
          <Wand2 className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Webly AI Builder
        </h1>
        <p className="text-lg text-muted-foreground">
          Describe your dream website, and we'll help you build it step by step
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-32 p-4 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Generate Website Plan
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}