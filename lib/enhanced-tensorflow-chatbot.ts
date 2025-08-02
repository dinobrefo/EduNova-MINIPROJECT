import natural from 'natural';
import { ProductionWebSearch, WebSearchResult } from './production-web-search';

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  error?: string;
  confidence?: number;
  sources?: string[];
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



export class EnhancedTensorFlowChatbot {
  private tokenizer: natural.WordTokenizer;
  private trainingData: TrainingData[] = [];
  private conversationHistory: ChatMessage[] = [];
  private context: LearningContext = {};
  private isModelTrained: boolean = false;
  private wordVectors: Map<string, number[]> = new Map();
  private patternVectors: Map<string, number[]> = new Map();
  private searchCache: Map<string, WebSearchResult[]> = new Map();
  private webSearch: ProductionWebSearch | null = null;

  constructor(context?: LearningContext, apiKey?: string, searchEngineId?: string) {
    this.tokenizer = new natural.WordTokenizer();
    if (context) {
      this.context = context;
    }
    if (apiKey && searchEngineId) {
      this.webSearch = new ProductionWebSearch(apiKey, searchEngineId);
    }
    this.initializeTrainingData();
  }

  private initializeTrainingData(): void {
    this.trainingData = [
      {
        patterns: ["hello", "hi", "hey", "good morning", "goodbye", "bye"],
        responses: ["Hello! 👋 I'm your AI learning assistant with web search capabilities. How can I help you today?"],
        tag: "greeting"
      },
      {
        patterns: ["study tips", "how to study", "learning methods", "study advice"],
        responses: ["Here are 5 study tips: 1. Use active recall 2. Practice spaced repetition 3. Take breaks 4. Connect concepts 5. Teach others"],
        tag: "study_tips"
      },
      {
        patterns: ["motivation", "encouragement", "inspiration"],
        responses: ["Remember: Every expert was once a beginner. Keep going, you're doing great! 🌟"],
        tag: "motivation"
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

  private async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      if (this.searchCache.has(query)) {
        return this.searchCache.get(query)!;
      }

      console.log(`Searching web for: ${query}`);

      // Use real web search if API keys are provided
      if (this.webSearch) {
        const results = await this.webSearch.searchWeb(query);
        this.searchCache.set(query, results);
        return results;
      }
      
      // Fallback to simulated search if no API keys provided
      return this.simulateWebSearch(query);
    } catch (error) {
      console.error('Error searching web:', error);
      return [];
    }
  }

  private async simulateWebSearch(query: string): Promise<WebSearchResult[]> {
    // This is a simulated web search that provides realistic-looking results
    // In production, replace this with actual API calls to Google Custom Search, Bing, etc.
    
    const mockResults = [
      {
        title: `Latest information about ${query} - 2024`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Comprehensive guide and latest updates about ${query}. Find detailed information, tutorials, and best practices.`
      },
      {
        title: `${query} - Complete Guide`,
        url: `https://docs.example.com/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
        snippet: `Official documentation and tutorials for ${query}. Learn from experts and get started quickly.`
      },
      {
        title: `${query} - Best Practices & Examples`,
        url: `https://blog.example.com/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
        snippet: `Real-world examples and best practices for ${query}. Practical tips and code samples included.`
      }
    ];

    this.searchCache.set(query, mockResults);
    return mockResults;
  }

  private async generateResponseWithWebData(input: string, searchResults: WebSearchResult[]): Promise<string> {
    if (searchResults.length === 0) {
      return this.getFallbackResponse(input).response;
    }

    const sources = searchResults.map(result => result.url);
    const snippets = searchResults.map(result => result.snippet || result.content || '').filter(s => s.length > 0);
    
    // Create a more intelligent, synthesized response
    let response = '';
    
    if (snippets.length > 0) {
      // Extract key information and create a coherent answer
      const allContent = snippets.join(' ');
      const cleanContent = allContent
        .replace(/\s+/g, ' ')
        .replace(/\.\.\./g, '.')
        .replace(/\[.*?\]/g, '') // Remove brackets
        .replace(/\(.*?\)/g, '') // Remove parentheses
        .replace(/\d+ hours? ago/g, 'recently') // Simplify time references
        .replace(/\d+ days? ago/g, 'recently')
        .replace(/\d+ upvotes?/g, '') // Remove Reddit-style metadata
        .replace(/\d+ comments?/g, '')
        .trim();
      
      // Create a more natural, conversational response
      const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who'];
      const isQuestion = questionWords.some(word => input.toLowerCase().includes(word));
      
      // Extract the most relevant sentence or two
      const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const relevantSentences = sentences.slice(0, 2).join('. ').trim();
      
      if (isQuestion) {
        // For questions, provide a direct answer
        if (relevantSentences) {
          response = relevantSentences;
          if (!response.endsWith('.') && !response.endsWith('!') && !response.endsWith('?')) {
            response += '.';
          }
        } else {
          response = `Based on current information, ${cleanContent.substring(0, 400)}`;
          if (cleanContent.length > 400) {
            response += '...';
          }
        }
      } else {
        // For statements/topics, provide context and information
        if (relevantSentences) {
          response = relevantSentences;
          if (!response.endsWith('.') && !response.endsWith('!') && !response.endsWith('?')) {
            response += '.';
          }
        } else {
          response = `Here's what I found about ${input}: ${cleanContent.substring(0, 400)}`;
          if (cleanContent.length > 400) {
            response += '...';
          }
        }
      }
      
      // Add a subtle source note only if we have good content
      if (sources.length > 0 && response.length > 50) {
        response += `\n\n*Updated information from recent sources*`;
      }
    } else {
      response = `I found some information about ${input}, but couldn't extract the specific details. You might want to search for this topic directly.`;
    }
    
    return response;
  }

  public async trainModel(): Promise<void> {
    try {
      console.log('Starting Enhanced TensorFlow-inspired Chatbot training...');
      
      this.trainingData.forEach(data => {
        data.patterns.forEach(pattern => {
          const words = this.preprocessText(pattern);
          const vector = this.createWordVector(words);
          this.patternVectors.set(pattern, vector);
        });
      });

      this.isModelTrained = true;
      console.log('Enhanced model training completed!');
      
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  }

  private async predictResponse(input: string): Promise<{ response: string; confidence: number; shouldSearch: boolean }> {
    if (!this.isModelTrained) {
      return { ...this.getFallbackResponse(input), shouldSearch: false };
    }

    try {
      const inputWords = this.preprocessText(input);
      const inputVector = this.createWordVector(inputWords);
      
      let bestSimilarity = 0;
      let bestTag = '';
      let shouldSearch = false;

      const lowerInput = input.toLowerCase();
      
      // Check for mathematical expressions first
      const mathResult = this.evaluateMathExpression(input);
      if (mathResult !== null) {
        return { 
          response: `The answer is ${mathResult}`,
          confidence: 0.95,
          shouldSearch: false
        };
      }
      
      // Enhanced web search triggers - be more aggressive about searching
      const searchKeywords = [
        'search', 'find', 'look up', 'what is', 'who is', 'latest', 'news',
        'explain', 'how to', 'tutorial', 'guide', 'help', 'information',
        'current', 'recent', 'update', 'trend', 'technology', 'framework',
        'library', 'tool', 'platform', 'service', 'api', 'database',
        'algorithm', 'method', 'technique', 'approach', 'strategy'
      ];
      
      const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who'];
      const hasQuestionWord = questionWords.some(word => lowerInput.includes(word));
      const hasSearchKeyword = searchKeywords.some(keyword => lowerInput.includes(keyword));
      
      // Trigger web search for questions or search-related queries
      if (hasQuestionWord || hasSearchKeyword || input.length > 10) {
        shouldSearch = true;
      }

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

      // Only use training data for very specific patterns (greetings, study tips)
      if (bestSimilarity > 0.7 && (bestTag === 'greeting' || bestTag === 'study_tips')) {
        const matchingData = this.trainingData.find(data => data.tag === bestTag);
        if (matchingData) {
          const responses = matchingData.responses;
          const response = responses[Math.floor(Math.random() * responses.length)];
          return { response, confidence: bestSimilarity, shouldSearch };
        }
      }

      // For most other queries, prefer web search
      if (shouldSearch) {
        return { 
          response: "Let me search for current information about that for you...",
          confidence: 0.8,
          shouldSearch: true
        };
      }

      return { ...this.getFallbackResponse(input), shouldSearch };
      
    } catch (error) {
      console.error('Error in prediction:', error);
      return { ...this.getFallbackResponse(input), shouldSearch: false };
    }
  }

  private getFallbackResponse(input: string): { response: string; confidence: number } {
    const lowerInput = input.toLowerCase();
    
    if (this.context.courseTitle && this.context.lessonTitle) {
      return {
        response: `I'm here to help with your ${this.context.courseTitle} course, specifically the lesson on ${this.context.lessonTitle}. What would you like to know?`,
        confidence: 0.5
      };
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return {
        response: "Hello! 👋 I'm your AI learning assistant with web search capabilities. How can I help you with your studies today?",
        confidence: 0.8
      };
    }
    
    return {
      response: "I'm here to help you learn! I can provide study tips, explain concepts, offer motivation, and search the web for current information. What would you like to explore?",
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

      const { response: baseResponse, confidence, shouldSearch } = await this.predictResponse(message);

      let finalResponse = baseResponse;
      let sources: string[] = [];

      if (shouldSearch) {
        const searchResults = await this.searchWeb(message);
        if (searchResults.length > 0) {
          finalResponse = await this.generateResponseWithWebData(message, searchResults);
          sources = searchResults.map(result => result.url);
        }
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: finalResponse,
        timestamp: new Date(),
      };
      this.conversationHistory.push(assistantMessage);

      return { 
        response: finalResponse,
        confidence,
        sources: sources.length > 0 ? sources : undefined
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

  public clearSearchCache(): void {
    this.searchCache.clear();
  }

  private evaluateMathExpression(input: string): number | null {
    try {
      // Clean the input - remove extra spaces and common math words
      const cleanInput = input.toLowerCase()
        .replace(/[^0-9+\-*/().,]/g, '') // Keep only numbers and basic operators
        .replace(/\s+/g, ''); // Remove spaces
      
      // Check if it looks like a math expression
      const hasNumbers = /\d/.test(cleanInput);
      const hasOperators = /[+\-*/]/.test(cleanInput);
      
      if (!hasNumbers || !hasOperators) {
        return null;
      }
      
      // For safety, only allow simple expressions
      const safeExpression = /^[\d+\-*/().\s]+$/.test(cleanInput);
      if (!safeExpression) {
        return null;
      }
      
      // Evaluate the expression
      const result = eval(cleanInput);
      
      // Check if result is a valid number
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      }
      
      return null;
    } catch {
      return null;
    }
  }
} 