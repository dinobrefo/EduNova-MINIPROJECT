import { TensorFlowChatbot } from '../lib/tensorflow-chatbot';

async function testChatbot() {
  console.log('Testing TensorFlow Chatbot...\n');
  
  const chatbot = new TensorFlowChatbot({
    courseTitle: "JavaScript Fundamentals",
    lessonTitle: "Variables and Functions"
  });
  
  // Train the model
  await chatbot.trainModel();
  
  // Test various inputs
  const testCases = [
    "hello",
    "how to study programming",
    "I need motivation",
    "explain variables",
    "what is a function",
    "goodbye",
    "help me with javascript",
    "I'm feeling stuck"
  ];
  
  for (const input of testCases) {
    console.log(`Input: "${input}"`);
    const response = await chatbot.sendMessage(input);
    console.log(`Response: "${response.response}"`);
    console.log(`Confidence: ${response.confidence?.toFixed(3)}`);
    console.log('---');
  }
  
  console.log('Chatbot test completed!');
}

testChatbot().catch(console.error); 