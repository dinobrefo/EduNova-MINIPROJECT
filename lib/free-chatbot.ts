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

export class FreeLearningChatbot {
  private conversationHistory: ChatMessage[] = [];
  private context: LearningContext = {};

  constructor(context?: LearningContext) {
    if (context) {
      this.context = context;
    }
  }

  private async callFreeAPI(message: string): Promise<string> {
    try {
      // Using a free API service (you can replace with other free APIs)
      const response = await fetch('https://api.freeapi.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: this.context
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.response || this.getIntelligentResponse(message);
      } else {
        return this.getIntelligentResponse(message);
      }
    } catch (error) {
      console.error('API call failed:', error);
      return this.getIntelligentResponse(message);
    }
  }

  private getIntelligentResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Programming concepts
    if (lowerMessage.includes('c++') || lowerMessage.includes('cpp')) {
      return `**C++** is a powerful programming language used for system software, game development, and high-performance applications. 

**Key Features:**
• Object-oriented programming
• Memory management control
• High performance and efficiency
• Rich standard library
• Cross-platform compatibility

**Basic Example:**
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\`

Would you like to learn about specific C++ concepts like variables, functions, or classes?`;
    }
    
    if (lowerMessage.includes('variable')) {
      return `A **variable** is a container that stores data in programming.

**In C++:**
\`\`\`cpp
int age = 25;           // integer variable
string name = "John";   // string variable
double price = 19.99;   // decimal variable
bool isActive = true;   // boolean variable
\`\`\`

**Key Points:**
• Variables have names (identifiers)
• They can store different data types
• Values can be changed during program execution
• Must be declared before use

Would you like to learn about different data types or variable naming conventions?`;
    }
    
    if (lowerMessage.includes('function')) {
      return `A **function** is a reusable block of code that performs a specific task.

**In C++:**
\`\`\`cpp
int add(int a, int b) {
    return a + b;
}

// Using the function
int result = add(5, 3); // result = 8
\`\`\`

**Key Benefits:**
• **Reusability** - write once, use many times
• **Organization** - break complex tasks into smaller parts
• **Maintainability** - easier to update and debug
• **Testing** - can test individual functions

Would you like to learn about different types of functions or parameters?`;
    }
    
    if (lowerMessage.includes('loop')) {
      return `A **loop** is a programming structure that repeats a block of code multiple times.

**Types of Loops in C++:**

1. **For Loop** - when you know how many times to repeat:
\`\`\`cpp
for (int i = 0; i < 5; i++) {
    cout << "Count: " << i << endl;
}
\`\`\`

2. **While Loop** - repeat while a condition is true:
\`\`\`cpp
int count = 0;
while (count < 3) {
    cout << "Count: " << count << endl;
    count++;
}
\`\`\`

**When to use loops:**
• Processing lists of data
• Repeating calculations
• Automating repetitive tasks

Would you like examples of more complex loop scenarios?`;
    }
    
    if (lowerMessage.includes('array')) {
      return `An **array** is a collection of items stored in a single variable.

**In C++:**
\`\`\`cpp
int numbers[5] = {1, 2, 3, 4, 5};
string fruits[3] = {"apple", "banana", "orange"};

// Accessing elements (index starts at 0)
cout << numbers[0]; // prints 1
cout << fruits[1];  // prints "banana"

// Looping through arrays
for (int i = 0; i < 5; i++) {
    cout << numbers[i] << " ";
}
\`\`\`

**Key Concepts:**
• Index starts at 0 (first element is at position 0)
• Arrays can store different data types
• Size must be declared when creating the array
• Many built-in methods for manipulation

Would you like to learn about array operations and algorithms?`;
    }
    
    // Study and learning
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tips')) {
      return `Here are **5 proven study techniques** that work for any subject:

1. **Active Recall** - Test yourself instead of just re-reading
2. **Spaced Repetition** - Review material at increasing intervals
3. **Interleaving** - Mix different topics in one study session
4. **Elaboration** - Explain concepts in your own words
5. **Dual Coding** - Combine words with visual aids

**Pro Tips:**
• Study in 25-minute focused sessions (Pomodoro Technique)
• Create your own examples and analogies
• Teach the material to someone else
• Get enough sleep - it helps memory consolidation
• Stay hydrated and take regular breaks

What specific subject are you studying? I can give you more targeted advice!`;
    }
    
    // Motivation
    if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('overwhelm')) {
      return `You're doing amazing! 🌟 Here's your daily dose of motivation:

**Remember these truths:**
• Every expert was once a beginner
• Progress, not perfection, is the goal
• Small steps every day add up to big results
• You're building valuable skills that will serve you well
• Learning is a journey, not a destination

**You are:**
• Capable of learning anything you set your mind to
• Stronger than any challenge you face
• Worthy of success and achievement
• Making progress every single day

**Keep going because:**
• Your future self will thank you
• You're inspiring others around you
• Every obstacle makes you stronger
• Success is just around the corner

You've got this! 💪 What's one thing you're proud of accomplishing today?`;
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const { courseTitle, lessonTitle } = this.context;
      if (courseTitle && lessonTitle) {
        return `Hello! 👋 I'm your AI learning assistant for **${courseTitle}** - specifically the lesson on **${lessonTitle}**.

I'm here to help you:
• **Understand concepts** - Ask me to explain anything unclear
• **Get study tips** - Learn effective strategies for this topic
• **Stay motivated** - Get encouragement when you need it
• **Answer questions** - Ask anything about what you're learning

What would you like to know about ${lessonTitle}? Or do you have any questions about studying this topic? 😊`;
      } else {
        return `Hello! 👋 I'm your AI learning assistant. I'm here to help you with:

• **Study tips and strategies** - Learn more effectively
• **Understanding difficult concepts** - Break down complex topics
• **Motivation and encouragement** - Stay inspired and focused
• **General learning questions** - Ask anything about your studies

What would you like to learn about today? I'm excited to help you on your learning journey! 🌟`;
      }
    }
    
    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('confused') || lowerMessage.includes('stuck')) {
      return `I'm here to help! 😊 Here are the different ways I can assist you:

**📚 Study Support:**
• Effective study techniques and strategies
• Time management tips
• Memory improvement methods
• Note-taking strategies

**🧠 Concept Help:**
• Breaking down complex topics
• Explaining difficult concepts
• Providing examples and analogies
• Connecting related ideas

**💪 Motivation & Support:**
• Encouragement when you're struggling
• Strategies for overcoming obstacles
• Building confidence and resilience
• Celebrating your progress

**🎯 General Learning:**
• Answering questions about any subject
• Providing resources and references
• Helping you set learning goals
• Guiding you through challenges

What specific area would you like help with? Just ask me anything! 🌟`;
    }
    
    // Default response
    return `I'm here to support your learning journey! 🌟 I can help with:

• **Study strategies** - Effective learning techniques
• **Concept explanations** - Breaking down complex topics
• **Motivation** - Encouragement and support
• **Question answering** - Help with specific topics
• **Time management** - Organizing your study time
• **Memory techniques** - Improving retention

What would you like to learn about or get help with? Just ask me anything! 😊`;
  }

  public async sendMessage(message: string): Promise<ChatResponse> {
    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date()
      };
      this.conversationHistory.push(userMessage);

      // Try to get response from free API, fallback to intelligent responses
      let response: string;
      try {
        response = await this.callFreeAPI(message);
      } catch (error) {
        response = this.getIntelligentResponse(message);
      }

      // Add AI response to history
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      this.conversationHistory.push(assistantMessage);

      return { response };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const fallbackResponse = this.getIntelligentResponse(message);
      
      return {
        response: fallbackResponse,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async getStudyTips(topic?: string): Promise<string> {
    if (topic) {
      return `Here are 5 specific study tips for learning about **${topic}**:

1. **Research the basics first** - Build a strong foundation
2. **Create mind maps** - Visualize connections between concepts
3. **Practice with examples** - Apply what you learn
4. **Teach someone else** - Explaining reinforces understanding
5. **Review regularly** - Spaced repetition helps retention

Would you like me to elaborate on any of these techniques?`;
    }
    
    return `Here are **5 proven study techniques** that work for any subject:

1. **Active Recall** - Test yourself instead of just re-reading
2. **Spaced Repetition** - Review material at increasing intervals
3. **Interleaving** - Mix different topics in one study session
4. **Elaboration** - Explain concepts in your own words
5. **Dual Coding** - Combine words with visual aids

**Pro Tips:**
• Study in 25-minute focused sessions (Pomodoro Technique)
• Create your own examples and analogies
• Teach the material to someone else
• Get enough sleep - it helps memory consolidation
• Stay hydrated and take regular breaks

What specific subject are you studying? I can give you more targeted advice!`;
  }

  public async explainConcept(concept: string): Promise<string> {
    return this.getIntelligentResponse(`explain ${concept}`);
  }

  public async getMotivationalMessage(): Promise<string> {
    return `You're doing amazing! 🌟 Here's your daily dose of motivation:

**Remember these truths:**
• Every expert was once a beginner
• Progress, not perfection, is the goal
• Small steps every day add up to big results
• You're building valuable skills that will serve you well
• Learning is a journey, not a destination

**You are:**
• Capable of learning anything you set your mind to
• Stronger than any challenge you face
• Worthy of success and achievement
• Making progress every single day

**Keep going because:**
• Your future self will thank you
• You're inspiring others around you
• Every obstacle makes you stronger
• Success is just around the corner

You've got this! 💪 What's one thing you're proud of accomplishing today?`;
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