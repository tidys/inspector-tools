import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://cxzdqwdteoxteqtpllar.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emRxd2R0ZW94dGVxdHBsbGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODY3OTksImV4cCI6MjA3NDg2Mjc5OX0.DDue3CQJjns3PwA0nCxL9yVwjLk-AkNzHd7950ycysY";
export const supabase = createClient(supabaseUrl, supabaseKey);
