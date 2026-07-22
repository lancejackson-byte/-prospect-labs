declare module "react-joyride" {
  import type { ComponentType, ReactNode, CSSProperties } from "react";

  export interface Step {
    target: string | HTMLElement;
    title?: ReactNode;
    content: ReactNode;
    placement?: "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end" | "auto" | "center";
    disableBeacon?: boolean;
    locale?: Partial<Locale>;
    [key: string]: unknown;
  }

  export interface Locale {
    back?: string;
    close?: string;
    last?: string;
    next?: string;
    skip?: string;
  }

  export interface StyleOptions {
    arrowColor?: string;
    backgroundColor?: string;
    beaconSize?: number;
    overlayColor?: string;
    primaryColor?: string;
    spotlightShadow?: string;
    textColor?: string;
    zIndex?: number;
  }

  export interface Styles {
    options?: StyleOptions;
    tooltip?: CSSProperties;
    tooltipTitle?: CSSProperties;
    tooltipContent?: CSSProperties;
    tooltipFooter?: CSSProperties;
    buttonNext?: CSSProperties;
    buttonBack?: CSSProperties;
    buttonSkip?: CSSProperties;
    buttonClose?: CSSProperties;
  }

  export interface CallBackProps {
    action: string;
    index: number;
    size: number;
    status: string;
    type: string;
    step: Step;
  }

  export const ACTIONS: Record<string, string>;
  export const EVENTS: Record<string, string>;
  export const STATUS: Record<string, string>;
  export const LIFECYCLE: Record<string, string>;
  export const ORIGIN: Record<string, string>;

  export interface JoyrideProps {
    steps: Step[];
    run?: boolean;
    continuous?: boolean;
    showProgress?: boolean;
    showSkipButton?: boolean;
    stepIndex?: number;
    callback?: (data: CallBackProps) => void;
    scrollToFirstStep?: boolean;
    disableOverlayClose?: boolean;
    disableCloseOnEsc?: boolean;
    floaterProps?: Record<string, unknown>;
    locale?: Locale;
    styles?: Styles;
    [key: string]: unknown;
  }

  export const Joyride: ComponentType<JoyrideProps>;
  export const defaultLocale: Locale;
  export const defaultOptions: Record<string, unknown>;
  export function useJoyride(props?: Record<string, unknown>): Record<string, unknown>;
}
