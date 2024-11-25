import { NextResponse } from "next/server";
import { setCallStatus, setNextCallTime } from "../call-status/route";

export async function POST() {
  setCallStatus("idle");
  setNextCallTime(null);
  return NextResponse.json({ message: "Calls stopped successfully" });
}
