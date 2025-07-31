export interface CourseProgress {
  courseId: string
  completedLessons: string[]
  totalLessons: number
  progressPercentage: number
}

export function calculateProgress(completedLessons: string[], totalLessons: number): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons.length / totalLessons) * 100)
}

export { calculateProgress as calculateCourseProgress }

export function getCourseProgress(courseId: string): CourseProgress {
  // This is a placeholder implementation
  // You'll need to implement actual progress tracking logic
  return {
    courseId,
    completedLessons: [],
    totalLessons: 0,
    progressPercentage: 0
  }
} 