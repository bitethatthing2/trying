// Script to test Supabase connection directly
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key. Please check your .env file.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseAnonKey.length);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test select query
    console.log('Testing SELECT query...');
    const { data: selectData, error: selectError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.error('SELECT query error:', selectError);
    } else {
      console.log('SELECT query successful. Found', selectData.length, 'records');
      console.log('Sample data:', selectData);
    }
    
    // Test insert query
    console.log('\nTesting INSERT query...');
    const testData = {
      endpoint: `test-endpoint-${Date.now()}`,
      p256dh: 'test-p256dh',
      auth: 'test-auth',
      user_agent: 'test-user-agent'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('notification_subscriptions')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('INSERT query error:', insertError);
    } else {
      console.log('INSERT query successful:', insertData);
      
      // If insert was successful, test delete
      if (insertData && insertData.length > 0) {
        console.log('\nTesting DELETE query...');
        const { error: deleteError } = await supabase
          .from('notification_subscriptions')
          .delete()
          .eq('endpoint', testData.endpoint);
        
        if (deleteError) {
          console.error('DELETE query error:', deleteError);
        } else {
          console.log('DELETE query successful');
        }
      }
    }
    
    // Test RLS policies
    console.log('\nTesting RLS policies...');
    console.log('Checking available policies...');
    
    // This is a workaround to check policies - we'll try to get table info
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'notification_subscriptions' })
      .single();
    
    if (tableError) {
      console.error('Error checking table info:', tableError);
      console.log('Note: The get_table_info function might not be available in your Supabase instance.');
      console.log('You can check RLS policies in the Supabase dashboard.');
    } else {
      console.log('Table info:', tableInfo);
    }
    
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

// Run the test
testConnection(); 