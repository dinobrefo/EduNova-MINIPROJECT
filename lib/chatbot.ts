// import axios from "axios"; // Uncomment when using external AI API

export interface ChatMessage {
  role: "user" | "assistant";
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

  private async callFreeAI(message: string): Promise<string> {
    // For now, we'll use the smart response directly since the external API might not be reliable
    // In a production environment, you would integrate with a proper AI service like OpenAI, Anthropic, etc.
    return this.getSmartResponse(message);
    
    // Uncomment the following code when you have a working AI API endpoint
    /*
    try {
      const response = await axios.post(
        "https://api.freeapi.app/chat",
        {
          message,
          context: this.context,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000, // 5 second timeout
        }
      );
      return response.data.response || this.getSmartResponse(message);
    } catch (error) {
      console.warn("FreeAI API call failed, using fallback response:", error);
      return this.getSmartResponse(message);
    }
    */
  }

  private getSmartResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("c++") || lowerMessage.includes("cpp")) {
      return `**C++** is a powerful programming language for system software and game development. Key features: object-oriented programming, memory management, high performance. Would you like to learn about variables, functions, or classes?`;
    }

    if (lowerMessage.includes("variable")) {
      return `A **variable** stores data in programming. In C++: \`int age = 25; string name = "John";\` Variables have names, store different data types, and values can change during execution.`;
    }

    if (lowerMessage.includes("function")) {
      return `A **function** is a reusable block of code. In C++: \`int add(int a, int b) { return a + b; }\` Functions help organize code, make it reusable, and easier to maintain.`;
    }

    if (lowerMessage.includes("java")) {
      return `**Java** is a popular programming language known for its "Write Once, Run Anywhere" capability. It's used for web applications, Android development, and enterprise software. Key features include object-oriented programming, automatic memory management, and strong typing. Would you like to learn about Java classes, methods, or the JVM?`;
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      const { courseTitle, lessonTitle } = this.context;
      if (courseTitle && lessonTitle) {
        return `Hello! 👋 I am your AI assistant for **${courseTitle}** - lesson on **${lessonTitle}**. I can help explain concepts, provide study tips, and answer questions. What would you like to know?`;
      } else {
        return "Hello! 👋 I am your AI learning assistant. I can help with programming concepts, study tips, and answer questions. What would you like to learn about?";
      }
    }

    return "I am here to help you learn! I can explain programming concepts, provide study tips, and answer questions. What specific topic would you like to know more about?";
  }

  public async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      this.conversationHistory.push(userMessage);

      let response: string;
      try {
        response = await this.callFreeAI(message);
      } catch (error) {
        console.warn("Error in callFreeAI, using fallback:", error);
        response = this.getSmartResponse(message);
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      this.conversationHistory.push(assistantMessage);

      return { response };
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return {
        response: this.getSmartResponse(message),
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public async getStudyTips(topic?: string): Promise<string> {
    if (topic) {
      return `Here are 5 study tips for ${topic}: 1. Practice coding daily 2. Build small projects 3. Read others code 4. Use active recall 5. Take regular breaks`;
    }
    return "Here are 5 study tips: 1. Practice coding daily 2. Build small projects 3. Read others code 4. Use active recall 5. Take regular breaks";
  }

  public async explainConcept(concept: string): Promise<string> {
    return `I can explain ${concept}! What specific aspect would you like to know about?`;
  }

  public async getMotivationalMessage(): Promise<string> {
    return "You are doing great! Every expert was once a beginner. Keep practicing and you will improve! 💪";
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