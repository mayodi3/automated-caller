import { NextResponse } from "next/server";

let status: "idle" | "running" | "calling" = "idle";
let nextCallTime: number | null = null;
let isCallInProgress = false;

export function setCallStatus(newStatus: typeof status) {
  status = newStatus;
}

export function setNextCallTime(time: number | null) {
  nextCallTime = time;
}

export function setCallInProgress(inProgress: boolean) {
  isCallInProgress = inProgress;
}

export async function GET() {
  const now = Date.now();
  const nextCallIn =
    nextCallTime && nextCallTime > now ? nextCallTime - now : null;

  let currentStatus = status;
  if (status === "running" && isCallInProgress) {
    currentStatus = "calling";
  }

  return NextResponse.json({
    status: currentStatus,
    nextCallIn,
  });
}
