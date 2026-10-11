import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Dumbbell, Plus, Timer } from "lucide-react";
import { workoutsQuery, formatDate } from "@/lib/workouts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/workouts/")({
  head: () => ({
    meta: [
      { title: "My Workouts — FitTrack" },
      { name: "description", content: "All of your logged workouts in FitTrack." },
      { property: "og:title", content: "My Workouts — FitTrack" },
      { property: "og:description", content: "All of your logged workouts." },
    ],
  }),
  component: WorkoutsPage,
});

function WorkoutsPage() {
  const { data, isLoading, error, refetch } = useQuery(workoutsQuery());

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Workouts</h1>
          {data && <p className="text-sm text-muted-foreground">{data.length} logged</p>}
        </div>
        <Button asChild><Link to="/workouts/new"><Plus className="h-4 w-4" /> Add</Link></Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">Couldn't load workouts: {error.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <Dumbbell className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">No workouts yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Log your first session to get started.</p>
          <Button asChild className="mt-6"><Link to="/workouts/new">Add Workout</Link></Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((w) => (
            <li key={w.id}>
              <Link
                to="/workouts/$id"
                params={{ id: w.id }}
                className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition hover:border-primary/50 hover:shadow-glow"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Dumbbell className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{w.exercise_name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(w.workout_date)}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  <Timer className="h-4 w-4" /> {w.duration_minutes} min
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
