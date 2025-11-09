/**
 * @file supabase.js
 * @description Configuración del cliente de Supabase para el frontend.
 * Utiliza las credenciales anon key (clave pública) para acceso desde el navegador.
 * 
 * Variables de entorno requeridas:
 * - REACT_APP_SUPABASE_URL: URL del proyecto de Supabase
 * - REACT_APP_SUPABASE_ANON_KEY: Clave anon/public de Supabase
 * 
 * Uso:
 * - Subida de imágenes a Supabase Storage (bucket: case-images)
 * - Comunicación con la base de datos PostgreSQL (si es necesario)
 * 
 * @requires @supabase/supabase-js
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase (frontend) - Debe coincidir con backend/.env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ynnymhcixlaylycrenba.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubnltaGNpeGxheWx5Y3JlbmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NDY2MDksImV4cCI6MjA3ODIyMjYwOX0.lw79k29K5OfKqu5_6zRVJZo7o5IlZC9d89zA9cW-OEs';

/**
 * Cliente de Supabase configurado para el frontend.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
