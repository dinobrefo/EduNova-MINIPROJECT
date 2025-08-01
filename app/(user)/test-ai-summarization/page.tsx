import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AIContentSummarizer } from "@/components/AIContentSummarizer";

export const dynamic = "force-dynamic";

export default async function TestAISummarizationPage() {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  // Sample lesson content for testing
  const sampleContent = `
  JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. It enables interactive web pages and is an essential part of web applications.

  Key Features of JavaScript:
  - Dynamic typing: Variables can hold different types of data
  - Object-oriented: Supports object-oriented programming paradigms
  - Event-driven: Responds to user interactions and events
  - Asynchronous: Can handle operations without blocking the main thread

  JavaScript was created by Brendan Eich at Netscape in 1995. Originally called LiveScript, it was renamed to JavaScript to capitalize on the popularity of Java at the time. Despite the name similarity, JavaScript and Java are completely different languages.

  Modern JavaScript (ES6+) includes features like:
  - Arrow functions for concise function syntax
  - Template literals for string interpolation
  - Destructuring assignment for extracting values
  - Classes for object-oriented programming
  - Modules for code organization
  - Promises and async/await for asynchronous programming

  JavaScript can run in browsers and on servers (Node.js), making it a versatile language for full-stack development. It's used for creating interactive websites, web applications, mobile apps, and even desktop applications.
  `;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">AI Content Summarization Test</h1>
            <p className="text-muted-foreground mb-6">
              This page tests the AI-powered content summarization feature. The AI can analyze lesson content and provide summaries, study notes, and key concepts.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Sample Lesson Content</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p className="text-sm leading-relaxed">{sampleContent}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
            <AIContentSummarizer 
              content={sampleContent}
              lessonTitle="Introduction to JavaScript"
            />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Setup Required
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              To use the AI summarization feature, you need to:
            </p>
            <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 ml-4">
              <li>1. Get an OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">https://platform.openai.com/api-keys</a></li>
              <li>2. Add <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">OPENAI_API_KEY=your-api-key-here</code> to your <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env.local</code> file</li>
              <li>3. Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 