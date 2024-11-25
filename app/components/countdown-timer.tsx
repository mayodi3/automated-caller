"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CountdownTimer() {
  const [status, setStatus] = useState<"idle" | "running" | "calling">("idle");
  const [nextCallIn, setNextCallIn] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/call-status");
        if (!response.ok) throw new Error("Failed to fetch call status");
        const data = await response.json();
        setStatus(data.status);
        setNextCallIn(data.nextCallIn);
      } catch (error) {
        console.error("Error fetching call status:", error);
      }
    };

    fetchStatus(); // Fetch immediately on mount
    intervalId = setInterval(fetchStatus, 1000); // Then every second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Status</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "idle" && (
          <p className="text-2xl font-bold">Waiting to start...</p>
        )}
        {status === "running" && nextCallIn !== null && (
          <p className="text-2xl font-bold">
            Next call in {Math.ceil(nextCallIn / 1000)} seconds
          </p>
        )}
        {status === "calling" && (
          <p className="text-2xl font-bold">Call in progress...</p>
        )}
      </CardContent>
    </Card>
  );
}
