import Hero from "@/components/Hero";
import { CourseCardWithEnrollment } from "@/components/CourseCardWithEnrollment";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import { GetCoursesQueryResult } from "@/sanity.types";
import { currentUser } from "@clerk/nextjs/server";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  const courses = await getCourses();
  const user = await currentUser();

  // Check enrollment status for each course if user is signed in
  const coursesWithEnrollmentStatus = await Promise.all(
    courses.map(async (course: GetCoursesQueryResult[number]) => {
      let isEnrolled = false;
      
      if (user?.id) {
        try {
          isEnrolled = await isEnrolledInCourse(user.id, course._id);
        } catch (error) {
          console.error(`Error checking enrollment for course ${course._id}:`, error);
        }
      }

      return {
        ...course,
        isEnrolled,
      };
    })
  );

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {coursesWithEnrollmentStatus.map((course) => {
            return (
              <CourseCardWithEnrollment
                key={course._id}
                course={course}
                href={`/courses/${course.slug || ''}`}
                showEnrollmentButton={true}
                isEnrolled={course.isEnrolled}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
