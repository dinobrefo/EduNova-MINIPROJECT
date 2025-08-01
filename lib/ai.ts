import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SummarizationRequest {
  content: string;
  lessonTitle?: string;
  maxLength?: number;
}

export interface SummarizationResponse {
  summary: string;
  keyPoints: string[];
  estimatedReadingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export async function summarizeContent({
  content,
  lessonTitle = 'Lesson',
  maxLength = 200
}: SummarizationRequest): Promise<SummarizationResponse> {
  try {
    const prompt = `
You are an expert educational content summarizer. Please analyze the following lesson content and provide:

1. A concise summary (max ${maxLength} words)
2. 3-5 key points as bullet points
3. Estimated reading time in minutes
4. Difficulty level (beginner/intermediate/advanced)

Lesson Title: ${lessonTitle}
Content: ${content}

Please respond in JSON format:
{
  "summary": "concise summary here",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "estimatedReadingTime": 5,
  "difficulty": "beginner"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an educational content summarizer. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(response) as SummarizationResponse;
    
    return {
      summary: parsedResponse.summary || 'Summary not available',
      keyPoints: parsedResponse.keyPoints || [],
      estimatedReadingTime: parsedResponse.estimatedReadingTime || 5,
      difficulty: parsedResponse.difficulty || 'intermediate'
    };

  } catch (error) {
    console.error('Error summarizing content:', error);
    
    // Fallback response
    return {
      summary: 'Unable to generate summary at this time.',
      keyPoints: ['Content analysis temporarily unavailable'],
      estimatedReadingTime: 5,
      difficulty: 'intermediate'
    };
  }
}

export async function generateStudyNotes(content: string, lessonTitle: string): Promise<string> {
  try {
    const prompt = `
Create comprehensive study notes for the following lesson content. Include:
- Main concepts and definitions
- Important formulas or code examples
- Common mistakes to avoid
- Practice questions or exercises
- Additional resources for further study

Lesson: ${lessonTitle}
Content: ${content}

Format the response in markdown with clear sections.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educator creating comprehensive study notes. Use markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Study notes not available';

  } catch (error) {
    console.error('Error generating study notes:', error);
    return 'Unable to generate study notes at this time.';
  }
}

export async function extractKeyConcepts(content: string): Promise<string[]> {
  try {
    const prompt = `
Extract the main concepts and key terms from this educational content. Return only the concepts as a simple list, one per line.

Content: ${content}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting key concepts from educational content. Return only the concepts, one per line."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content;
    return response ? response.split('\n').filter(line => line.trim()) : [];

  } catch (error) {
    console.error('Error extracting key concepts:', error);
    return [];
  }
} 