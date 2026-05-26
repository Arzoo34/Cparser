import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kasglvisjknilfexxdyf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2dsdmlzamtuaWxmZXh4ZHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDg4MDcsImV4cCI6MjA3ODkyNDgwN30.DugjnuyFtaPYeN1U9c6-82fjS_9kzts36LOZiL-2OHo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


