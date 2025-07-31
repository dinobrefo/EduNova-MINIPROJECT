import groq from "groq";
import { sanityFetch } from "../live";

export async function getLessonCompletionStatus(
  studentId: string,
  lessonId: string
) {
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
  return data;
}
