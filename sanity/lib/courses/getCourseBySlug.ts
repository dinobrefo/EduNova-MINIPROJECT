import { sanityFetch } from "../live";
import groq from "groq";

async function getCourseBySlug(slug: string) {
  const course = await sanityFetch({
    query: groq`*[_type == "course" && slug.current == $slug][0] {
      ...,
      "category": category->{...},
      "instructor": instructor->{...},
      "modules": modules[]-> {
        ...,
        "lessons": lessons[]-> {...}
      }
    }`,
    params: { slug },
  });

  // Handle both cases: when sanityFetch wraps data in a data property and when it doesn't
  return course?.data || course;
}

export default getCourseBySlug;
