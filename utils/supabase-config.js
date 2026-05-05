// Configuracion publica de Supabase para el marketplace.
// Rellena estos dos valores con los de Project Settings > API.
// Tambien puedes guardarlos en localStorage como supabaseUrl y supabaseAnonKey.
window.SUPABASE_URL = window.SUPABASE_URL || 'https://zorhclhvykikaachfrmp.supabase.co';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcmhjbGh2eWtpa2FhY2hmcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNDQzMzUsImV4cCI6MjA4NzcyMDMzNX0.reauF3UfNTFJFZ3Mnzf8ctYH1d5p7C3msi7AvYJUaos';

// Activalo despues de ejecutar sql/tienda_productos_cursos.sql en Supabase.
// Asi evitamos consultas 404 en conexiones lentas mientras las tablas no existen.
window.ENABLE_TIENDA_TABLES = window.ENABLE_TIENDA_TABLES || true;

// Opcional: conservar el ID del negocio cliente si otras paginas lo usan.
window.NEGOCIO_ID_POR_DEFECTO = window.NEGOCIO_ID_POR_DEFECTO || '08638828-1a42-4c60-a6d4-4f2b2b841646';
