"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const phoneRegex = /^\+[1-9]\d{1,14}$/;

const formSchema = z.object({
  callerNumber1: z.string().regex(phoneRegex, "Invalid phone number"),
  callerNumber2: z.string().regex(phoneRegex, "Invalid phone number"),
  recipientNumber: z.string().regex(phoneRegex, "Invalid phone number"),
});

export default function CallerForm() {
  const [isRunning, setIsRunning] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      callerNumber1: "",
      callerNumber2: "",
      recipientNumber: "",
    },
  });

  const handleStart = async (values: z.infer<typeof formSchema>) => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/start-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to start calls");
      // Calls will start immediately, no need for additional user action
    } catch (error) {
      console.error("Error starting calls:", error);
      setIsRunning(false);
    }
  };

  const handleStop = async () => {
    setIsRunning(false);
    try {
      const response = await fetch("/api/stop-calls", { method: "POST" });
      if (!response.ok) throw new Error("Failed to stop calls");
    } catch (error) {
      console.error("Error stopping calls:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Settings</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleStart)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="callerNumber1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caller Number 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1234567890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="callerNumber2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caller Number 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1234567890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1234567890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isRunning}>
              {isRunning ? "Calls Running" : "Start Calls Immediately"}
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isRunning}
              variant="destructive"
            >
              Stop Calls
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
