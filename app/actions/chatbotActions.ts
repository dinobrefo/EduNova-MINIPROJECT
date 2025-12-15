"use server";

import { GeminiChatbot, ChatResponse, LearningContext } from "@/lib/gemini-chatbot";
import { EnhancedTensorFlowChatbot } from "@/lib/enhanced-tensorflow-chatbot";

// store chatbot instances per user
// In a real serverless environment (like Vercel), this in-memory map might be reset frequently.
// Ideally, we should reconstruct the chatbot state from a persistent store (database/Redis).
// For this demo/project, this map works as long as the lambda stays warm, but we'll optimize for statelessness where possible
// or accept that history might be lost on cold starts.
const geminiInstances = new Map<string, GeminiChatbot>();
const legacyInstances = new Map<string, EnhancedTensorFlowChatbot>();

function getChatbotInstance(userId: string, context?: LearningContext): GeminiChatbot | EnhancedTensorFlowChatbot {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    if (!geminiInstances.has(userId)) {
      const chatbot = new GeminiChatbot(apiKey, context);
      geminiInstances.set(userId, chatbot);
      return chatbot;
    } else {
      const chatbot = geminiInstances.get(userId)!;
      if (context) chatbot.updateContext(context);
      return chatbot;
    }
  } else {
    // Fallback to legacy if no API Key
    console.warn("GEMINI_API_KEY not found. Falling back to TensorFlow Chatbot.");
    if (!legacyInstances.has(userId)) {
      const chatbot = new EnhancedTensorFlowChatbot(context);
      legacyInstances.set(userId, chatbot);
      chatbot.trainModel().catch(console.error);
      return chatbot;
    } else {
      const chatbot = legacyInstances.get(userId)!;
      if (context) chatbot.updateContext(context);
      return chatbot;
    }
  }
}

export async function sendChatMessage(
  message: string,
  userId: string,
  context?: LearningContext
): Promise<ChatResponse> {
  try {
    const chatbot = getChatbotInstance(userId, context);
    return await chatbot.sendMessage(message);
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    return {
      response: "I'm sorry, I'm having trouble right now. Please try again later!",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getStudyTips(
  topic: string | undefined,
  userId: string,
  context?: LearningContext
): Promise<string> {
  try {
    const chatbot = getChatbotInstance(userId, context);
    return await chatbot.getStudyTips(topic);
  } catch (error) {
    console.error("Error getting study tips:", error);
    return "Study Tip 1: Consistency is key.\nStudy Tip 2: Practice active recall.\nStudy Tip 3: Get enough sleep!";
  }
}

export async function explainConcept(
  concept: string,
  userId: string,
  context?: LearningContext
): Promise<string> {
  try {
    const chatbot = getChatbotInstance(userId, context);
    return await chatbot.explainConcept(concept);
  } catch (error) {
    console.error("Error explaining concept:", error);
    return `I can't explain "${concept}" right now due to a connection error.`;
  }
}

export async function getMotivationalMessage(
  userId: string,
  context?: LearningContext
): Promise<string> {
  try {
    const chatbot = getChatbotInstance(userId, context);
    return await chatbot.getMotivationalMessage();
  } catch (error) {
    return "You can do it! Keep pushing forward.";
  }
}

export async function clearChatHistory(userId: string): Promise<void> {
  try {
    // Clear both to be safe
    if (geminiInstances.has(userId)) geminiInstances.get(userId)!.clearHistory();
    if (legacyInstances.has(userId)) legacyInstances.get(userId)!.clearHistory();
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
}

export async function getChatHistory(userId: string) {
  try {
    if (geminiInstances.has(userId)) {
      return geminiInstances.get(userId)!.getConversationHistory();
    }
    if (legacyInstances.has(userId)) {
      return legacyInstances.get(userId)!.getConversationHistory();
    }
    return [];
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
}
