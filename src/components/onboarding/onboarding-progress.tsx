import { Progress } from "@/components/ui/progress";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ["Business Info", "Target Area", "Email Setup", "Review"];

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-medium">{STEP_LABELS[currentStep - 1]}</span>
      </div>
      <Progress value={percent} className="h-2" />
      <div className="flex justify-between">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
              i < currentStep
                ? "bg-primary text-primary-foreground"
                : i === currentStep - 1
                ? "border-2 border-primary text-primary"
                : "border-2 border-muted text-muted-foreground"
            }`}
          >
            {i < currentStep ? "✓" : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
