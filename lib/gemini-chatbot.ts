import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Reusing interfaces to align with existing code
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

export class GeminiChatbot {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private history: ChatMessage[] = [];
    private context: LearningContext = {};

    constructor(apiKey: string, context?: LearningContext) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        if (context) {
            this.context = context;
        }
    }

    public updateContext(newContext: Partial<LearningContext>): void {
        this.context = { ...this.context, ...newContext };
    }

    public clearHistory(): void {
        this.history = [];
    }

    public getConversationHistory(): ChatMessage[] {
        return [...this.history];
    }

    private buildSystemPrompt(): string {
        let prompt = "You are an intelligent educational AI assistant for the EduNova platform. Your goal is to help students learn effectively.\n";

        if (this.context.courseTitle) {
            prompt += `The student is currently taking the course: "${this.context.courseTitle}".\n`;
        }
        if (this.context.lessonTitle) {
            prompt += `They are currently viewing the lesson: "${this.context.lessonTitle}".\n`;
        }
        if (this.context.currentTopic) {
            prompt += `The specific topic is: "${this.context.currentTopic}".\n`;
        }

        prompt += `
    Guidelines:
    - Be encouraging, patient, and clear.
    - If explaining a concept, use examples relevant to the course.
    - If the user asks for study tips, provide actionable advice.
    - If the user asks off-topic questions, gently guide them back to learning, but you can answer general queries too.
    - Format your responses with Markdown for readability (bold, lists, code blocks).
    `;

        return prompt;
    }

    public async sendMessage(message: string): Promise<ChatResponse> {
        try {
            const userMessage: ChatMessage = {
                role: "user",
                content: message,
                timestamp: new Date(),
            };
            this.history.push(userMessage);

            // Convert history to Gemini format
            // Note: Gemini API treats "history" as the chat session calls. 
            // We can use startChat or just generateContent with full history. 
            // For simplicity/statelessness in this class wrapper (assuming it might be re-instantiated), 
            // let's use startChat if we persist the instance, or send history.
            // Since this class is likely instantiated per request in Server Actions (stateless), 
            // we need to be careful. The current `chatbotActions.ts` caches instances in a Map.
            // So we CAN use `startChat` effectively.

            const chat = this.model.startChat({
                history: this.history.slice(0, -1).map(msg => ({ // Exclude the just-added message, send it as new
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.content }]
                })),
                systemInstruction: this.buildSystemPrompt(),
            });

            const result = await chat.sendMessage(message);
            const responseText = result.response.text();

            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: responseText,
                timestamp: new Date(),
            };
            this.history.push(assistantMessage);

            return {
                response: responseText,
                confidence: 1.0, // Real LLMs are confident :)
                // sources: [] // Gemini 1.5 Flash doesn't return sources by default unless using grounding tool
            };

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            return {
                response: "I'm having trouble connecting to my brain right now. Please make sure the API key is configured correctly.",
                error: error instanceof Error ? error.message : "Unknown error",
                confidence: 0.0
            };
        }
    }

    // Quick action helpers
    public async getStudyTips(topic?: string): Promise<string> {
        const prompt = topic
            ? `Give me 3 specific study tips for: ${topic}`
            : "Give me 3 general effective study tips.";
        const response = await this.sendMessage(prompt);
        return response.response;
    }

    public async explainConcept(concept: string): Promise<string> {
        const response = await this.sendMessage(`Explain the concept of "${concept}" simply.`);
        return response.response;
    }

    public async getMotivationalMessage(): Promise<string> {
        const response = await this.sendMessage("Give me a short, inspiring motivational quote for a student.");
        return response.response;
    }
}
