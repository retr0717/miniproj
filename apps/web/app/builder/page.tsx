"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const BuilderPage = () => {
  useEffect(() => {
    const { status } = useSession();

    if (status === "unauthenticated") {
      redirect("/");
    }
  }, []);

  return <div>BuilderPage.</div>;
};

export default BuilderPage;
