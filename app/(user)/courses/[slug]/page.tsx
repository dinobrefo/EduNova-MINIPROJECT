export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import EnrollButton from "@/components/EnrollButton";
import { auth } from "@clerk/nextjs/server";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Module {
  _id: string;
  title: string;
  lessons?: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
}

export default async function CoursePage({ params }: CoursePageProps) {
  try {
    const { slug } = await params;
    const course = await getCourseBySlug(slug);
    
    // Handle auth safely
    let userId: string | null = null;
    try {
      const { userId: authUserId } = await auth();
      userId = authUserId;
    } catch {
      console.log("User not authenticated");
    }

    // getCourseBySlug now returns the data directly
    const courseData = course;

    const isEnrolled =
      userId && courseData?._id
        ? await isEnrolledInCourse(userId, courseData._id)
        : false;

    if (!courseData) {
      return (
        <div className="container mx-auto px-4 py-8 mt-16">
          <h1 className="text-4xl font-bold">Course not found</h1>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          {courseData.image && (
            <Image
              src={urlFor(courseData.image).url() || ""}
              alt={courseData.title || "Course Title"}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/60" />
          <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
            <Link
              href="/"
              prefetch={false}
              className="text-white mb-8 flex items-center hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Courses
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                    {courseData.category?.name || "Uncategorized"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {courseData.title}
                </h1>
                <p className="text-lg text-white/90 max-w-2xl">
                  {courseData.description}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:min-w-[300px]">
                <div className="text-3xl font-bold text-white mb-4">
                  Free Course
                </div>
                <EnrollButton courseId={courseData._id} isEnrolled={isEnrolled} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 mb-8 border border-border">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                {courseData.modules && courseData.modules.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.modules.map((module: Module, index: number) => (
                      <div
                        key={module._id}
                        className="border border-border rounded-lg"
                      >
                        <div className="p-4 border-b border-border">
                          <h3 className="font-medium">
                            Module {index + 1}: {module.title}
                          </h3>
                        </div>
                        {module.lessons && module.lessons.length > 0 ? (
                          <div className="divide-y divide-border">
                            {module.lessons.map((lesson: Lesson, lessonIndex: number) => (
                              <div
                                key={lesson._id}
                                className="p-4 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                                    {lessonIndex + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{lesson.title}</h4>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-muted-foreground">
                            No lessons in this module yet.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No course content available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                <div className="space-y-3">
                  {courseData.instructor && (
                    <div>
                      <span className="text-sm text-muted-foreground">Instructor:</span>
                      <p className="font-medium">{courseData.instructor.name}</p>
                    </div>
                  )}
                  {courseData.category && (
                    <div>
                      <span className="text-sm text-muted-foreground">Category:</span>
                      <p className="font-medium">{courseData.category.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enrollment Status */}
              {userId && (
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm font-medium">Enrolled</span>
                      </div>
                      <Link
                        href={`/dashboard/courses/${courseData._id}`}
                        className="block w-full text-center bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        <span className="text-sm">Not Enrolled</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enroll to start learning and track your progress.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold">Error loading course</h1>
        <p className="text-muted-foreground mt-2">
          There was an error loading this course. Please try again later.
        </p>
      </div>
    );
  }
}
