// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://akyvhdllwgkikzrjnxzg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXZoZGxsd2draWt6cmpueHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzY2OTksImV4cCI6MjA2MDkxMjY5OX0.EjTvDxu3yCEU0n-nIaUDD76CPA6cj6TvE37NNXVx5WU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);