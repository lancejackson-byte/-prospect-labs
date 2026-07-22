"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Joyride,
  type CallBackProps,
  type Step,
  STATUS,
  EVENTS,
  ACTIONS,
} from "react-joyride";
import { TOUR_STEPS, TOUR_LOCALSTORAGE_KEY } from "@/lib/tour/steps";

interface TourContextValue {
  startTour: () => void;
  isTourRunning: boolean;
}

const TourContext = createContext<TourContextValue>({
  startTour: () => {},
  isTourRunning: false,
});

export function useTour() {
  return useContext(TourContext);
}

interface TourProviderProps {
  children: ReactNode;
  userId?: string;
}

export function TourProvider({ children, userId }: TourProviderProps) {
  const router = useRouter();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Build a user-specific localStorage key
  const storageKey = userId
    ? `${TOUR_LOCALSTORAGE_KEY}-${userId}`
    : TOUR_LOCALSTORAGE_KEY;

  const startTour = useCallback(() => {
    setStepIndex(0);
    setRun(true);
  }, []);

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      const { action, index, status, type } = data;

      // Navigate to the route for the current step when advancing
      if (
        type === EVENTS.STEP_AFTER &&
        (action === ACTIONS.NEXT || action === ACTIONS.PREV)
      ) {
        const nextIndex = action === ACTIONS.NEXT ? index + 1 : index - 1;
        const step = TOUR_STEPS[nextIndex] as (typeof TOUR_STEPS)[number] & {
          route?: string;
        };
        if (step?.route) {
          router.push(step.route);
        }
        setStepIndex(nextIndex);
      }

      // Handle close / skip / finish
      if (
        action === ACTIONS.CLOSE ||
        action === ACTIONS.SKIP ||
        status === STATUS.FINISHED ||
        status === STATUS.SKIPPED
      ) {
        setRun(false);
        localStorage.setItem(storageKey, "true");
      }
    },
    [router, storageKey]
  );

  return (
    <TourContext.Provider value={{ startTour, isTourRunning: run }}>
      {children}
      <Joyride
        steps={TOUR_STEPS as Step[]}
        run={run}
        continuous
        showSkipButton
        showProgress
        stepIndex={stepIndex}
        callback={handleCallback}
        scrollToFirstStep
        disableOverlayClose
        disableCloseOnEsc
        floaterProps={{
          disableAnimation: false,
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Done",
          next: "Next",
          skip: "Skip tour",
        }}
        styles={{
          options: {
            arrowColor: "#171717",
            backgroundColor: "#171717",
            overlayColor: "rgba(0, 0, 0, 0.65)",
            primaryColor: "#2563eb",
            textColor: "#ffffff",
            spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
            beaconSize: 36,
            zIndex: 10000,
          },
          tooltip: {
            fontSize: 14,
            padding: 16,
          },
          tooltipTitle: {
            fontSize: 16,
            fontWeight: 600,
          },
          tooltipContent: {
            padding: "8px 0",
          },
          tooltipFooter: {
            marginTop: 8,
          },
          buttonNext: {
            backgroundColor: "#2563eb",
            borderRadius: 6,
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 500,
            padding: "6px 14px",
            outline: "none",
          },
          buttonBack: {
            color: "#9ca3af",
            fontSize: 13,
            fontWeight: 500,
            marginRight: 8,
            outline: "none",
          },
          buttonSkip: {
            color: "#6b7280",
            fontSize: 12,
            outline: "none",
          },
          buttonClose: {
            display: "none",
          },
        }}
      />
    </TourContext.Provider>
  );
}
