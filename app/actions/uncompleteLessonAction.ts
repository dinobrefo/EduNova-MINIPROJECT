"use server";

import { uncompleteLessonById } from "@/sanity/lib/lessons/uncompleteLessonById";

export async function uncompleteLessonAction(
  lessonId: string,
  clerkId: string
) {
  try {
    console.log("Starting lesson uncompletion for:", { lessonId, clerkId });
    
    await uncompleteLessonById({
      lessonId,
      clerkId,
    });

    console.log("Lesson uncompletion successful");
    return { success: true };
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    throw error;
  }
}
