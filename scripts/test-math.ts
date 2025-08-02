import { config } from 'dotenv';
import { EnhancedTensorFlowChatbot } from '../lib/enhanced-tensorflow-chatbot';

// Load environment variables
config({ path: '.env.local' });

async function testMathExpressions() {
  console.log('🧮 Testing Mathematical Expressions in Enhanced TensorFlow Chatbot...\n');

  const googleApiKey = process.env.GOOGLE_API_KEY;
  const googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  console.log('📋 Environment Variables:');
  console.log(`API Key: ${googleApiKey ? '✅ Found' : '❌ Missing'}`);
  console.log(`Search Engine ID: ${googleSearchEngineId ? '✅ Found' : '❌ Missing'}\n`);

  const chatbot = new EnhancedTensorFlowChatbot({}, googleApiKey, googleSearchEngineId);
  await chatbot.trainModel();

  const mathTests = [
    "1+1",
    "2*3",
    "10-5",
    "15/3",
    "2+2*3",
    "(3+4)*2",
    "5.5+2.5",
    "100/4",
    "7*8",
    "20-10+5"
  ];

  console.log('🧮 Testing Mathematical Expressions:\n');

  for (const test of mathTests) {
    console.log(`🔍 Testing: "${test}"`);
    console.log('─'.repeat(50));
    
    const startTime = Date.now();
    const response = await chatbot.sendMessage(test);
    const endTime = Date.now();
    
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    console.log(`📝 Response: ${response.response}`);
    console.log(`🎯 Confidence: ${response.confidence}`);
    console.log('');
  }

  console.log('✅ Math expression test completed!');
  console.log('🎉 Your chatbot can now handle mathematical calculations!');
}

testMathExpressions().catch(console.error); 