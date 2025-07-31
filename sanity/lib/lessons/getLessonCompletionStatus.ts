import groq from "groq";
import { sanityFetch } from "../live";
import { getStudentByClerkId } from "../student/getStudentByClerkId";

export async function getLessonCompletionStatus(
  lessonId: string,
  clerkId: string
) {
  try {
    // Get Sanity student ID from Clerk ID
    const student = await getStudentByClerkId(clerkId);

    if (!student?.data?._id) {
      return false; // Student not found, so lesson is not completed
    }

    const studentId = student.data._id;

    const result = await sanityFetch({
      query: groq`*[_type == "lessonCompletion" && student._ref == $studentId && lesson._ref == $lessonId][0] {
        _id,
        _type,
        student,
        lesson,
        module,
        course,
        completedAt
      }`,
      params: { studentId, lessonId },
    });

    // Extract data from sanityFetch response
    const data = result?.data || result;
    return !!data; // Return true if completion exists, false otherwise
  } catch (error) {
    console.error("Error getting lesson completion status:", error);
    return false;
  }
}
