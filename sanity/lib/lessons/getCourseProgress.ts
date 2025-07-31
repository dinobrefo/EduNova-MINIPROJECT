import groq from "groq";
import { sanityFetch } from "../live";
import { getStudentByClerkId } from "../student/getStudentByClerkId";
import { calculateCourseProgress } from "@/lib/courseProgress";
import { Module } from "@/sanity.types";

interface LessonCompletion {
  _id: string;
  lesson: {
    _id: string;
    title: string;
  };
  module: {
    _id: string;
    title: string;
  };
}

export async function getCourseProgress(clerkId: string, courseId: string) {
  try {
    // First get the student's Sanity ID
    const student = await getStudentByClerkId(clerkId);

    // Extract student data from sanityFetch response
    const studentData = student?.data || student;
    
    if (!studentData?._id) {
      // If student doesn't exist, return default progress
      console.log("Student not found, returning default progress");
      return {
        completedLessons: [],
        courseProgress: {
          courseId,
          completedLessons: [],
          totalLessons: 0,
          progressPercentage: 0
        },
      };
    }

    const result = await sanityFetch({
      query: groq`{
        "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
          ...,
          "lesson": lesson->{...},
          "module": module->{...}
        },
        "course": *[_type == "course" && _id == $courseId][0] {
          ...,
          "modules": modules[]-> {
            ...,
            "lessons": lessons[]-> {...}
          }
        }
      }`,
      params: { studentId: studentData._id, courseId },
    });

    // Extract data from sanityFetch response
    const data = result?.data || result;
    const { completedLessons = [], course } = data;

    // Calculate total lessons from course modules
    const modules = (course?.modules as Module[]) || [];
    const totalLessons = modules.reduce((total, module) => {
      return total + (module.lessons?.length || 0);
    }, 0);

    // Extract completed lesson IDs
    const completedLessonIds = completedLessons.map((completion: LessonCompletion) => completion.lesson?._id).filter(Boolean);

    // Calculate overall course progress
    const progressPercentage = calculateCourseProgress(completedLessonIds, totalLessons);

    return {
      completedLessons,
      courseProgress: {
        courseId,
        completedLessons: completedLessonIds,
        totalLessons,
        progressPercentage
      },
    };
  } catch (error) {
    console.error("Error getting course progress:", error);
    // Return default progress on any error
    return {
      completedLessons: [],
      courseProgress: {
        courseId,
        completedLessons: [],
        totalLessons: 0,
        progressPercentage: 0
      },
    };
  }
}
