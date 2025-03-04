export enum FeatureFlag {
  MARKET_ANALYSIS = "market-analysis",
  CALENDAR_MANAGEMENT = "calendar-management",
  EMAIL_MANAGEMENT = "email-management",
  REPORT_GENERATION = "report-generation",
  DOCUMENT_MANAGEMENT = "document-management",
}

export const featureFlagEvents = {
  [FeatureFlag.MARKET_ANALYSIS]: "market-analysis",
  [FeatureFlag.CALENDAR_MANAGEMENT]: "calendar-management",
  [FeatureFlag.EMAIL_MANAGEMENT]: "email-management",
  [FeatureFlag.REPORT_GENERATION]: "report-generation",
  [FeatureFlag.DOCUMENT_MANAGEMENT]: "document-management",
};
