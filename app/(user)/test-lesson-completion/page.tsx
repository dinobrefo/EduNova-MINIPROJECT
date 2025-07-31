import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";

export const dynamic = "force-dynamic";

export default async function TestLessonCompletionPage() {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  // Use a test lesson ID - you can replace this with an actual lesson ID from your Sanity data
  const testLessonId = "35217b34-73cc-4a98-9a47-29c847426ab9"; // Replace with actual lesson ID

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
        <h1 className="text-3xl font-bold mb-8">Test Lesson Completion</h1>
        
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Lesson Completion Test</h2>
            <p className="text-muted-foreground mb-4">
              This page tests the lesson completion functionality. The button below should allow you to mark a lesson as complete or incomplete.
            </p>
            
            <div className="space-y-4">
              <div>
                <strong>User ID:</strong> {user.id}
              </div>
              <div>
                <strong>Test Lesson ID:</strong> {testLessonId}
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Completion Button</h3>
            <LessonCompleteButton lessonId={testLessonId} clerkId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 