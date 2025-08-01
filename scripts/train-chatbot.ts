import { TensorFlowChatbot } from '../lib/tensorflow-chatbot';

async function trainChatbot() {
  console.log('Starting TensorFlow Chatbot training...');
  
  try {
    const chatbot = new TensorFlowChatbot();
    
    console.log('Training model...');
    await chatbot.trainModel();
    
    console.log('Training completed successfully!');
    console.log('Model is ready to use.');
    
    // Test the model
    console.log('\nTesting the model...');
    
    const testMessages = [
      'hello',
      'how to study',
      'programming help',
      'what is javascript'
    ];
    
    for (const message of testMessages) {
      const response = await chatbot.sendMessage(message);
      console.log(`Input: "${message}"`);
      console.log(`Response: "${response.response}"`);
      console.log(`Confidence: ${response.confidence?.toFixed(3)}`);
      console.log('---');
    }
    
  } catch (error) {
    console.error('Error training chatbot:', error);
  }
}

// Run the training
trainChatbot(); 