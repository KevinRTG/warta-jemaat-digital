import { createClient } from '@supabase/supabase-js';

// Menggunakan process.env untuk menghindari error type pada import.meta.env
// Pastikan variabel environment di Vercel diawali dengan VITE_
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://bghyiplzmfhoijjsaaxy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_QhVd_TJb1g_Z6w57vAi0AA_Bu-Yi0Fj';

export const supabase = createClient(supabaseUrl, supabaseKey);