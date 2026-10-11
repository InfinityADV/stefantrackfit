import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Timer } from "lucide-react";
import { workoutQuery, formatDate } from "@/lib/workouts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/workouts/$id")({
  head: () => ({
    meta: [
      { title: "Workout Details — FitTrack" },
      { name: "description", content: "Details of a logged workout in FitTrack." },
      { property: "og:title", content: "Workout Details — FitTrack" },
      { property: "og:description", content: "Details of a logged workout." },
    ],
  }),
  component: WorkoutDetails,
});

function WorkoutDetails() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery(workoutQuery(id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/workouts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All workouts
      </Link>
      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : error ? (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive">
            Couldn't load workout: {error.message}
          </p>
        ) : !data ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <h1 className="text-xl font-semibold">Workout not found</h1>
            <Button asChild className="mt-4"><Link to="/workouts">Back to workouts</Link></Button>
          </div>
        ) : (
          <article className="rounded-2xl border bg-card p-8 shadow-glow">
            <h1 className="text-3xl font-bold sm:text-4xl">{data.exercise_name}</h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-secondary p-4">
                <CalendarDays className="h-5 w-5 text-primary" />
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Date</p>
                <p className="font-semibold">{formatDate(data.workout_date)}</p>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <Timer className="h-5 w-5 text-primary" />
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Duration</p>
                <p className="font-semibold">{data.duration_minutes} minutes</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-foreground/90">{data.notes || "No notes."}</p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
