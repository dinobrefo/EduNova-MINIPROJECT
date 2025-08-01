import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LearningChatbot } from "@/components/LearningChatbot";

export const dynamic = "force-dynamic";

export default async function TestChatbotPage() {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">AI Learning Assistant Test</h1>
            <p className="text-muted-foreground mb-6">
              This page tests the AI-powered learning chatbot. The chatbot can help with study tips, 
              concept explanations, motivation, and general learning questions.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">How to Use the Chatbot</h2>
            <div className="space-y-3 text-sm">
              <p>• <strong>Study Tips:</strong> Ask for study strategies and learning techniques</p>
              <p>• <strong>Concept Explanation:</strong> Get help understanding difficult topics</p>
              <p>• <strong>Motivation:</strong> Receive encouragement and motivation</p>
              <p>• <strong>General Questions:</strong> Ask any learning-related questions</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Sample Questions to Try</h2>
            <div className="space-y-2 text-sm">
              <p>• &ldquo;How can I improve my memory for studying?&rdquo;</p>
              <p>• &ldquo;What are some effective note-taking techniques?&rdquo;</p>
              <p>• &ldquo;I&apos;m feeling overwhelmed with my studies, can you help?&rdquo;</p>
              <p>• &ldquo;Explain the concept of [any topic you&apos;re learning]&rdquo;</p>
              <p>• &ldquo;Give me some motivation to keep learning&rdquo;</p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Setup Required
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              To use the AI chatbot, you need to:
            </p>
            <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 ml-4">
              <li>1. Get a free Hugging Face API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">https://huggingface.co/settings/tokens</a></li>
              <li>2. Add <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">HUGGINGFACE_API_KEY=your-api-key-here</code> to your <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env.local</code> file</li>
              <li>3. Restart your development server</li>
            </ol>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Features
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 ml-4">
              <li>• Free AI model (no OpenAI costs)</li>
              <li>• Context-aware responses based on current lesson</li>
              <li>• Quick action buttons for common requests</li>
              <li>• Chat history and conversation memory</li>
              <li>• Responsive design with dark mode support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI Learning Assistant */}
      <LearningChatbot 
        userId={user.id}
        context={{
          courseTitle: "Test Course",
          lessonTitle: "AI Chatbot Testing",
          currentTopic: "Learning Assistance"
        }}
      />
    </div>
  );
} 