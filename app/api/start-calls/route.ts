import { NextResponse } from "next/server";
import twilio from "twilio";
import { databases, ID } from "@/appwrite";
import {
  setCallInProgress,
  setCallStatus,
  setNextCallTime,
} from "../call-status/route";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

let callerNumbers: string[] = [];
let recipientNumber = "";
let currentCallerIndex = 0;

async function makeCall(callerNumber: string) {
  setCallInProgress(true);
  try {
    const call = await twilioClient.calls.create({
      url: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient",
      to: recipientNumber,
      from: callerNumber,
    });

    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_LOGS_COLLECTION_ID!,
      ID.unique(),
      {
        recipient: recipientNumber,
        caller: callerNumber,
        duration: call.duration || "Unknown",
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error making call:", error);
  } finally {
    setCallInProgress(false);
  }
}

function scheduleNextCall() {
  if (setCallStatus("idle")!) return;

  const randomDelay = Math.random() * (300000 - 120000) + 120000; // 2 to 5 minutes
  const nextCall = Date.now() + randomDelay;
  setNextCallTime(nextCall);

  setTimeout(() => {
    const callerNumber = callerNumbers[currentCallerIndex];
    currentCallerIndex = (currentCallerIndex + 1) % callerNumbers.length;
    makeCall(callerNumber);
    scheduleNextCall();
  }, randomDelay);
}

export async function POST(request: Request) {
  const {
    callerNumber1,
    callerNumber2,
    recipientNumber: newRecipientNumber,
  } = await request.json();

  if (setCallStatus("running")!) {
    return NextResponse.json(
      { error: "Calls are already running" },
      { status: 400 }
    );
  }

  callerNumbers = [callerNumber1, callerNumber2];
  recipientNumber = newRecipientNumber;
  setCallStatus("running");

  // Start the first call immediately
  const initialCallerNumber = callerNumbers[currentCallerIndex];
  currentCallerIndex = (currentCallerIndex + 1) % callerNumbers.length;
  makeCall(initialCallerNumber);

  // Schedule the next call
  scheduleNextCall();

  return NextResponse.json({ message: "Calls started successfully" });
}
