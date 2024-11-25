"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CallLog {
  id: string;
  recipient: string;
  caller: string;
  duration: string;
  timestamp: string;
}

export default function CallHistory() {
  const [logs, setLogs] = useState<CallLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/call-logs");
        if (!response.ok) throw new Error("Failed to fetch logs");
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const callCounts = logs.reduce((acc, log) => {
    acc[log.recipient] = (acc[log.recipient] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Caller</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.recipient}</TableCell>
                <TableCell>{log.caller}</TableCell>
                <TableCell>{log.duration}</TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Call Counts</h3>
          <ul>
            {Object.entries(callCounts).map(([recipient, count]) => (
              <li key={recipient}>
                {recipient}: {count} call{count !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
