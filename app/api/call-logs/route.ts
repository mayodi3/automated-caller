import { NextResponse } from "next/server";
import { databases, Query } from "@/appwrite";

export async function GET() {
  try {
    const logs = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_LOGS_COLLECTION_ID!,
      [Query.orderDesc("timestamp"), Query.limit(100)]
    );

    return NextResponse.json(logs.documents);
  } catch (error) {
    console.error("Error fetching call logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch call logs" },
      { status: 500 }
    );
  }
}
