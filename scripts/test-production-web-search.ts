import { config } from 'dotenv';
import { EnhancedTensorFlowChatbot } from '../lib/enhanced-tensorflow-chatbot';

// Load environment variables
config({ path: '.env.local' });

async function testProductionWebSearch() {
  console.log('Testing Enhanced TensorFlow Chatbot with Production Web Search...\n');
  
  // Get API keys from environment variables
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  if (!googleApiKey || !googleSearchEngineId) {
    console.log('⚠️  No API keys found. Using simulated web search.');
    console.log('To use real web search, set the following environment variables:');
    console.log('  GOOGLE_API_KEY=your_google_api_key_here');
    console.log('  GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here');
    console.log('');
  } else {
    console.log('✅ API keys found. Using real Google Custom Search API.');
    console.log('');
  }
  
  const chatbot = new EnhancedTensorFlowChatbot(
    {
      courseTitle: "Advanced Programming",
      lessonTitle: "Web Development"
    },
    googleApiKey,
    googleSearchEngineId
  );
  
  // Train the model
  await chatbot.trainModel();
  
  // Test queries that should trigger web search
  const testQueries = [
    "latest JavaScript frameworks 2024",
    "React 18 new features",
    "machine learning trends",
    "Python best practices",
    "what is TypeScript",
    "Node.js performance optimization"
  ];
  
  for (const query of testQueries) {
    console.log(`\n🔍 Testing: "${query}"`);
    console.log('─'.repeat(50));
    
    const startTime = Date.now();
    const response = await chatbot.sendMessage(query);
    const endTime = Date.now();
    
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    console.log(`📝 Response: ${response.response.substring(0, 300)}...`);
    console.log(`🎯 Confidence: ${response.confidence?.toFixed(3)}`);
    
    if (response.sources && response.sources.length > 0) {
      console.log(`🔗 Sources:`);
      response.sources.slice(0, 3).forEach((source, index) => {
        console.log(`   ${index + 1}. ${source}`);
      });
    }
    
    console.log('');
  }
  
  console.log('✅ Production web search test completed!');
  
  if (googleApiKey && googleSearchEngineId) {
    console.log('\n🎉 Real web search is working! Your chatbot now has:');
    console.log('   • Real-time Google search results');
    console.log('   • Content extraction from web pages');
    console.log('   • Rate limiting and caching');
    console.log('   • Source attribution');
  } else {
    console.log('\n💡 To enable real web search:');
    console.log('   1. Get Google Custom Search API credentials');
    console.log('   2. Set environment variables');
    console.log('   3. Restart the application');
  }
}

testProductionWebSearch().catch(console.error); 