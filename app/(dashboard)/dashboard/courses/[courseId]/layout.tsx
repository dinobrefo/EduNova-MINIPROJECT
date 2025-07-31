import { redirect } from "next/navigation";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getCourseProgress } from "@/sanity/lib/lessons/getCourseProgress";
import { checkCourseAccess } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const user = await currentUser();
  const { courseId } = await params;

  if (!user?.id) {
    return redirect("/");
  }

  const authResult = await checkCourseAccess(user.id, courseId);
  if (!authResult.isAuthorized) {
    return redirect(authResult.redirect!);
  }

  try {
    const [course, progress] = await Promise.all([
      getCourseById(courseId),
      getCourseProgress(user.id, courseId),
    ]);

    if (!course) {
      return redirect("/my-courses");
    }

    return (
      <div className="h-full">
        <Sidebar course={course} completedLessons={progress.completedLessons} />
        <main className="h-full lg:pt-[64px] pl-20 lg:pl-96">{children}</main>
      </div>
    );
  } catch (error) {
    console.error("Error in CourseLayout:", error);
    return redirect("/my-courses");
  }
}
