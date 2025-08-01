"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  BookOpen, 
  Clock, 
  Target, 
  Loader2, 
  Sparkles,
  FileText,
  Lightbulb
} from "lucide-react";
import { 
  summarizeContentAction, 
  generateStudyNotesAction, 
  extractKeyConceptsAction 
} from "@/app/actions/summarizeContentAction";
import { cn } from "@/lib/utils";

interface AIContentSummarizerProps {
  content: string;
  lessonTitle: string;
  className?: string;
}

interface SummaryData {
  summary: string;
  keyPoints: string[];
  estimatedReadingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function AIContentSummarizer({ 
  content, 
  lessonTitle, 
  className 
}: AIContentSummarizerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [studyNotes, setStudyNotes] = useState<string>("");
  const [keyConcepts, setKeyConcepts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("summary");

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const result = await summarizeContentAction(content, lessonTitle);
      if (result.success) {
        setSummaryData(result.data);
        setActiveTab("summary");
      }
    } catch (error) {
      console.error("Error summarizing content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStudyNotes = async () => {
    setIsLoading(true);
    try {
      const result = await generateStudyNotesAction(content, lessonTitle);
      if (result.success) {
        setStudyNotes(result.data);
        setActiveTab("notes");
      }
    } catch (error) {
      console.error("Error generating study notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractConcepts = async () => {
    setIsLoading(true);
    try {
      const result = await extractKeyConceptsAction(content);
      if (result.success) {
        setKeyConcepts(result.data);
        setActiveTab("concepts");
      }
    } catch (error) {
      console.error("Error extracting concepts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Content Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={handleSummarize}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Summarize Content
            </Button>
            
            <Button
              onClick={handleGenerateStudyNotes}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Generate Study Notes
            </Button>
            
            <Button
              onClick={handleExtractConcepts}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
              Extract Key Concepts
            </Button>
          </div>

          {(summaryData || studyNotes || keyConcepts.length > 0) && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Study Notes
                </TabsTrigger>
                <TabsTrigger value="concepts" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Key Concepts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                {summaryData && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className={getDifficultyColor(summaryData.difficulty)}>
                        {summaryData.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {summaryData.estimatedReadingTime} min read
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Summary</h4>
                      <p className="text-sm leading-relaxed">{summaryData.summary}</p>
                    </div>

                    {summaryData.keyPoints.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Key Points
                        </h4>
                        <ul className="space-y-2">
                          {summaryData.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                {studyNotes && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Study Notes
                    </h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div 
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: studyNotes.replace(/\n/g, '<br>') 
                        }} 
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="concepts" className="space-y-4">
                {keyConcepts.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Key Concepts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {keyConcepts.map((concept, index) => (
                        <Badge key={index} variant="secondary">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 