"use server";

import { LearningChatbot, ChatResponse, LearningContext } from "@/lib/chatbot";

// Store chatbot instances per user (in production, use Redis or database)
const chatbotInstances = new Map<string, LearningChatbot>();

function getChatbotInstance(userId: string, context?: LearningContext): LearningChatbot {
  if (!chatbotInstances.has(userId)) {
    chatbotInstances.set(userId, new LearningChatbot(context));
  } else if (context) {
    // Update context if provided
    const chatbot = chatbotInstances.get(userId)!;
    chatbot.updateContext(context);
  }
  return chatbotInstances.get(userId)!;
}

export async function sendChatMessage(
  message: string, 
  userId: string, 
  context?: LearningContext
): Promise<ChatResponse> {
  try {
    console.log("Processing chat message:", { message, userId });
    
    const chatbot = getChatbotInstance(userId, context);
    const response = await chatbot.sendMessage(message);
    
    console.log("Chat response generated successfully");
    return response;
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    return {
      response: "I'm sorry, I'm having trouble right now. Please try again later!",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getStudyTips(
  userId: string, 
  topic?: string, 
  context?: LearningContext
): Promise<string> {
  try {
    console.log("Getting study tips for:", { userId, topic });
    
    const chatbot = getChatbotInstance(userId, context);
    const tips = await chatbot.getStudyTips(topic);
    
    console.log("Study tips generated successfully");
    return tips;
  } catch (error) {
    console.error("Error getting study tips:", error);
    return "Here are some general study tips:\n1. Take regular breaks (25 min study, 5 min break)\n2. Use active recall techniques\n3. Connect new concepts to things you already know";
  }
}

export async function explainConcept(
  concept: string, 
  userId: string, 
  context?: LearningContext
): Promise<string> {
  try {
    console.log("Explaining concept:", { concept, userId });
    
    const chatbot = getChatbotInstance(userId, context);
    const explanation = await chatbot.explainConcept(concept);
    
    console.log("Concept explanation generated successfully");
    return explanation;
  } catch (error) {
    console.error("Error explaining concept:", error);
    return `I'd be happy to explain "${concept}"! However, I'm having trouble connecting right now. Try asking your instructor or checking your course materials for a detailed explanation.`;
  }
}

export async function getMotivationalMessage(
  userId: string, 
  context?: LearningContext
): Promise<string> {
  try {
    console.log("Getting motivational message for:", userId);
    
    const chatbot = getChatbotInstance(userId, context);
    const message = await chatbot.getMotivationalMessage();
    
    console.log("Motivational message generated successfully");
    return message;
  } catch (error) {
    console.error("Error getting motivational message:", error);
    return "Remember: Every expert was once a beginner. Keep going, you're doing great! 🌟";
  }
}

export async function clearChatHistory(userId: string): Promise<void> {
  try {
    console.log("Clearing chat history for:", userId);
    
    const chatbot = getChatbotInstance(userId);
    chatbot.clearHistory();
    
    console.log("Chat history cleared successfully");
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
}

export async function getChatHistory(userId: string) {
  try {
    const chatbot = getChatbotInstance(userId);
    return chatbot.getConversationHistory();
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
} 