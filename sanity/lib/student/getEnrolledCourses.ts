import groq from "groq";
import { sanityFetch } from "../live";

export async function getEnrolledCourses(clerkId: string) {
  const result = await sanityFetch({
    query: groq`*[_type == "student" && clerkId == $clerkId][0] {
      "enrolledCourses": *[_type == "enrollment" && student._ref == ^._id] {
        ...,
        "course": course-> {
          ...,
          "slug": slug.current,
          "category": category->{...},
          "instructor": instructor->{...}
        }
      }
    }`,
    params: { clerkId },
  });

  // Extract data from sanityFetch response
  const data = result?.data || result;
  return data?.enrolledCourses || [];
}