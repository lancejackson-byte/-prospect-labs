"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Plus, Trash2 } from "lucide-react";

interface SequenceStep {
  id: string;
  type: "email" | "delay";
  template_id?: string;
  delay_hours?: number;
}

interface SequenceBuilderProps {
  steps: SequenceStep[];
  onChange: (steps: SequenceStep[]) => void;
}

export function SequenceBuilder({ steps, onChange }: SequenceBuilderProps) {
  function addStep() {
    const newStep: SequenceStep = {
      id: crypto.randomUUID(),
      type: "email",
    };
    onChange([...steps, newStep]);
  }

  function removeStep(id: string) {
    onChange(steps.filter((s) => s.id !== id));
  }

  function updateStep(id: string, updates: Partial<SequenceStep>) {
    onChange(steps.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Campaign Sequence</Label>
        <Button variant="outline" size="sm" onClick={addStep}>
          <Plus className="mr-1 h-3 w-3" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No steps yet. Add email steps to build your sequence.
        </p>
      )}

      <div className="space-y-2">
        {steps.map((step, i) => (
          <Card key={step.id} className="flex items-center gap-3 p-3">
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {i + 1}
                </span>
                <span className="text-xs rounded bg-muted px-2 py-0.5">
                  {step.type === "email" ? "Email" : `Delay ${step.delay_hours || 0}h`}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => removeStep(step.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
