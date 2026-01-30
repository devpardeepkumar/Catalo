export interface OnboardingStatusResponse {
  success: boolean;
  data: {
    currentStep: string;
    completedSteps: number[];
  };
}
