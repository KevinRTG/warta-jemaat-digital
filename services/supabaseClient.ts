import { createClient } from '@supabase/supabase-js';

// Use process.env to access environment variables to resolve ImportMeta type errors.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bghyiplzmfhoijjsaaxy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'sb_publishable_QhVd_TJb1g_Z6w57vAi0AA_Bu-Yi0Fj';

export const supabase = createClient(supabaseUrl, supabaseKey);