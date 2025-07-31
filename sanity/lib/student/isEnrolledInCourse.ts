import groq from "groq";
import { sanityFetch } from "../live";

export async function isEnrolledInCourse(clerkId: string, courseId: string) {
  try {
    // First get the student document using clerkId
    const student = await sanityFetch({
      query: groq`*[_type == "student" && clerkId == $clerkId][0]`,
      params: { clerkId },
    });

    if (!student) {
      return false;
    }

    // Extract the actual student data
    const studentData = student?.data || student;

    if (!studentData?._id) {
      return false;
    }

    // Then check for enrollment using the student's Sanity document ID
    const enrollment = await sanityFetch({
      query: groq`*[_type == "enrollment" && student._ref == $studentId && course._ref == $courseId][0]`,
      params: { 
        studentId: studentData._id, 
        courseId 
      },
    });

    return !!enrollment;
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return false;
  }
}
