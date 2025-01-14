"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GetStarted } from "@/components/get-started";
import { LoadingScreen } from "@/components/loading-screen";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/prompt");
    }
  }, [status]); // Ensure the effect re-runs when `status` changes

  if (status === "loading") {
    return <LoadingScreen />; // Show a loading state while session is being fetched
  }

  return <GetStarted />;
}
