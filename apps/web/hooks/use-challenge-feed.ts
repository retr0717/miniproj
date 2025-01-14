"use client";

import { useState, useEffect, use } from "react";

interface Challenge {
  id: string;
  name: string;
  points: number;
  description: string;
  author: string;
  fileUrl?: string | null;
  solved: boolean;
  category: string;
}

export function useChallengeFeed() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/challenges");
        const data = await response.json();
        console.log("from backend",data);
        setChallenges(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, loading };
}