import groq from "groq";
import { sanityFetch } from "../live";

export async function getStudentByClerkId(clerkId: string) {
  const student = await sanityFetch({
    query: groq`*[_type == "student" && clerkId == $clerkId][0] {
      _id,
      _type,
      clerkId,
      name,
      email,
      enrolledCourses[]-> {
        _id,
        _type,
        title,
        slug
      },
      _createdAt,
      _updatedAt
    }`,
    params: { clerkId },
  });

  return student;
}
