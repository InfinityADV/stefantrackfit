import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FormMessage } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/workouts/new")({
  head: () => ({
    meta: [
      { title: "Add Workout — FitTrack" },
      { name: "description", content: "Log a new workout in FitTrack." },
      { property: "og:title", content: "Add Workout — FitTrack" },
      { property: "og:description", content: "Log a new workout." },
    ],
  }),
  component: AddWorkout,
});

const schema = z.object({
  exercise_name: z.string().trim().min(1, "Exercise name is required").max(100),
  workout_date: z.string().min(1, "Workout date is required"),
  duration_minutes: z.coerce.number().int("Duration must be a whole number").min(1, "Duration must be at least 1 minute").max(1440),
  notes: z.string().trim().max(1000).optional(),
});

const today = () => new Date().toISOString().slice(0, 10);

function AddWorkout() {
  const qc = useQueryClient();
  const { user } = Route.useRouteContext();
  const [form, setForm] = useState({ exercise_name: "", workout_date: today(), duration_minutes: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSavedId(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid input");
    setBusy(true);
    const { data, error } = await supabase
      .from("workouts")
      .insert({ ...parsed.data, notes: parsed.data.notes || null, user_id: user.id })
      .select("id")
      .single();
    setBusy(false);
    if (error) return setError(error.message);
    qc.invalidateQueries({ queryKey: ["workouts"] });
    setSavedId(data.id);
    toast.success("Workout saved!");
    setForm({ exercise_name: "", workout_date: today(), duration_minutes: "", notes: "" });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-bold">Add Workout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log a training session.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border bg-card p-6">
        {error && <FormMessage kind="error">{error}</FormMessage>}
        {savedId && (
          <FormMessage kind="success">
            Workout saved.{" "}
            <Link to="/workouts/$id" params={{ id: savedId }} className="underline">View it</Link> or{" "}
            <Link to="/workouts" className="underline">see all workouts</Link>.
          </FormMessage>
        )}
        <div className="space-y-2">
          <Label htmlFor="exercise_name">Exercise name</Label>
          <Input id="exercise_name" placeholder="e.g. Morning run" value={form.exercise_name} onChange={set("exercise_name")} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workout_date">Workout date</Label>
            <Input id="workout_date" type="date" value={form.workout_date} onChange={set("workout_date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" min={1} inputMode="numeric" value={form.duration_minutes} onChange={set("duration_minutes")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={4} placeholder="How did it go?" value={form.notes} onChange={set("notes")} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving…" : "Save workout"}</Button>
      </form>
    </div>
  );
}
