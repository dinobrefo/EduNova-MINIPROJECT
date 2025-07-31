import groq from "groq";
import { sanityFetch } from "../live";

export async function getLessonCompletions(
  studentId: string,
  courseId: string
) {
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
    params: { studentId, courseId },
  });

  // Extract data from sanityFetch response
  const data = result?.data || result;
  const { course, completedLessons } = data;

  // Calculate module progress
  const moduleProgress = course?.modules?.map((module: any) => {
    const totalLessons = module.lessons?.length || 0;
    const completedInModule = completedLessons.filter(
      (completion: any) => completion.module?._id === module._id
    ).length;

    return {
      moduleId: module._id,
      title: module.title,
      progress: totalLessons > 0 ? (completedInModule / totalLessons) * 100 : 0,
      completedLessons: completedInModule,
      totalLessons,
    };
  });

  // Calculate overall course progress
  const totalLessons =
    course?.modules?.reduce(
      (acc: number, module: any) => acc + (module?.lessons?.length || 0),
      0
    ) || 0;

  const totalCompleted = completedLessons?.length || 0;
  const courseProgress =
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  return {
    completedLessons: completedLessons || [],
    moduleProgress: moduleProgress || [],
    courseProgress,
  };
}
