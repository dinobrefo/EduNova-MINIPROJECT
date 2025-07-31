"use server";

import { completeLessonById } from "@/sanity/lib/lessons/completeLessonById";

export async function completeLessonAction(lessonId: string, clerkId: string) {
  try {
    console.log("Starting lesson completion for:", { lessonId, clerkId });
    
    const result = await completeLessonById({
      lessonId,
      clerkId,
    });

    console.log("Lesson completion result:", result);
    return { success: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, error: "Failed to complete lesson" };
  }
}
