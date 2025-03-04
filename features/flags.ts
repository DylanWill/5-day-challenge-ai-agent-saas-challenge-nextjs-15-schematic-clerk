export enum FeatureFlag {
  MARKET_ANALYSIS = "market-analysis",
  CALENDAR_MANAGEMENT = "calendar-management",
  EMAIL_MANAGEMENT = "email-management",
  REPORT_GENERATION = "report-generation",
  DOCUMENT_MANAGEMENT = "document-management",
}

export const featureFlagEvents: Record<FeatureFlag, { event: string }> = {
  [FeatureFlag.MARKET_ANALYSIS]: {
    event: "market-analysis",
  },
  [FeatureFlag.CALENDAR_MANAGEMENT]: {
    event: "calendar-management",
  },
  [FeatureFlag.EMAIL_MANAGEMENT]: {
    event: "email-management",
  },
  [FeatureFlag.REPORT_GENERATION]: {
    event: "report-generation",
  },
  [FeatureFlag.DOCUMENT_MANAGEMENT]: {
    event: "document-management",
  },
};
