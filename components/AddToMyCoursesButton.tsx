"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BookOpen, Check } from "lucide-react";
import { enrollInCourse } from "@/actions/enrollInCourse";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddToMyCoursesButtonProps {
  courseId: string;
  courseTitle: string;
  isEnrolled?: boolean;
}

export function AddToMyCoursesButton({ 
  courseId, 
  courseTitle, 
  isEnrolled = false 
}: AddToMyCoursesButtonProps) {
  const { user, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);

  const handleAddToMyCourses = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to add courses to your list");
      return;
    }

    setIsLoading(true);
    try {
      const result = await enrollInCourse(courseId, user!.id);
      
      if (result.url) {
        setEnrolled(true);
        toast.success(`${courseTitle} has been added to your courses!`);
      } else {
        toast.error("Failed to add course to your list");
      }
    } catch (error) {
      console.error("Error adding course to my courses:", error);
      toast.error("Failed to add course to your list");
    } finally {
      setIsLoading(false);
    }
  };

  if (enrolled) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        disabled
      >
        <Check className="h-4 w-4 mr-2" />
        Added to My Courses
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToMyCourses}
      disabled={isLoading}
      className="w-full"
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <BookOpen className="h-4 w-4 mr-2" />
      )}
      {isLoading ? "Adding..." : "Add to My Courses"}
    </Button>
  );
} 