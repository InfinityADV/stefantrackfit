import { Link, useNavigate } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";

const linkCls = "text-sm text-muted-foreground transition-colors hover:text-foreground";
const active = { className: "text-foreground font-medium" };

export function Navbar() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-4 w-4" />
          </span>
          FitTrack
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/" className={linkCls} activeProps={active} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/workouts" className={linkCls} activeProps={active} activeOptions={{ exact: true }}>Workouts</Link>
          <Link to="/workouts/new" className={linkCls} activeProps={active}>Add Workout</Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {loading ? null : session ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:inline">{session.user.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
              <Button asChild size="sm"><Link to="/register">Register</Link></Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} FitTrack</span>
        <span>Train. Log. Progress.</span>
      </div>
    </footer>
  );
}
