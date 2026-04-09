import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://botgxrwxevqkadtwqcbp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdGd4cnd4ZXZxa2FkdHdxY2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzAwMDAsImV4cCI6MjA4ODc0NjAwMH0.Ipr9qP6JT92afXUHo8JuiJuqJ4bWYM4Y3bZ5ZsxnFI8'

export const supabase = createClient(supabaseUrl, supabaseKey)