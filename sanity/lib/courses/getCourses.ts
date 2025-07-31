import { sanityFetch } from "../live";
import groq from "groq";

export async function getCourses() {
  const courses = await sanityFetch({
    query: groq`*[_type == "course"] {
      ...,
      "slug": slug.current,
      "category": category->{...},
      "instructor": instructor->{...}
    }`,
  });
  
  return courses.data;
}
