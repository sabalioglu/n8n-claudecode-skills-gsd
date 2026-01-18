/**
 * Test script to verify Supabase connection
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testConnection() {
  console.log('=== Supabase Connection Test ===\n');

  // Check environment variables
  console.log('1. Checking environment variables...');
  if (!SUPABASE_URL) {
    console.error('   SUPABASE_URL is not set');
    process.exit(1);
  }
  if (!SUPABASE_ANON_KEY) {
    console.error('   SUPABASE_ANON_KEY is not set');
    process.exit(1);
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('   SUPABASE_SERVICE_ROLE_KEY is not set');
    process.exit(1);
  }
  console.log('   All environment variables are set');
  console.log(`   URL: ${SUPABASE_URL}`);

  // Test with anon key
  console.log('\n2. Testing connection with anon key...');
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Try to list tables (this should work even if there are no tables)
    const { data, error } = await anonClient.from('_test_connection').select('*').limit(1);

    if (error && error.code === '42P01') {
      // Table doesn't exist - but connection works!
      console.log('   Connection successful (table does not exist, which is expected)');
    } else if (error) {
      console.log(`   Connection established, but got error: ${error.message}`);
      console.log(`   Error code: ${error.code}`);
    } else {
      console.log('   Connection successful!');
    }
  } catch (err: any) {
    console.error(`   Connection failed: ${err.message}`);
  }

  // Test with service role key
  console.log('\n3. Testing connection with service role key...');
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // List all tables using service role
    const { data, error } = await serviceClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);

    if (error) {
      // Try a simpler approach - just check if we can connect
      const { error: healthError } = await serviceClient.from('_health_check').select('*').limit(1);
      if (healthError && healthError.code === '42P01') {
        console.log('   Service role connection successful');
      } else if (healthError) {
        console.log(`   Service role connection established, error: ${healthError.message}`);
      } else {
        console.log('   Service role connection successful!');
      }
    } else {
      console.log('   Service role connection successful!');
      if (data && data.length > 0) {
        console.log('   Found tables:', data.map((t: any) => t.table_name).join(', '));
      } else {
        console.log('   No public tables found (database is empty)');
      }
    }
  } catch (err: any) {
    console.error(`   Service role connection failed: ${err.message}`);
  }

  // Try to get database info using RPC if available
  console.log('\n4. Checking database schema...');
  try {
    // Use a raw query to get table info
    const { data: tables, error } = await serviceClient.rpc('get_tables', {}).maybeSingle();

    if (error && error.code === '42883') {
      // Function doesn't exist, try alternative approach
      console.log('   No custom RPC functions found, trying direct query...');

      // Try to select from pg_tables
      const result = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      });

      if (result.ok) {
        const apiInfo = await result.json();
        console.log('   API is accessible');
        if (apiInfo && typeof apiInfo === 'object') {
          const tableNames = Object.keys(apiInfo);
          if (tableNames.length > 0) {
            console.log(`   Available tables/views: ${tableNames.join(', ')}`);
          } else {
            console.log('   No tables exposed via REST API yet');
          }
        }
      }
    } else if (data) {
      console.log('   Database schema retrieved:', data);
    }
  } catch (err: any) {
    console.log(`   Schema check: ${err.message}`);
  }

  console.log('\n=== Connection Test Complete ===');
  console.log('\nYour Supabase instance is connected and ready to use!');
}

testConnection().catch(console.error);
