import groq from "groq";
import { sanityFetch } from "../live";

export async function getLessonById(id: string) {
  const result = await sanityFetch({
    query: groq`*[_type == "lesson" && _id == $id][0] {
      ...,
      "module": module->{...},
      "course": course->{...}
    }`,
    params: { id },
  });

  // Extract data from sanityFetch response
  const data = result?.data || result;
  return data;
}
