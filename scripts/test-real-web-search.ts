import { EnhancedTensorFlowChatbot } from '../lib/enhanced-tensorflow-chatbot';

async function testRealWebSearch() {
  console.log('Testing Enhanced TensorFlow Chatbot with Real Web Search...\n');
  
  const chatbot = new EnhancedTensorFlowChatbot({
    courseTitle: "Advanced Programming",
    lessonTitle: "Web Development"
  });
  
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
  
  console.log('✅ Real web search test completed!');
  console.log('\n💡 The chatbot now has ChatGPT-like capabilities:');
  console.log('   • Real-time web search using DuckDuckGo');
  console.log('   • Content extraction from web pages');
  console.log('   • Intelligent response generation');
  console.log('   • Source attribution');
  console.log('   • Caching for performance');
}

testRealWebSearch().catch(console.error); 