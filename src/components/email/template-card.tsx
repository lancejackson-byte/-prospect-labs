"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, Loader2 } from "lucide-react";

interface TemplateData {
  id: string;
  name: string;
  description: string;
  tone: string;
  length: string;
}

interface TemplateCardProps {
  template: TemplateData;
  onGenerate: (id: string) => void;
  isGenerating: boolean;
}

export function TemplateCard({ template, onGenerate, isGenerating }: TemplateCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{template.name}</CardTitle>
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex gap-2">
          <Badge variant="secondary">{template.tone}</Badge>
          <Badge variant="outline">{template.length}</Badge>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => onGenerate(template.id)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate Preview
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
