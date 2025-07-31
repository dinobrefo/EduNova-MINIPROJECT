import groq from "groq";
import { sanityFetch } from "../live";

interface Course {
  _id: string;
  _type: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  category?: {
    _id: string;
    title: string;
  };
  instructor?: {
    _id: string;
    name: string;
  };
}

export async function searchCourses(searchTerm: string): Promise<Course[]> {
  const result = await sanityFetch({
    query: groq`*[_type == "course" && (
      title match $searchTerm + "*" ||
      description match $searchTerm + "*" ||
      category->title match $searchTerm + "*"
    )] {
      ...,
      "category": category->{...},
      "instructor": instructor->{...}
    }`,
    params: { searchTerm },
  });

  // Extract data from sanityFetch response
  const data = result?.data || result;
  return data || [];
}
