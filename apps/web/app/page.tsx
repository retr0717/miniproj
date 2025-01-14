"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GetStarted } from "@/components/get-started";
import { LoadingScreen } from "@/components/loading-screen";

export default function HomePage() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/home"); // Redirect to login if unauthenticated
    }
  }, [status]); // Ensure the effect re-runs when `status` changes

  if (status === "loading") {
    return <LoadingScreen />; // Show a loading state while session is being fetched
  }

  return <GetStarted />;
}
