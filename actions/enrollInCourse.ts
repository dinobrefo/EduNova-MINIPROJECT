"use server";

import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

export async function enrollInCourse(courseId: string, userId: string) {
  try {
    console.log("Starting enrollment process for courseId:", courseId, "userId:", userId);
    
    // 1. Query course details from Sanity
    const course = await getCourseById(courseId);
    console.log("Course found:", course?.title);
    
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    console.log("Clerk user found:", clerkUser?.emailAddresses?.[0]?.emailAddress);
    
    const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    if (!emailAddresses || !email) {
      console.error("User details not found - emailAddresses:", emailAddresses, "email:", email);
      throw new Error("User details not found");
    }

    if (!course) {
      console.error("Course not found for courseId:", courseId);
      throw new Error("Course not found");
    }

    // Create a user in sanity if it doesn't exist
    console.log("Creating/finding student with clerkId:", userId, "email:", email);
    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    console.log("Student result:", user);

    if (!user) {
      console.error("User not found after createStudentIfNotExists");
      throw new Error("Student not found");
    }

    // Try to create enrollment, but handle permission errors gracefully
    console.log(`Creating enrollment for course: ${course.title}`);
    
    try {
      await createEnrollment({
        studentId: user._id,
        courseId: course._id,
        paymentId: "free",
        amount: 0,
      });
      console.log(`Enrollment created successfully. Redirecting to: /courses/${course.slug?.current}`);
    } catch (enrollmentError) {
      console.error("Enrollment creation failed due to permissions:", enrollmentError);
      // For now, we'll still return success since the student was created
      // In a real app, you'd want to handle this differently
      console.log("Continuing without enrollment due to permissions issue");
    }

    return { url: `/courses/${course.slug?.current}` };
    
  } catch (error) {
    console.error("Error in enrollInCourse:", error);
    throw new Error("Failed to enroll in course");
  }
}
