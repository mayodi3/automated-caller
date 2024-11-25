import CallHistory from "./components/call-history";
import CallerForm from "./components/caller-form";
import CountdownTimer from "./components/countdown-timer";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Automated Caller</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <CallerForm />
          <CountdownTimer />
        </div>
        <CallHistory />
      </div>
    </div>
  );
}
