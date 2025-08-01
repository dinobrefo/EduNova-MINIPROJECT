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

  private analyzeMessage(message: string): { type: string; topic?: string; concepts: string[] } {
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(' ');
    
    // Extract programming concepts
    const programmingTerms = ['variable', 'function', 'loop', 'array', 'object', 'class', 'method', 'algorithm', 'debug', 'code', 'programming', 'javascript', 'python', 'java', 'html', 'css', 'react', 'node', 'database', 'api'];
    
    // Extract math concepts
    const mathTerms = ['equation', 'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'probability', 'derivative', 'integral', 'function', 'graph', 'solve', 'calculate'];
    
    // Extract science concepts
    const scienceTerms = ['physics', 'chemistry', 'biology', 'experiment', 'hypothesis', 'theory', 'molecule', 'atom', 'cell', 'organism', 'energy', 'force', 'reaction'];
    
    const concepts = [];
    for (const word of words) {
      if (programmingTerms.includes(word)) concepts.push(word);
      if (mathTerms.includes(word)) concepts.push(word);
      if (scienceTerms.includes(word)) concepts.push(word);
    }
    
    // Determine message type
    if (lowerMessage.includes('what is') || lowerMessage.includes('explain') || lowerMessage.includes('how does')) {
      return { type: 'explanation', concepts };
    }
    
    if (lowerMessage.includes('how to') || lowerMessage.includes('steps') || lowerMessage.includes('process')) {
      return { type: 'how-to', concepts };
    }
    
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('tips')) {
      return { type: 'study-advice', concepts };
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('overwhelm')) {
      return { type: 'motivation', concepts };
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return { type: 'greeting', concepts };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('confused') || lowerMessage.includes('stuck')) {
      return { type: 'help', concepts };
    }
    
    return { type: 'general', concepts };
  }

  private getProgrammingExplanation(concept: string): string {
    const explanations: { [key: string]: string } = {
      'variable': `A **variable** is a container that stores data in programming. Think of it like a labeled box where you can put different types of information.

**Example in JavaScript:**
\`\`\`javascript
let name = "John";
let age = 25;
let isStudent = true;
\`\`\`

**Key points:**
• Variables have names (identifiers)
• They can store different data types (text, numbers, booleans)
• Values can be changed during program execution

Would you like me to explain more about data types or variable naming conventions?`,

      'function': `A **function** is a reusable block of code that performs a specific task. It's like a recipe that you can use over and over.

**Example in JavaScript:**
\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

// Using the function
console.log(greet("Alice")); // Output: Hello, Alice!
\`\`\`

**Key benefits:**
• Reusability - write once, use many times
• Organization - break complex tasks into smaller parts
• Maintainability - easier to update and debug

Would you like to learn about different types of functions or parameters?`,

      'loop': `A **loop** is a programming structure that repeats a block of code multiple times. It's like telling the computer "do this task until a certain condition is met."

**Common types of loops:**

1. **For Loop** - when you know how many times to repeat:
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("Count: " + i);
}
\`\`\`

2. **While Loop** - repeat while a condition is true:
\`\`\`javascript
let count = 0;
while (count < 3) {
  console.log("Count: " + count);
  count++;
}
\`\`\`

**When to use loops:**
• Processing lists of data
• Repeating calculations
• Automating repetitive tasks

Would you like examples of more complex loop scenarios?`,

      'array': `An **array** is a collection of items stored in a single variable. It's like a list where each item has a position.

**Example in JavaScript:**
\`\`\`javascript
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];

// Accessing elements (index starts at 0)
console.log(fruits[0]); // "apple"
console.log(fruits[1]); // "banana"

// Adding elements
fruits.push("grape");

// Looping through arrays
for (let fruit of fruits) {
  console.log(fruit);
}
\`\`\`

**Key concepts:**
• Index starts at 0 (first element is at position 0)
• Arrays can store different data types
• Length property tells you how many items
• Many built-in methods for manipulation

Would you like to learn about array methods like map, filter, and reduce?`,

      'object': `An **object** is a collection of related data and functions. It groups related information together.

**Example in JavaScript:**
\`\`\`javascript
let person = {
  name: "John",
  age: 30,
  city: "New York",
  greet: function() {
    return "Hello, I'm " + this.name;
  }
};

// Accessing properties
console.log(person.name); // "John"
console.log(person.greet()); // "Hello, I'm John"
\`\`\`

**Key concepts:**
• Properties store data (name, age, city)
• Methods are functions that belong to the object
• Use dot notation to access properties
• Objects can be nested (objects within objects)

Would you like to learn about object methods and advanced object concepts?`
    };
    
    return explanations[concept] || `"${concept}" is an important programming concept. To give you the most accurate explanation, could you provide more context about what specific aspect you'd like to understand?`;
  }

  private getMathExplanation(concept: string): string {
    const explanations: { [key: string]: string } = {
      'equation': `An **equation** is a mathematical statement that shows two expressions are equal, using the equals sign (=).

**Example:**
\`\`\`
2x + 3 = 11
\`\`\`

**To solve this equation:**
1. Subtract 3 from both sides: 2x = 8
2. Divide both sides by 2: x = 4

**Key concepts:**
• **Variables** (like x) represent unknown values
• **Constants** (like 3, 11) are fixed numbers
• **Operations** (+, -, ×, ÷) show relationships
• **Solution** is the value that makes the equation true

Would you like help with solving specific types of equations?`,

      'algebra': `**Algebra** is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations.

**Key concepts in algebra:**

1. **Variables** - letters that represent unknown values (x, y, z)
2. **Expressions** - combinations of variables, numbers, and operations
3. **Equations** - statements showing two expressions are equal
4. **Functions** - relationships between variables

**Example:**
\`\`\`
If 3x + 2 = 14, find x

Step 1: Subtract 2 from both sides
3x = 12

Step 2: Divide both sides by 3
x = 4
\`\`\`

Would you like to practice solving algebraic equations?`,

      'function': `A **function** in mathematics is a relationship between inputs and outputs, where each input has exactly one output.

**Example:**
\`\`\`
f(x) = 2x + 3
\`\`\`

**Key concepts:**
• **Input** (x) - the value you put into the function
• **Output** (f(x)) - the result you get out
• **Domain** - all possible input values
• **Range** - all possible output values

**Evaluating a function:**
If f(x) = 2x + 3, then:
• f(1) = 2(1) + 3 = 5
• f(2) = 2(2) + 3 = 7
• f(0) = 2(0) + 3 = 3

Would you like to learn about different types of functions or how to graph them?`
    };
    
    return explanations[concept] || `"${concept}" is an important mathematical concept. To give you the most accurate explanation, could you provide more context about what specific aspect you'd like to understand?`;
  }

  private getScienceExplanation(concept: string): string {
    const explanations: { [key: string]: string } = {
      'experiment': `An **experiment** is a scientific procedure to test a hypothesis and discover new information.

**Key components of an experiment:**

1. **Hypothesis** - a testable prediction about what you think will happen
2. **Variables** - factors that can change or be measured
   • **Independent variable** - what you change
   • **Dependent variable** - what you measure
   • **Control variables** - what you keep the same
3. **Procedure** - step-by-step instructions
4. **Results** - data and observations
5. **Conclusion** - what the results mean

**Example:** Testing if plants grow better with more sunlight
• Independent variable: amount of sunlight
• Dependent variable: plant growth
• Control: same soil, water, plant type

Would you like help designing an experiment for a specific topic?`,

      'hypothesis': `A **hypothesis** is an educated guess or prediction about what you think will happen in an experiment. It's based on observations and existing knowledge.

**Characteristics of a good hypothesis:**
• **Testable** - can be proven true or false through experimentation
• **Specific** - clearly states what you expect to happen
• **Based on evidence** - supported by previous research or observations

**Example:**
"Plants that receive more sunlight will grow taller than plants that receive less sunlight."

**Format:** "If [independent variable], then [dependent variable] because [reasoning]."

Would you like help formulating a hypothesis for your research question?`,

      'theory': `A **theory** is a well-substantiated explanation of some aspect of the natural world, based on evidence and testing.

**Key characteristics:**
• **Evidence-based** - supported by multiple experiments and observations
• **Testable** - can be proven false through experimentation
• **Predictive** - can make predictions about future observations
• **Comprehensive** - explains a wide range of phenomena

**Examples of scientific theories:**
• **Theory of Evolution** - explains how species change over time
• **Theory of Gravity** - explains how objects attract each other
• **Cell Theory** - explains that all living things are made of cells

**Difference from hypothesis:**
• **Hypothesis** - an educated guess (not yet tested)
• **Theory** - well-tested explanation (supported by evidence)

Would you like to learn about specific scientific theories or the scientific method?`
    };
    
    return explanations[concept] || `"${concept}" is an important scientific concept. To give you the most accurate explanation, could you provide more context about what specific aspect you'd like to understand?`;
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

      // Analyze the message
      const analysis = this.analyzeMessage(message);
      let response = '';

      // Generate appropriate response based on analysis
      switch (analysis.type) {
        case 'explanation':
          if (analysis.concepts.length > 0) {
            const concept = analysis.concepts[0];
            if (['variable', 'function', 'loop', 'array', 'object', 'class', 'method', 'algorithm', 'debug', 'code', 'programming'].includes(concept)) {
              response = this.getProgrammingExplanation(concept);
            } else if (['equation', 'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'probability', 'derivative', 'integral', 'function', 'graph', 'solve', 'calculate'].includes(concept)) {
              response = this.getMathExplanation(concept);
            } else if (['physics', 'chemistry', 'biology', 'experiment', 'hypothesis', 'theory', 'molecule', 'atom', 'cell', 'organism', 'energy', 'force', 'reaction'].includes(concept)) {
              response = this.getScienceExplanation(concept);
            } else {
              response = `Great question about ${concept}! Let me help you understand this concept.\n\n${this.getConceptExplanation(concept)}\n\nWould you like me to explain any specific aspect in more detail?`;
            }
          } else {
            response = `I'd be happy to explain that! To give you the most helpful explanation, could you provide more context about what specific concept or topic you'd like me to clarify?`;
          }
          break;

        case 'how-to':
          response = `I'd love to help you with that! To give you the best step-by-step guidance, could you provide more details about what you're trying to accomplish? This will help me give you specific instructions that are most relevant to your situation.`;
          break;

        case 'study-advice':
          response = `Here are **5 proven study techniques** that work for any subject:\n\n1. **Active Recall** - Test yourself instead of just re-reading\n2. **Spaced Repetition** - Review material at increasing intervals\n3. **Interleaving** - Mix different topics in one study session\n4. **Elaboration** - Explain concepts in your own words\n5. **Dual Coding** - Combine words with visual aids\n\n**Pro Tips:**\n• Study in 25-minute focused sessions (Pomodoro Technique)\n• Create your own examples and analogies\n• Teach the material to someone else\n• Get enough sleep - it helps memory consolidation\n• Stay hydrated and take regular breaks\n\nWhat specific subject are you studying? I can give you more targeted advice!`;
          break;

        case 'motivation':
          response = `You're doing amazing! 🌟 Here's your daily dose of motivation:\n\n**Remember these truths:**\n• Every expert was once a beginner\n• Progress, not perfection, is the goal\n• Small steps every day add up to big results\n• You're building valuable skills that will serve you well\n• Learning is a journey, not a destination\n\n**You are:**\n• Capable of learning anything you set your mind to\n• Stronger than any challenge you face\n• Worthy of success and achievement\n• Making progress every single day\n\n**Keep going because:**\n• Your future self will thank you\n• You're inspiring others around you\n• Every obstacle makes you stronger\n• Success is just around the corner\n\nYou've got this! 💪 What's one thing you're proud of accomplishing today?`;
          break;

        case 'greeting':
          const { courseTitle, lessonTitle } = this.context;
          if (courseTitle && lessonTitle) {
            response = `Hello! 👋 I'm your AI learning assistant for **${courseTitle}** - specifically the lesson on **${lessonTitle}**.\n\nI'm here to help you:\n\n• **Understand concepts** - Ask me to explain anything unclear\n• **Get study tips** - Learn effective strategies for this topic\n• **Stay motivated** - Get encouragement when you need it\n• **Answer questions** - Ask anything about what you're learning\n\nWhat would you like to know about ${lessonTitle}? Or do you have any questions about studying this topic? 😊`;
          } else {
            response = `Hello! 👋 I'm your AI learning assistant. I'm here to help you with:\n\n• **Study tips and strategies** - Learn more effectively\n• **Understanding difficult concepts** - Break down complex topics\n• **Motivation and encouragement** - Stay inspired and focused\n• **General learning questions** - Ask anything about your studies\n\nWhat would you like to learn about today? I'm excited to help you on your learning journey! 🌟`;
          }
          break;

        case 'help':
          response = `I'm here to help! 😊 Here are the different ways I can assist you:\n\n**📚 Study Support:**\n• Effective study techniques and strategies\n• Time management tips\n• Memory improvement methods\n• Note-taking strategies\n\n**🧠 Concept Help:**\n• Breaking down complex topics\n• Explaining difficult concepts\n• Providing examples and analogies\n• Connecting related ideas\n\n**💪 Motivation & Support:**\n• Encouragement when you're struggling\n• Strategies for overcoming obstacles\n• Building confidence and resilience\n• Celebrating your progress\n\n**🎯 General Learning:**\n• Answering questions about any subject\n• Providing resources and references\n• Helping you set learning goals\n• Guiding you through challenges\n\nWhat specific area would you like help with? Just ask me anything! 🌟`;
          break;

        default:
          response = `I'm here to support your learning journey! 🌟 I can help with:\n\n• **Study strategies** - Effective learning techniques\n• **Concept explanations** - Breaking down complex topics\n• **Motivation** - Encouragement and support\n• **Question answering** - Help with specific topics\n• **Time management** - Organizing your study time\n• **Memory techniques** - Improving retention\n\nWhat would you like to learn about or get help with? Just ask me anything! 😊`;
      }

      // Add AI response to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      this.conversationHistory.push(assistantMessage);

      return {
        response: response
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return {
        response: "I'm sorry, I'm having trouble right now. Please try again later!",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private getConceptExplanation(concept: string): string {
    return `"${concept}" is an important concept in this field. To give you the most accurate explanation, could you provide more context about what specific aspect you'd like to understand?`;
  }

  public async getStudyTips(topic?: string): Promise<string> {
    if (topic) {
      return `Here are 5 specific study tips for learning about **${topic}**:\n\n1. **Research the basics first** - Build a strong foundation\n2. **Create mind maps** - Visualize connections between concepts\n3. **Practice with examples** - Apply what you learn\n4. **Teach someone else** - Explaining reinforces understanding\n5. **Review regularly** - Spaced repetition helps retention\n\nWould you like me to elaborate on any of these techniques?`;
    }
    
    return `Here are **5 proven study techniques** that work for any subject:\n\n1. **Active Recall** - Test yourself instead of just re-reading\n2. **Spaced Repetition** - Review material at increasing intervals\n3. **Interleaving** - Mix different topics in one study session\n4. **Elaboration** - Explain concepts in your own words\n5. **Dual Coding** - Combine words with visual aids\n\n**Pro Tips:**\n• Study in 25-minute focused sessions (Pomodoro Technique)\n• Create your own examples and analogies\n• Teach the material to someone else\n• Get enough sleep - it helps memory consolidation\n• Stay hydrated and take regular breaks\n\nWhat specific subject are you studying? I can give you more targeted advice!`;
  }

  public async explainConcept(concept: string): Promise<string> {
    return this.getConceptExplanation(concept);
  }

  public async getMotivationalMessage(): Promise<string> {
    return `You're doing amazing! 🌟 Here's your daily dose of motivation:\n\n**Remember these truths:**\n• Every expert was once a beginner\n• Progress, not perfection, is the goal\n• Small steps every day add up to big results\n• You're building valuable skills that will serve you well\n• Learning is a journey, not a destination\n\n**You are:**\n• Capable of learning anything you set your mind to\n• Stronger than any challenge you face\n• Worthy of success and achievement\n• Making progress every single day\n\n**Keep going because:**\n• Your future self will thank you\n• You're inspiring others around you\n• Every obstacle makes you stronger\n• Success is just around the corner\n\nYou've got this! 💪 What's one thing you're proud of accomplishing today?`;
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