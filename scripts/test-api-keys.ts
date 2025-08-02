import { config } from 'dotenv';
import { google } from 'googleapis';

// Load environment variables
config({ path: '.env.local' });

async function testGoogleAPI() {
  console.log('🔍 Testing Google Custom Search API...\n');
  
  // Get API keys from environment
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  console.log('📋 Environment Variables:');
  console.log(`API Key: ${apiKey ? '✅ Found' : '❌ Missing'}`);
  console.log(`Search Engine ID: ${searchEngineId ? '✅ Found' : '❌ Missing'}`);
  
  if (!apiKey || !searchEngineId) {
    console.log('\n❌ Missing API keys. Please check your .env.local file.');
    return;
  }
  
  // Test the API
  try {
    const customsearch = google.customsearch('v1');
    
    console.log('\n🔍 Making test search request...');
    
    const response = await customsearch.cse.list({
      auth: apiKey,
      cx: searchEngineId,
      q: 'JavaScript frameworks 2024',
      num: 3
    });
    
    if (response.data.items && response.data.items.length > 0) {
      console.log('✅ API call successful!');
      console.log(`📊 Found ${response.data.items.length} results`);
      
      console.log('\n📝 Sample results:');
      response.data.items.slice(0, 2).forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   URL: ${item.link}`);
        console.log(`   Snippet: ${item.snippet?.substring(0, 100)}...`);
        console.log('');
      });
    } else {
      console.log('⚠️  API call successful but no results found.');
      console.log('This might be due to search engine configuration.');
    }
    
  } catch (error: any) {
    console.log('❌ API call failed:');
    console.log(`Error: ${error.message}`);
    
    if (error.response?.data) {
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGoogleAPI().catch(console.error); 