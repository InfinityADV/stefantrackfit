import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CalendarDays, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitTrack — Track every workout" },
      { name: "description", content: "Log exercises, durations and notes. FitTrack keeps your training history in one place." },
      { property: "og:title", content: "FitTrack — Track every workout" },
      { property: "og:description", content: "Log exercises, durations and notes in one place." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Activity, title: "Log any exercise", text: "Running, lifting, yoga — record it in seconds." },
  { icon: Timer, title: "Track duration", text: "See how many minutes you put in each session." },
  { icon: CalendarDays, title: "Your history", text: "Every workout saved securely to your account." },
];

function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-20 text-center sm:py-28">
        <span className="inline-block rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          Your personal training log
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.05] sm:text-7xl">
          Track every rep.<br /><span className="text-primary">See your progress.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          FitTrack lets you record your workouts — exercise, date, duration and notes — and review them anytime.
        </p>
        <Button asChild size="lg" className="mt-10 h-12 rounded-full px-8 text-base shadow-glow">
          <Link to="/workouts">Start Tracking</Link>
        </Button>
      </section>
      <section className="grid gap-4 pb-24 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border bg-card p-6">
            <f.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
