export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import { CourseCardWithEnrollment } from "@/components/CourseCardWithEnrollment";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import { GetCoursesQueryResult } from "@/sanity.types";

export default async function TestEnrollmentPage() {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  const courses = await getCourses();

  // Check enrollment status for each course
  const coursesWithEnrollmentStatus = await Promise.all(
    courses.slice(0, 3).map(async (course: GetCoursesQueryResult[number]) => {
      let isEnrolled = false;
      
      try {
        isEnrolled = await isEnrolledInCourse(user.id, course._id);
      } catch (error) {
        console.error(`Error checking enrollment for course ${course._id}:`, error);
      }

      return {
        ...course,
        isEnrolled,
      };
    })
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Enrollment Functionality</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coursesWithEnrollmentStatus.map((course) => (
          <CourseCardWithEnrollment
            key={course._id}
            course={course}
            href={`/courses/${course.slug || ''}`}
            showEnrollmentButton={true}
            isEnrolled={course.isEnrolled}
          />
        ))}
      </div>
    </div>
  );
} 