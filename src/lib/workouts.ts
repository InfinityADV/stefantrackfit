import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const workoutsQuery = () =>
  queryOptions({
    queryKey: ["workouts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("id, exercise_name, workout_date, duration_minutes")
        .order("workout_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const workoutQuery = (id: string) =>
  queryOptions({
    queryKey: ["workouts", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("workouts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
