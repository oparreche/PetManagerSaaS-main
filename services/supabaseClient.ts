import { createClient } from '@supabase/supabase-js';

// Prefer environment variables. Fallback to discovered project values for dev.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xeasqajydwxjhyaidtui.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYXNxYWp5ZHd4amh5YWlkdHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjY0MjksImV4cCI6MjA3ODA0MjQyOX0.2TZlQkqnqiskUAnrggPjpeYLo52p8F-1oTn6wCpDmjM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);