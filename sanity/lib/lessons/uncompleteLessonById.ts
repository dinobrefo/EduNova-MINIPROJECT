import { client } from "../adminClient";
import { sanityFetch } from "../live";
import groq from "groq";
import { getStudentByClerkId } from "../student/getStudentByClerkId";

interface UncompleteLessonParams {
  lessonId: string;
  clerkId: string;
}

export async function uncompleteLessonById({
  lessonId,
  clerkId,
}: UncompleteLessonParams) {
  try {
    // Get Sanity student ID from Clerk ID
    const student = await getStudentByClerkId(clerkId);

    if (!student?.data?._id) {
      throw new Error("Student not found");
    }

    const studentId = student.data._id;

    // Find and delete the lesson completion record
    await client.delete({
      query: `*[_type == "lessonCompletion" && student._ref == $studentId && lesson._ref == $lessonId][0]`,
      params: { studentId, lessonId },
    });
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    throw error;
  }
}
