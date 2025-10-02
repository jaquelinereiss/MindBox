import { createClient } from '@supabase/supabase-js'

const dbHost: string = process.env.EXPO_PUBLIC_SUPABASE_URL || 'default_value';
const apiKey: string = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'default_value';

export const supabase = createClient(dbHost, apiKey)