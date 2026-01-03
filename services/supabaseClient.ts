import { createClient } from '@supabase/supabase-js';

// Ganti nilai di bawah ini dengan URL dan Key dari Dashboard Supabase Anda
// Atau pastikan process.env.SUPABASE_URL dan process.env.SUPABASE_KEY sudah di-set di environment project Anda
const supabaseUrl = process.env.SUPABASE_URL || 'https://bghyiplzmfhoijjsaaxy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_QhVd_TJb1g_Z6w57vAi0AA_Bu-Yi0Fj';

export const supabase = createClient(supabaseUrl, supabaseKey);