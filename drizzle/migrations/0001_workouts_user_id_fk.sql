ALTER TABLE public.workouts
  ADD CONSTRAINT workouts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;