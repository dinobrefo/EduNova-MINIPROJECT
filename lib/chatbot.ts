import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  error?: string;
}

export interface LearningContext {
  courseTitle?: string;
  lessonTitle?: string;
  currentTopic?: string;
  userProgress?: string;
}

// Free model options from Hugging Face
const FREE_MODELS = {
  // Small, fast model for quick responses
  FAST: 'microsoft/DialoGPT-medium',
  // Better quality model (slower but more accurate)
  QUALITY: 'microsoft/DialoGPT-large',
  // Educational focused model
  EDUCATIONAL: 'facebook/blenderbot-400M-distill'
};

export class LearningChatbot {
  private conversationHistory: ChatMessage[] = [];
  private context: LearningContext = {};

  constructor(context?: LearningContext) {
    if (context) {
      this.context = context;
    }
  }

  private createSystemPrompt(): string {
    const { courseTitle, lessonTitle, currentTopic } = this.context;
    
    return `You are an intelligent learning assistant for an online education platform. Your role is to help students learn better by:

1. **Answering Questions**: Provide clear, educational explanations
2. **Guiding Learning**: Suggest study strategies and resources
3. **Encouraging**: Be supportive and motivating
4. **Clarifying**: Help students understand complex concepts
5. **Providing Examples**: Give practical examples when helpful

Current Context:
- Course: ${courseTitle || 'General Learning'}
- Lesson: ${lessonTitle || 'Not specified'}
- Topic: ${currentTopic || 'General'}

Keep responses educational, encouraging, and focused on helping the student learn. Use simple language and provide step-by-step explanations when needed.`;
  }

  private async generateResponse(userMessage: string): Promise<string> {
    try {
      // Use the free Hugging Face model
      const model = FREE_MODELS.FAST;
      
      const systemPrompt = this.createSystemPrompt();
      const fullPrompt = `${systemPrompt}\n\nStudent: ${userMessage}\nAssistant:`;

      const response = await hf.textGeneration({
        model,
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
        },
      });

      return response.generated_text || "I'm here to help you learn! Could you please rephrase your question?";
    } catch (error) {
      console.error('Chatbot error:', error);
      return "I'm having trouble connecting right now. Please try again in a moment, or feel free to ask your instructor for help!";
    }
  }

  public async sendMessage(message: string): Promise<ChatResponse> {
    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      this.conversationHistory.push(userMessage);

      // Generate AI response
      const aiResponse = await this.generateResponse(message);
      
      // Add AI response to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      this.conversationHistory.push(assistantMessage);

      return { response: aiResponse };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return { 
        response: "I'm sorry, I'm having trouble right now. Please try again later!",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async getStudyTips(topic?: string): Promise<string> {
    const prompt = topic 
      ? `Give me 3 practical study tips for learning about ${topic}. Keep each tip brief and actionable.`
      : "Give me 3 general study tips that help with any subject. Keep each tip brief and actionable.";

    try {
      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      return "Here are some general study tips:\n1. Take regular breaks (25 min study, 5 min break)\n2. Use active recall techniques\n3. Connect new concepts to things you already know";
    }
  }

  public async explainConcept(concept: string): Promise<string> {
    const prompt = `Explain the concept of "${concept}" in simple terms that a student can easily understand. Use examples if helpful.`;
    
    try {
      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      return `I'd be happy to explain "${concept}"! However, I'm having trouble connecting right now. Try asking your instructor or checking your course materials for a detailed explanation.`;
    }
  }

  public async getMotivationalMessage(): Promise<string> {
    const motivationalPrompts = [
      "Give me a short, encouraging message for a student who might be feeling overwhelmed with their studies.",
      "Share a motivational quote or tip for someone learning new things.",
      "Give a brief pep talk to a student who needs encouragement to keep learning."
    ];

    const randomPrompt = motivationalPrompts[Math.floor(Math.random() * motivationalPrompts.length)];
    
    try {
      const response = await this.generateResponse(randomPrompt);
      return response;
    } catch (error) {
      return "Remember: Every expert was once a beginner. Keep going, you're doing great! 🌟";
    }
  }

  public getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  public updateContext(newContext: Partial<LearningContext>): void {
    this.context = { ...this.context, ...newContext };
  }

  public clearHistory(): void {
    this.conversationHistory = [];
  }
}

// Fallback responses when AI is not available
export const fallbackResponses = {
  greeting: "Hello! I'm your learning assistant. How can I help you today?",
  studyTip: "Here's a study tip: Try the Pomodoro Technique - study for 25 minutes, then take a 5-minute break!",
  encouragement: "You're doing great! Learning takes time, so be patient with yourself.",
  error: "I'm having trouble connecting right now. Please try again in a moment!",
  help: "I can help you with:\n• Understanding course concepts\n• Study tips and strategies\n• Motivation and encouragement\n• General learning questions"
}; 