"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Mail } from "lucide-react";

interface EmailPreviewProps {
  subject: string;
  body: string;
  onClose: () => void;
}

export function EmailPreview({ subject, body, onClose }: EmailPreviewProps) {
  return (
    <Card className="border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Generated Email Preview</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">SUBJECT</p>
          <p className="text-sm font-semibold">{subject}</p>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-medium text-muted-foreground">BODY</p>
          <div className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
            {body}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(body);
            }}
          >
            Copy to Clipboard
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
