// NEXUS FACTORY - Autonomous Business Simulator Domain Types

export type IndustryType = 
  | 'B2B SaaS' 
  | 'Direct-to-Consumer' 
  | 'HealthTech & Bio' 
  | 'FinTech Platform' 
  | 'Hardware & Robotics';

export type AgentRole = 'CEO' | 'CMO' | 'CFO' | 'COO';

export type AgentPersonality = 'Aggressive Growth' | 'Fiscally Conservative' | 'Balanced Strategic' | 'Product Visionary';

export interface AgentThought {
  id: string;
  month: number;
  timestamp: string;
  topic: string;
  thought: string;
  sentiment: 'positive' | 'neutral' | 'warning' | 'critical';
  confidence: number; // 0 to 1
  proposalId?: string;
}

export interface AgentProposal {
  id: string;
  proposerRole: AgentRole;
  title: string;
  category: 'Strategy' | 'Marketing' | 'Finance' | 'Operations';
  description: string;
  projectedCost: number;
  expectedAnnualReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Executed';
  monthProposed: number;
  votes: Record<AgentRole, { vote: 'Approve' | 'Reject' | 'Abstain'; reasoning: string }>;
  impactSummary: string;
}

export interface AgentProfile {
  role: AgentRole;
  name: string;
  title: string;
  avatarSeed: string;
  personality: AgentPersonality;
  focusArea: string;
  currentObjective: string;
  approvalRating: number; // 0-100
  recentThoughts: AgentThought[];
  decisionCount: number;
}

export type CustomerCohortType = 'Enterprise Whales' | 'Mid-Market Leaders' | 'SMBs & Teams' | 'Self-Serve Prosumers';

export interface CustomerCohort {
  id: CustomerCohortType;
  name: string;
  description: string;
  activeCount: number;
  monthlyRevenuePerUser: number; // ARPU
  churnRatePercent: number; // monthly churn %
  satisfactionNPS: number; // -100 to 100
  priceSensitivity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  featureDemands: string[];
  totalLifetimeValue: number;
  acquisitionCost: number; // historical CAC
}

export interface CompetitorCompany {
  id: string;
  name: string;
  archetype: 'Aggressive Undercutter' | 'Legacy Enterprise Incumbent' | 'Hyper-Innovator' | 'Lean Bootstrapper';
  marketSharePercent: number;
  productQualityScore: number; // 0-100
  priceIndex: number; // 1.0 is baseline, 0.7 is 30% cheaper, 1.4 is 40% more expensive
  marketingAggression: number; // 0-100
  recentAction: string;
  threatLevel: 'Low' | 'Moderate' | 'Severe';
  brandReputation: number;
}

export type MarketingChannel = 'Organic Search & SEO' | 'Performance Paid Ads' | 'Social Video & Influencers' | 'Cold Enterprise Outbound' | 'Referral Viral Loops';

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: MarketingChannel;
  monthlyBudget: number;
  status: 'Active' | 'Paused' | 'Completed';
  targetCohort: CustomerCohortType;
  // A/B test variants
  variantA: {
    hook: string;
    impressions: number;
    clicks: number;
    conversions: number;
    cac: number;
  };
  variantB: {
    hook: string;
    impressions: number;
    clicks: number;
    conversions: number;
    cac: number;
  };
  confidenceScore: number; // % statistical significance
  winningVariant: 'Variant A' | 'Variant B' | 'Inconclusive';
  roiPercent: number;
  monthsActive: number;
}

export interface FinancialMonthRecord {
  month: number;
  label: string; // e.g. "Month 4" or "Q2 M1"
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPercent: number;
  marketingExpense: number;
  operationsExpense: number;
  rdExpense: number;
  generalAdminExpense: number;
  totalExpenses: number;
  netIncome: number; // profit / burn
  cashEnding: number;
  runwayMonths: number;
  activeCustomers: number;
  headcount: number;
}

export interface SimulationEvent {
  id: string;
  month: number;
  timestamp: string;
  source: 'Market' | 'Competitor' | 'Agent' | 'Customer' | 'Board';
  title: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'alert';
  metricImpact?: string;
}

export interface CompanyState {
  name: string;
  tagline: string;
  industry: IndustryType;
  foundingMonth: number;
  currentMonth: number;
  cashTreasury: number;
  valuation: number;
  basePrice: number;
  productReliabilityScore: number; // 0-100
  brandAwarenessScore: number; // 0-100
  headcount: number;
  headcountByDepartment: Record<AgentRole, number>;
  monthlyBurnRate: number;
  monthlyRevenue: number;
  grossMarginPercent: number;
  runwayMonths: number;
  marketSharePercent: number;
  overallNPS: number;
  activeStrategy: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  industry: IndustryType;
  tagline: string;
  difficulty: 'Seedling (Easy)' | 'Growth (Moderate)' | 'Turnaround (Hard)' | 'Crisis (Extreme)';
  startingCash: number;
  startingCustomers: number;
  startingMrr: number;
  startingHeadcount: number;
  description: string;
  initialCompetitors: CompetitorCompany[];
  primaryChallenge: string;
}

export interface TimelineBranch {
  id: string;
  branchName: string;
  description: string;
  forkMonth: number;
  strategicPivot: string;
  projectedMetrics: {
    month: number;
    cash: number;
    revenue: number;
    netIncome: number;
    marketShare: number;
    runway: number;
    survivalProbability: number;
  }[];
  verdict: 'High Success Probability' | 'Moderate Risk' | 'High Bankruptcy Risk';
  keyTradeoff: string;
}

export interface DeliberationMessage {
  id: string;
  agentRole: AgentRole;
  month: number;
  message: string;
  stance: 'Support' | 'Object' | 'Caution' | 'Strategic Compromise';
  timestamp: string;
}
