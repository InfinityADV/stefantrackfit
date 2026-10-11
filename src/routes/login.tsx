import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, FormMessage } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Log in — FitTrack" },
      { name: "description", content: "Log in to your FitTrack account to view and add workouts." },
      { property: "og:title", content: "Log in — FitTrack" },
      { property: "og:description", content: "Log in to your FitTrack account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) return setError("Please enter your email and password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setError(error.message);
    const safe = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/workouts";
    navigate({ to: safe });
  }

  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue tracking.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <FormMessage kind="error">{error}</FormMessage>}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</Button>
        <p className="text-center text-sm text-muted-foreground">
          No account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </form>
    </AuthCard>
  );
}
