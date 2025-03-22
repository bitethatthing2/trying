// Script to apply RLS policy update to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRlsUpdate() {
  try {
    console.log('Applying RLS policy update...');
    
    // Read the SQL migration file
    const sqlFilePath = path.join(__dirname, 'supabase', 'migrations', '20240313_update_rls_policy.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL using Supabase's REST API
    const { error } = await supabase.rpc('pgrest_exec', { query: sqlContent });
    
    if (error) {
      console.error('Error applying RLS policy update:', error);
      return;
    }
    
    console.log('RLS policy update applied successfully!');
    console.log('You can now use upsert operations on the notification_subscriptions table.');
    
  } catch (error) {
    console.error('Error applying RLS policy update:', error);
  }
}

// Run the function
applyRlsUpdate(); 