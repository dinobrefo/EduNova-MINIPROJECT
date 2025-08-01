import natural from 'natural';

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  error?: string;
  confidence?: number;
}

export interface LearningContext {
  courseTitle?: string;
  lessonTitle?: string;
  currentTopic?: string;
  userProgress?: string;
}

export interface TrainingData {
  patterns: string[];
  responses: string[];
  tag: string;
}

export class TensorFlowChatbot {
  private tokenizer: natural.WordTokenizer;
  private trainingData: TrainingData[] = [];
  private conversationHistory: ChatMessage[] = [];
  private context: LearningContext = {};
  private isModelTrained: boolean = false;
  private wordVectors: Map<string, number[]> = new Map();
  private patternVectors: Map<string, number[]> = new Map();

  constructor(context?: LearningContext) {
    this.tokenizer = new natural.WordTokenizer();
    if (context) {
      this.context = context;
    }
    this.initializeTrainingData();
  }

  private initializeTrainingData(): void {
    this.trainingData = [
      {
        patterns: [
          "hello", "hi", "hey", "good morning", "good afternoon", "good evening",
          "how are you", "what's up", "greetings"
        ],
        responses: [
          "Hello! 👋 I'm your AI learning assistant. How can I help you today?",
          "Hi there! I'm here to help with your learning journey. What would you like to know?",
          "Hey! Ready to learn something new? What can I assist you with?"
        ],
        tag: "greeting"
      },
      {
        patterns: [
          "bye", "goodbye", "see you", "farewell", "take care", "exit", "quit"
        ],
        responses: [
          "Goodbye! Keep up the great work with your studies! 👋",
          "See you later! Don't forget to practice what you've learned!",
          "Take care! Remember, learning is a journey, not a destination."
        ],
        tag: "goodbye"
      },
      {
        patterns: [
          "study tips", "how to study", "study techniques", "learning methods",
          "best way to study", "study strategies", "improve learning"
        ],
        responses: [
          "Here are 5 effective study tips: 1. Use active recall techniques 2. Practice spaced repetition 3. Take regular breaks (25 min study, 5 min break) 4. Connect new concepts to things you already know 5. Teach others what you've learned",
          "Great study techniques include: 1. The Pomodoro Technique (25 min focused work) 2. Mind mapping for visual learners 3. Practice testing yourself 4. Get enough sleep 5. Stay hydrated and exercise",
          "To improve your learning: 1. Set specific goals 2. Use multiple learning methods 3. Review regularly 4. Apply what you learn 5. Stay curious and ask questions"
        ],
        tag: "study_tips"
      },
      {
        patterns: [
          "programming", "coding", "software development", "computer science",
          "javascript", "python", "java", "c++", "html", "css", "react", "node.js"
        ],
        responses: [
          "Programming is a valuable skill! Start with fundamentals like variables, functions, and control structures. Practice daily with small projects and build your way up to larger applications.",
          "Coding is all about problem-solving! Begin with a language like Python or JavaScript, learn the basics, and then work on real projects. Remember, every expert was once a beginner!",
          "Software development involves: 1. Learning programming fundamentals 2. Understanding algorithms and data structures 3. Practicing with projects 4. Learning version control (Git) 5. Staying updated with new technologies"
        ],
        tag: "programming"
      },
      {
        patterns: [
          "motivation", "encouragement", "feeling stuck", "want to give up",
          "difficult", "challenging", "overwhelmed", "frustrated"
        ],
        responses: [
          "Remember: Every expert was once a beginner! You're making progress even when it doesn't feel like it. Take it one step at a time, and celebrate your small victories. You've got this! 💪",
          "Learning is a journey with ups and downs. When you feel stuck, take a break, then come back with fresh eyes. You're capable of amazing things - keep pushing forward!",
          "It's normal to feel overwhelmed when learning something new. Break it down into smaller, manageable pieces. You're stronger than you think, and every challenge makes you better!"
        ],
        tag: "motivation"
      },
      {
        patterns: [
          "variable", "function", "class", "object", "array", "loop", "condition",
          "syntax", "debug", "error", "bug", "algorithm", "data structure"
        ],
        responses: [
          "A variable stores data in programming. Think of it like a labeled box where you can put different values. Functions are reusable blocks of code that perform specific tasks.",
          "Classes and objects are fundamental to object-oriented programming. A class is like a blueprint, and an object is an instance of that blueprint. Arrays store multiple values, and loops help you repeat actions.",
          "Programming concepts: Variables hold data, functions organize code, loops repeat actions, and conditions make decisions. Start with these basics and build your understanding step by step!"
        ],
        tag: "programming_concepts"
      }
    ];
  }

  private preprocessText(text: string): string[] {
    return this.tokenizer.tokenize(text.toLowerCase()) || [];
  }

  private createWordVector(words: string[]): number[] {
    const vector = new Array(100).fill(0);
    words.forEach((word, index) => {
      if (index < 100) {
        // Simple hash-based vector creation
        const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        vector[index] = (hash % 100) / 100;
      }
    });
    return vector;
  }

  private calculateSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  public async trainModel(): Promise<void> {
    try {
      console.log('Starting TensorFlow-inspired Chatbot training...');
      
      // Create word vectors for all training patterns
      this.trainingData.forEach(data => {
        data.patterns.forEach(pattern => {
          const words = this.preprocessText(pattern);
          const vector = this.createWordVector(words);
          this.patternVectors.set(pattern, vector);
        });
      });

      this.isModelTrained = true;
      console.log('Model training completed!');
      
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  }

  private async predictResponse(input: string): Promise<{ response: string; confidence: number }> {
    if (!this.isModelTrained) {
      return this.getFallbackResponse(input);
    }

    try {
      const inputWords = this.preprocessText(input);
      const inputVector = this.createWordVector(inputWords);
      
      let bestSimilarity = 0;
      let bestTag = '';

      // Find the best matching pattern
      this.trainingData.forEach(data => {
        data.patterns.forEach(pattern => {
          const patternVector = this.patternVectors.get(pattern);
          if (patternVector) {
            const similarity = this.calculateSimilarity(inputVector, patternVector);
            if (similarity > bestSimilarity) {
                           bestSimilarity = similarity;
             bestTag = data.tag;
            }
          }
        });
      });

      // If we have a good match, return a response
      if (bestSimilarity > 0.3) {
        const matchingData = this.trainingData.find(data => data.tag === bestTag);
        if (matchingData) {
          const responses = matchingData.responses;
          const response = responses[Math.floor(Math.random() * responses.length)];
          return { response, confidence: bestSimilarity };
        }
      }

      return this.getFallbackResponse(input);
      
    } catch (error) {
      console.error('Error in prediction:', error);
      return this.getFallbackResponse(input);
    }
  }

  private getFallbackResponse(input: string): { response: string; confidence: number } {
    const lowerInput = input.toLowerCase();
    
    // Context-aware responses
    if (this.context.courseTitle && this.context.lessonTitle) {
      return {
        response: `I'm here to help with your ${this.context.courseTitle} course, specifically the lesson on ${this.context.lessonTitle}. What would you like to know about this topic?`,
        confidence: 0.5
      };
    }
    
    // Keyword-based fallback
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return {
        response: "Hello! 👋 I'm your AI learning assistant. How can I help you with your studies today?",
        confidence: 0.8
      };
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return {
        response: "I'm here to help! I can provide study tips, explain concepts, offer motivation, and answer your learning questions. What would you like to know?",
        confidence: 0.7
      };
    }
    
    return {
      response: "I'm here to help you learn! I can provide study tips, explain concepts, offer motivation, and answer your questions. What specific topic would you like to explore?",
      confidence: 0.6
    };
  }

  public async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      this.conversationHistory.push(userMessage);

      const { response, confidence } = await this.predictResponse(message);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      this.conversationHistory.push(assistantMessage);

      return { 
        response,
        confidence
      };
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return {
        response: "I'm sorry, I'm having trouble right now. Please try again later!",
        error: error instanceof Error ? error.message : "Unknown error",
        confidence: 0.0
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

  public isTrained(): boolean {
    return this.isModelTrained;
  }
} 