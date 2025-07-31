"use server";

import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

export async function enrollInCourse(courseId: string, userId: string) {
  try {
    // 1. Query course details from Sanity
    const course = await getCourseById(courseId);
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    if (!emailAddresses || !email) {
      throw new Error("User details not found");
    }

    if (!course) {
      throw new Error("Course not found");
    }

    // Create a user in sanity if it doesn't exist
    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Create enrollment directly (all courses are free)
    console.log(`Creating enrollment for course: ${course.title}`);
    
    await createEnrollment({
      studentId: user._id,
      courseId: course._id,
      paymentId: "free",
      amount: 0,
    });

    console.log(`Enrollment created successfully. Redirecting to: /courses/${course.slug?.current}`);
    return { url: `/courses/${course.slug?.current}` };
    
  } catch (error) {
    console.error("Error in enrollInCourse:", error);
    throw new Error("Failed to enroll in course");
  }
}
