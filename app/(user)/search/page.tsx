import { Suspense } from "react";
import { CourseCard } from "@/components/CourseCard";
import { searchCourses } from "@/sanity/lib/courses/searchCourses";
import { GetCoursesQueryResult } from "@/sanity.types";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const courses = query ? await searchCourses(query) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search results for &ldquo;${query}&rdquo;` : "Search Courses"}
        </h1>
        {query && (
          <p className="text-muted-foreground">
            Found {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Enter a search term to find courses
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No courses found for &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div>Loading...</div>}>
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course as unknown as GetCoursesQueryResult[number]}
                href={`/courses/${course.slug.current}`}
              />
            ))}
          </Suspense>
        </div>
      )}
    </div>
  );
} 