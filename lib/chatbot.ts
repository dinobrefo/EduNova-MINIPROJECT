import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client (optional - will use fallback if not available)
let hf: HfInference | null = null;
try {
  hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
} catch {
  console.log('Hugging Face client not available, using fallback responses');
}

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
    // If Hugging Face is not available, use fallback responses
    if (!hf) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const systemPrompt = this.createSystemPrompt();
      const fullPrompt = `${systemPrompt}\n\nStudent: ${userMessage}\nAssistant:`;

      const response = await hf.textGeneration({
        model: 'gpt2',
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.8,
          do_sample: true,
          top_p: 0.9,
        },
      });

      return response.generated_text || this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error('Chatbot API error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Study and learning related
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('how to')) {
      return "Great question about studying! Here are some effective study tips:\n\n1. **Take regular breaks** - Use the Pomodoro technique (25 min study, 5 min break)\n2. **Active recall** - Test yourself instead of just re-reading\n3. **Connect concepts** - Link new information to things you already know\n4. **Teach others** - Explaining concepts helps you understand them better\n5. **Stay organized** - Keep your notes and materials well-organized\n\nWould you like me to elaborate on any of these techniques?";
    }
    
    // Motivation and encouragement
    if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('overwhelm') || lowerMessage.includes('tired')) {
      return "You're doing amazing! 🌟 Remember:\n\n• Every expert was once a beginner\n• Progress, not perfection, is the goal\n• Small steps every day add up to big results\n• You're building valuable skills that will serve you well\n• Learning is a journey, not a destination\n\nKeep going - you've got this! 💪";
    }
    
    // Help and confusion
    if (lowerMessage.includes('help') || lowerMessage.includes('confused') || lowerMessage.includes('don\'t understand') || lowerMessage.includes('stuck')) {
      return "I'm here to help! 😊 Here are some ways I can assist you:\n\n• **Study strategies** - Ask me about effective learning techniques\n• **Concept explanations** - I can help break down complex topics\n• **Motivation** - Need encouragement? I've got you covered!\n• **General questions** - Feel free to ask anything learning-related\n\nWhat specific topic or question would you like help with?";
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm your AI learning assistant. I'm here to help you with:\n\n• Study tips and strategies\n• Understanding difficult concepts\n• Motivation and encouragement\n• General learning questions\n\nWhat would you like to learn about today?";
    }
    
    // Time management
    if (lowerMessage.includes('time') || lowerMessage.includes('schedule') || lowerMessage.includes('busy')) {
      return "Time management is crucial for learning! Here are some tips:\n\n1. **Prioritize tasks** - Focus on what's most important first\n2. **Use time blocking** - Schedule specific times for studying\n3. **Eliminate distractions** - Find a quiet, dedicated study space\n4. **Break tasks down** - Large projects become manageable chunks\n5. **Review and adjust** - Regularly assess what's working\n\nWould you like specific strategies for your situation?";
    }
    
    // Memory and retention
    if (lowerMessage.includes('memory') || lowerMessage.includes('remember') || lowerMessage.includes('forget')) {
      return "Improving memory is a skill you can develop! Try these techniques:\n\n1. **Spaced repetition** - Review material at increasing intervals\n2. **Mnemonics** - Create memorable associations\n3. **Visual learning** - Use diagrams, charts, and mind maps\n4. **Practice retrieval** - Test yourself regularly\n5. **Get enough sleep** - Memory consolidation happens during rest\n\nWhich technique interests you most?";
    }
    
    // Default response
    return "I'm here to support your learning journey! 🌟 I can help with study tips, concept explanations, motivation, and general learning questions. What would you like to know more about?";
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

      return {
        response: aiResponse
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const fallbackResponse = this.getFallbackResponse(message);
      
      return {
        response: fallbackResponse,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async getStudyTips(topic?: string): Promise<string> {
    try {
      if (topic) {
        return `Here are 5 specific study tips for learning about **${topic}**:\n\n1. **Research the basics first** - Build a strong foundation\n2. **Create mind maps** - Visualize connections between concepts\n3. **Practice with examples** - Apply what you learn\n4. **Teach someone else** - Explaining reinforces understanding\n5. **Review regularly** - Spaced repetition helps retention\n\nWould you like me to elaborate on any of these techniques?`;
      }
      
      const prompt = "Give me 5 general study tips that work for any subject. Make them practical and actionable.";
      const response = await this.generateResponse(prompt);
      return response;
    } catch {
      return this.getFallbackResponse("study tips");
    }
  }

  public async explainConcept(concept: string): Promise<string> {
    try {
      const prompt = `Explain the concept of "${concept}" in simple terms that a student can easily understand. Provide examples if helpful.`;
      const response = await this.generateResponse(prompt);
      return response;
    } catch {
      return `I'd be happy to explain "${concept}"! However, I'm having trouble connecting right now. Try asking your instructor or checking your course materials for a detailed explanation.`;
    }
  }

  public async getMotivationalMessage(): Promise<string> {
    try {
      const prompt = "Give me an encouraging and motivational message for a student who is learning and might be feeling overwhelmed or discouraged.";
      const response = await this.generateResponse(prompt);
      return response;
    } catch {
      return this.getFallbackResponse("motivation");
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