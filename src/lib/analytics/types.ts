export interface PipelineStageData {
  name: string;
  count: number;
  value: number;
  color: string;
}

export interface ActivityDataPoint {
  date: string;
  emails: number;
  leads: number;
  deals: number;
}

export interface AnalyticsSummary {
  totalLeads: number;
  totalEmails: number;
  totalDeals: number;
  totalValue: number;
  conversionRate: number;
  pipelineData: PipelineStageData[];
  activityData: ActivityDataPoint[];
}
