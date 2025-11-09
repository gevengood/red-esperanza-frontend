import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase (frontend) - Debe coincidir con backend/.env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ynnymhcixlaylycrenba.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubnltaGNpeGxheWx5Y3JlbmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NDY2MDksImV4cCI6MjA3ODIyMjYwOX0.lw79k29K5OfKqu5_6zRVJZo7o5IlZC9d89zA9cW-OEs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
