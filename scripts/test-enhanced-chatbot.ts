import { EnhancedTensorFlowChatbot } from '../lib/enhanced-tensorflow-chatbot';

async function testEnhancedChatbot() {
  console.log('Testing Enhanced TensorFlow Chatbot with Web Search...\n');
  
  const chatbot = new EnhancedTensorFlowChatbot({
    courseTitle: "Advanced Programming",
    lessonTitle: "Web Development"
  });
  
  // Train the model
  await chatbot.trainModel();
  
  // Test various inputs including web search queries
  const testCases = [
    "hello",
    "search for latest JavaScript frameworks",
    "what is React",
    "find information about machine learning",
    "how to study programming",
    "latest news about AI",
    "who is Elon Musk",
    "search for Python tutorials"
  ];
  
  for (const input of testCases) {
    console.log(`Input: "${input}"`);
    const response = await chatbot.sendMessage(input);
    console.log(`Response: "${response.response}"`);
    console.log(`Confidence: ${response.confidence?.toFixed(3)}`);
    if (response.sources) {
      console.log(`Sources: ${response.sources.join(', ')}`);
    }
    console.log('---');
  }
  
  console.log('Enhanced chatbot test completed!');
}

testEnhancedChatbot().catch(console.error); 