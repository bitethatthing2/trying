import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key length:", supabaseAnonKey.length);

// Create Supabase client with additional options
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
  },
})

// Test function to verify Supabase connection and table setup
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...");
    
    // First, try to get the table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Table check error:', tableError);
      
      // If it's an authentication error, try a direct fetch approach
      if (tableError.code === '401' || (tableError as any).status === 401) {
        return await testConnectionWithFetch();
      }
      
      if (tableError.code === '42P01') {
        console.error('Table does not exist. Please run the SQL migration first.');
        return false;
      }
      return false;
    }

    // Generate a unique endpoint for testing
    const uniqueEndpoint = `test-endpoint-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Test inserting a record
    const { data, error } = await supabase
      .from('notification_subscriptions')
      .insert({
        endpoint: uniqueEndpoint,
        p256dh: 'test-p256dh',
        auth: 'test-auth',
        user_agent: 'test-user-agent'
      })
      .select();

    if (error) {
      console.error('Supabase connection error:', error.message);
      
      // If it's an authentication error, try a direct fetch approach
      if (error.code === '401' || (error as any).status === 401) {
        return await testConnectionWithFetch();
      }
      
      // If it's a duplicate key error, it's not a critical error for our test
      // It means the table exists and we can write to it, but this specific record already exists
      if (error.message.includes('duplicate key value') || error.code === '23505') {
        console.log('Duplicate key error - this is not critical for testing connection');
        return true;
      }
      
      return false;
    }

    console.log("Test record inserted successfully:", data);

    // Clean up test record
    const { error: deleteError } = await supabase
      .from('notification_subscriptions')
      .delete()
      .eq('endpoint', uniqueEndpoint);

    if (deleteError) {
      console.error('Error deleting test record:', deleteError);
    } else {
      console.log("Test record deleted successfully");
    }

    console.log('Supabase connection and table setup successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

// Fallback function to test connection using direct fetch
async function testConnectionWithFetch() {
  try {
    console.log("Using direct fetch approach to test connection...");
    
    // Test GET request
    const getResponse = await fetch(`${supabaseUrl}/rest/v1/notification_subscriptions?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (!getResponse.ok) {
      console.error('Error testing connection with fetch:', getResponse.status, getResponse.statusText);
      return false;
    }
    
    // Generate a unique endpoint for testing
    const uniqueEndpoint = `test-endpoint-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Test POST request
    const postResponse = await fetch(`${supabaseUrl}/rest/v1/notification_subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        endpoint: uniqueEndpoint,
        p256dh: 'test-p256dh',
        auth: 'test-auth',
        user_agent: 'test-user-agent'
      })
    });
    
    if (!postResponse.ok) {
      console.error('Error testing POST with fetch:', postResponse.status, postResponse.statusText);
      // If it's a duplicate key error, it's not critical
      if (postResponse.status === 409) {
        console.log('Duplicate key error - this is not critical for testing connection');
        return true;
      }
      return false;
    }
    
    const data = await postResponse.json();
    console.log("Test record inserted successfully with fetch:", data);
    
    // Clean up test record
    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/notification_subscriptions?endpoint=eq.${encodeURIComponent(uniqueEndpoint)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (!deleteResponse.ok) {
      console.error('Error deleting test record with fetch:', deleteResponse.status, deleteResponse.statusText);
    } else {
      console.log("Test record deleted successfully with fetch");
    }
    
    console.log('Supabase connection and table setup successful with fetch!');
    return true;
  } catch (error) {
    console.error('Error testing connection with fetch:', error);
    return false;
  }
}

// Function to save notification subscription
export async function saveNotificationSubscription(
  subscription: PushSubscription,
  userAgent: string
) {
  try {
    console.log("Preparing subscription data...");
    const subscriptionData = {
      endpoint: subscription.endpoint,
      p256dh: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(subscription.getKey('p256dh') as ArrayBuffer) as unknown as number[]
      )),
      auth: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(subscription.getKey('auth') as ArrayBuffer) as unknown as number[]
      )),
      user_agent: userAgent,
      last_active: new Date().toISOString()
    };

    console.log("Subscription data prepared:", {
      endpoint: subscriptionData.endpoint,
      user_agent: subscriptionData.user_agent,
      last_active: subscriptionData.last_active
    });

    console.log("Attempting to save to Supabase...");
    
    // First check if the record already exists
    const { data: existingData, error: checkError } = await supabase
      .from('notification_subscriptions')
      .select('id')
      .eq('endpoint', subscriptionData.endpoint)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      
      // If it's an authentication error, try a direct fetch approach
      if (checkError.code === '401' || (checkError as any).status === 401) {
        return await saveSubscriptionWithFetch(subscriptionData);
      }
      
      return null;
    }
    
    // If record exists, update it
    if (existingData) {
      console.log("Subscription already exists, updating...");
      const { data: updateData, error: updateError } = await supabase
        .from('notification_subscriptions')
        .update({
          p256dh: subscriptionData.p256dh,
          auth: subscriptionData.auth,
          user_agent: subscriptionData.user_agent,
          last_active: subscriptionData.last_active
        })
        .eq('endpoint', subscriptionData.endpoint)
        .select();
      
      if (updateError) {
        console.error('Error updating subscription:', updateError);
        
        // If it's an authentication error, try a direct fetch approach
        if (updateError.code === '401' || (updateError as any).status === 401) {
          return await saveSubscriptionWithFetch(subscriptionData);
        }
        
        return null;
      }
      
      console.log("Subscription updated successfully");
      return updateData && updateData.length > 0 ? updateData[0] : { id: existingData.id, ...subscriptionData };
    } else {
      // If record doesn't exist, insert it
      console.log("Subscription doesn't exist, inserting...");
      const { data: insertData, error: insertError } = await supabase
        .from('notification_subscriptions')
        .insert(subscriptionData)
        .select();
      
      if (insertError) {
        console.error('Error inserting subscription:', insertError);
        
        // If it's an authentication error, try a direct fetch approach
        if (insertError.code === '401' || (insertError as any).status === 401) {
          return await saveSubscriptionWithFetch(subscriptionData);
        }
        
        // If it's a duplicate key error, try updating instead
        if (insertError.message.includes('duplicate key value') || insertError.code === '23505') {
          console.log("Duplicate key detected, updating existing record...");
          
          const { data: updateData, error: updateError } = await supabase
            .from('notification_subscriptions')
            .update({
              p256dh: subscriptionData.p256dh,
              auth: subscriptionData.auth,
              user_agent: subscriptionData.user_agent,
              last_active: subscriptionData.last_active
            })
            .eq('endpoint', subscriptionData.endpoint)
            .select();
          
          if (updateError) {
            console.error('Error updating subscription after duplicate key:', updateError);
            return null;
          }
          
          console.log("Subscription updated successfully after duplicate key");
          return updateData && updateData.length > 0 ? updateData[0] : null;
        }
        
        return null;
      }
      
      console.log("Subscription inserted successfully");
      return insertData && insertData.length > 0 ? insertData[0] : null;
    }
  } catch (error) {
    console.error('Error saving subscription:', error);
    return null;
  }
}

// Fallback function to save subscription using direct fetch
async function saveSubscriptionWithFetch(subscriptionData: any) {
  try {
    console.log("Using direct fetch approach to save subscription...");
    
    const response = await fetch(`${supabaseUrl}/rest/v1/notification_subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(subscriptionData)
    });
    
    if (!response.ok) {
      console.error('Error saving subscription with fetch:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log("Subscription saved successfully with fetch:", data);
    return data;
  } catch (error) {
    console.error('Error saving subscription with fetch:', error);
    return null;
  }
}

// Function to get all active subscriptions
export async function getActiveSubscriptions() {
  try {
    console.log("Fetching active subscriptions...");
    const { data, error } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .order('last_active', { ascending: false });

    if (error) {
      console.error('Error getting subscriptions:', error);
      
      // If it's an authentication error, try a direct fetch approach
      if (error.code === '401' || (error as any).status === 401) {
        return await getSubscriptionsWithFetch();
      }
      
      return [];
    }

    console.log("Active subscriptions retrieved:", data);
    return data;
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
}

// Fallback function to get subscriptions using direct fetch
async function getSubscriptionsWithFetch() {
  try {
    console.log("Using direct fetch approach to get subscriptions...");
    
    const response = await fetch(`${supabaseUrl}/rest/v1/notification_subscriptions?order=last_active.desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (!response.ok) {
      console.error('Error getting subscriptions with fetch:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    console.log("Subscriptions retrieved successfully with fetch:", data);
    return data;
  } catch (error) {
    console.error('Error getting subscriptions with fetch:', error);
    return [];
  }
} 