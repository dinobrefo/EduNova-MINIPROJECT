import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getLessonById } from "@/sanity/lib/lessons/getLessonById";
import { PortableText } from "@portabletext/react";
import { LoomEmbed } from "@/components/LoomEmbed";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import { AIContentSummarizer } from "@/components/AIContentSummarizer";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await currentUser();
  const { courseId, lessonId } = await params;

  if (!user?.id) {
    return redirect("/");
  }

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  // Extract text content from PortableText for AI analysis
  const extractTextFromPortableText = (content: any): string => {
    if (!content) return "";
    
    let text = "";
    const extractText = (blocks: any[]) => {
      blocks.forEach((block) => {
        if (block._type === "block") {
          if (block.children) {
            block.children.forEach((child: any) => {
              if (child.text) {
                text += child.text + " ";
              }
            });
          }
        }
      });
    };
    
    extractText(content);
    return text.trim();
  };

  const lessonTextContent = lesson.content ? extractTextFromPortableText(lesson.content) : "";

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

          {lesson.description && (
            <p className="text-muted-foreground mb-8">{lesson.description}</p>
          )}

          <div className="space-y-8">
            {/* Video Section */}
            {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}

            {/* Loom Embed Video if loomUrl is provided */}
            {lesson.loomUrl && <LoomEmbed shareUrl={lesson.loomUrl} />}

            {/* AI Content Summarizer */}
            {lessonTextContent && (
              <AIContentSummarizer 
                content={lessonTextContent}
                lessonTitle={lesson.title}
              />
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Lesson Notes</h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <PortableText value={lesson.content} />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <LessonCompleteButton lessonId={lesson._id} clerkId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
