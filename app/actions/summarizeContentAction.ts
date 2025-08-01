"use server";

import { summarizeContent, generateStudyNotes, extractKeyConcepts } from "@/lib/ai";

export async function summarizeContentAction(
  content: string,
  lessonTitle: string = "Lesson"
) {
  try {
    console.log("Starting content summarization for:", lessonTitle);
    
    const summary = await summarizeContent({
      content,
      lessonTitle,
      maxLength: 200
    });

    console.log("Content summarization completed");
    return { success: true, data: summary };
  } catch (error) {
    console.error("Error in summarizeContentAction:", error);
    return { 
      success: false, 
      error: "Failed to summarize content",
      data: {
        summary: "Unable to generate summary at this time.",
        keyPoints: ["Content analysis temporarily unavailable"],
        estimatedReadingTime: 5,
        difficulty: 'intermediate' as const
      }
    };
  }
}

export async function generateStudyNotesAction(
  content: string,
  lessonTitle: string
) {
  try {
    console.log("Generating study notes for:", lessonTitle);
    
    const studyNotes = await generateStudyNotes(content, lessonTitle);

    console.log("Study notes generation completed");
    return { success: true, data: studyNotes };
  } catch (error) {
    console.error("Error in generateStudyNotesAction:", error);
    return { 
      success: false, 
      error: "Failed to generate study notes",
      data: "Unable to generate study notes at this time."
    };
  }
}

export async function extractKeyConceptsAction(content: string) {
  try {
    console.log("Extracting key concepts from content");
    
    const concepts = await extractKeyConcepts(content);

    console.log("Key concepts extraction completed");
    return { success: true, data: concepts };
  } catch (error) {
    console.error("Error in extractKeyConceptsAction:", error);
    return { 
      success: false, 
      error: "Failed to extract key concepts",
      data: []
    };
  }
} 