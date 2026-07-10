import { createClient } from "@supabase/supabase-js"

const URL = import.meta.env.VITE_SUPABASE_URL
const APIKEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const Supabase = createClient(
    URL,
    APIKEY
)