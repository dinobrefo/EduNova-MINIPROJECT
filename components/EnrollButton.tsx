"use client";

import { enrollInCourse } from "@/actions/enrollInCourse";
import { useUser } from "@clerk/nextjs";
import { CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

function EnrollButton({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async (courseId: string) => {
    setError(null); // Clear any previous errors
    
    startTransition(async () => {
      try {
        const userId = user?.id;
        if (!userId) {
          setError("Please sign in to enroll");
          return;
        }

        const { url } = await enrollInCourse(courseId, userId);
        if (url) {
          router.push(url);
        } else {
          setError("Failed to enroll. Please try again.");
        }
      } catch (error) {
        console.error("Error in handleEnroll:", error);
        setError("Failed to enroll. Please try again.");
      }
    });
  };

  // Show loading state while checking user is loading
  if (!isUserLoaded || isPending) {
    return (
      <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show enrolled state with link to course
  if (isEnrolled) {
    return (
      <Link
        prefetch={false}
        href={`/dashboard/courses/${courseId}`}
        className="w-full rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
      >
        <span>Access Course</span>
        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>
    );
  }

  // Show enroll button only when we're sure user is not enrolled
  return (
    <div className="w-full">
      <button
        className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
          ${
            isPending || !user?.id
              ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
          }
        `}
        disabled={!user?.id || isPending}
        onClick={() => handleEnroll(courseId)}
      >
        {!user?.id ? (
          <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
            Sign in to Enroll
          </span>
        ) : (
          <span className={`${isPending ? "opacity-0" : "opacity-100"} flex items-center justify-center gap-2`}>
            <Play className="w-4 h-4" />
            Start Learning (Free)
          </span>
        )}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default EnrollButton;
