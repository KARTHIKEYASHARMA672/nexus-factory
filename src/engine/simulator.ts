import {
  CompanyState,
  AgentProfile,
  CustomerCohort,
  CompetitorCompany,
  MarketingCampaign,
  FinancialMonthRecord,
  SimulationEvent,
  ScenarioPreset,
  AgentProposal,
  DeliberationMessage,
  AgentRole
} from './types';

export class NexusSimulator {
  public company: CompanyState;
  public agents: Record<AgentRole, AgentProfile>;
  public cohorts: CustomerCohort[];
  public competitors: CompetitorCompany[];
  public campaigns: MarketingCampaign[];
  public financialHistory: FinancialMonthRecord[];
  public events: SimulationEvent[];
  public proposals: AgentProposal[];
  public deliberations: DeliberationMessage[];

  constructor(preset: ScenarioPreset) {
    this.company = {
      name: preset.title.split(' — ')[0],
      tagline: preset.tagline,
      industry: preset.industry,
      foundingMonth: 1,
      currentMonth: 1,
      cashTreasury: preset.startingCash,
      valuation: preset.startingCash * 4.2 + preset.startingMrr * 38,
      basePrice: Math.round(preset.startingMrr / (preset.startingCustomers || 1)),
      productReliabilityScore: 84,
      brandAwarenessScore: 42,
      headcount: preset.startingHeadcount,
      headcountByDepartment: {
        CEO: 1,
        CMO: Math.max(1, Math.floor(preset.startingHeadcount * 0.2)),
        CFO: Math.max(1, Math.floor(preset.startingHeadcount * 0.15)),
        COO: Math.max(1, Math.floor(preset.startingHeadcount * 0.55)),
      },
      monthlyBurnRate: 0,
      monthlyRevenue: preset.startingMrr,
      grossMarginPercent: preset.industry === 'B2B SaaS' ? 82 : (preset.industry === 'Direct-to-Consumer' ? 62 : 74),
      runwayMonths: 12,
      marketSharePercent: 18,
      overallNPS: 54,
      activeStrategy: 'Accelerate Core Customer Acquisition & Safeguard Runway',
    };

    // Initialize C-Suite Agents
    this.agents = {
      CEO: {
        role: 'CEO',
        name: 'Elena Vance',
        title: 'Chief Executive Officer',
        avatarSeed: 'elena',
        personality: 'Balanced Strategic',
        focusArea: 'Enterprise Market Share & Series A Valuation',
        currentObjective: 'Establish 25%+ market share while steering company to 18-month runway safety.',
        approvalRating: 92,
        recentThoughts: [
          {
            id: 't-ceo-init',
            month: 1,
            timestamp: '08:30 AM',
            topic: 'Strategic Orientation',
            thought: `Initiated operations in ${preset.industry}. Our core differentiation lies in product execution speed and tailored cohort retention.`,
            sentiment: 'positive',
            confidence: 0.94,
          },
        ],
        decisionCount: 3,
      },
      CMO: {
        role: 'CMO',
        name: 'Julian Hayes',
        title: 'Chief Marketing Officer',
        avatarSeed: 'julian',
        personality: 'Aggressive Growth',
        focusArea: 'Multi-Channel Acquisition & A/B Funnels',
        currentObjective: 'Lower Blended CAC below $140 while scaling organic SEO and referral loops.',
        approvalRating: 88,
        recentThoughts: [
          {
            id: 't-cmo-init',
            month: 1,
            timestamp: '09:15 AM',
            topic: 'Channel Allocation',
            thought: 'Launching split tests on Paid Search and Viral Referral incentives. Need to quickly discover which messaging hook scales best.',
            sentiment: 'neutral',
            confidence: 0.88,
          },
        ],
        decisionCount: 4,
      },
      CFO: {
        role: 'CFO',
        name: 'Marcus Sterling',
        title: 'Chief Financial Officer',
        avatarSeed: 'marcus',
        personality: 'Fiscally Conservative',
        focusArea: 'Cash Runway, Unit Economics & Margin Expansion',
        currentObjective: 'Preserve at least 9 months of runway; guard against unmeasured marketing burn.',
        approvalRating: 95,
        recentThoughts: [
          {
            id: 't-cfo-init',
            month: 1,
            timestamp: '10:00 AM',
            topic: 'Capital Audit',
            thought: `Treasury starting at $${(preset.startingCash / 1000).toLocaleString()}k. I am monitoring fixed headcount costs and cloud infrastructure margins closely.`,
            sentiment: 'neutral',
            confidence: 0.96,
          },
        ],
        decisionCount: 2,
      },
      COO: {
        role: 'COO',
        name: 'Sophia Chen',
        title: 'Chief Operating Officer',
        avatarSeed: 'sophia',
        personality: 'Product Visionary',
        focusArea: 'Operational Throughput & Product Reliability',
        currentObjective: 'Maintain 99.8% product uptime and customer satisfaction NPS > +50.',
        approvalRating: 90,
        recentThoughts: [
          {
            id: 't-coo-init',
            month: 1,
            timestamp: '10:45 AM',
            topic: 'Capacity Planning',
            thought: `Engineering and support teams are currently operating at 68% load. Ready to support customer expansion without service degradation.`,
            sentiment: 'positive',
            confidence: 0.91,
          },
        ],
        decisionCount: 3,
      },
    };

    // Initialize Customer Cohorts
    const totalCust = preset.startingCustomers || 1200;
    this.cohorts = [
      {
        id: 'Enterprise Whales',
        name: 'Enterprise Whales',
        description: 'Multi-seat corporations with dedicated account management and custom SLAs.',
        activeCount: Math.max(4, Math.round(totalCust * 0.05)),
        monthlyRevenuePerUser: Math.round(this.company.basePrice * 8.5),
        churnRatePercent: 1.2,
        satisfactionNPS: 62,
        priceSensitivity: 'Low',
        featureDemands: ['SSO & SAML Security', '99.99% Uptime SLA', 'Audit Logs'],
        totalLifetimeValue: Math.round(this.company.basePrice * 8.5 * 36),
        acquisitionCost: Math.round(this.company.basePrice * 12),
      },
      {
        id: 'Mid-Market Leaders',
        name: 'Mid-Market Leaders',
        description: 'High-growth scaleups needing robust collaboration and team workflows.',
        activeCount: Math.max(20, Math.round(totalCust * 0.25)),
        monthlyRevenuePerUser: Math.round(this.company.basePrice * 2.8),
        churnRatePercent: 2.8,
        satisfactionNPS: 56,
        priceSensitivity: 'Moderate',
        featureDemands: ['Team Permissions', 'API Webhooks', 'Automated Reporting'],
        totalLifetimeValue: Math.round(this.company.basePrice * 2.8 * 24),
        acquisitionCost: Math.round(this.company.basePrice * 4.2),
      },
      {
        id: 'SMBs & Teams',
        name: 'SMBs & Agile Teams',
        description: 'Small businesses seeking rapid setup, clear ROI, and transparent pricing.',
        activeCount: Math.max(80, Math.round(totalCust * 0.50)),
        monthlyRevenuePerUser: Math.round(this.company.basePrice * 1.0),
        churnRatePercent: 4.5,
        satisfactionNPS: 51,
        priceSensitivity: 'High',
        featureDemands: ['1-Click Onboarding', 'Affordable Tiering', 'Email Support'],
        totalLifetimeValue: Math.round(this.company.basePrice * 1.0 * 16),
        acquisitionCost: Math.round(this.company.basePrice * 1.5),
      },
      {
        id: 'Self-Serve Prosumers',
        name: 'Self-Serve Prosumers',
        description: 'Individual professionals, consultants, and power users.',
        activeCount: Math.max(50, Math.round(totalCust * 0.20)),
        monthlyRevenuePerUser: Math.round(this.company.basePrice * 0.45),
        churnRatePercent: 7.2,
        satisfactionNPS: 48,
        priceSensitivity: 'Extreme',
        featureDemands: ['Self-Service Billing', 'Mobile App', 'Community Forum'],
        totalLifetimeValue: Math.round(this.company.basePrice * 0.45 * 10),
        acquisitionCost: Math.round(this.company.basePrice * 0.6),
      },
    ];

    // Initialize Competitors
    this.competitors = preset.initialCompetitors;

    // Initialize Marketing Campaigns with A/B experiments
    this.campaigns = [
      {
        id: 'camp-search',
        name: 'High-Intent Search Ads',
        channel: 'Performance Paid Ads',
        monthlyBudget: 12500,
        status: 'Active',
        targetCohort: 'Mid-Market Leaders',
        variantA: {
          hook: 'Automate 80% of Operations in 5 Minutes — Try Risk Free',
          impressions: 48200,
          clicks: 2180,
          conversions: 84,
          cac: 148,
        },
        variantB: {
          hook: 'The Enterprise-Grade Platform Built for Serious Scale',
          impressions: 46900,
          clicks: 1720,
          conversions: 62,
          cac: 201,
        },
        confidenceScore: 94,
        winningVariant: 'Variant A',
        roiPercent: 184,
        monthsActive: 1,
      },
      {
        id: 'camp-seo',
        name: 'Technical Thought Leadership & SEO',
        channel: 'Organic Search & SEO',
        monthlyBudget: 6000,
        status: 'Active',
        targetCohort: 'SMBs & Teams',
        variantA: {
          hook: 'Deep Benchmark Reports & Industry Guides',
          impressions: 62000,
          clicks: 4100,
          conversions: 142,
          cac: 42,
        },
        variantB: {
          hook: 'Interactive Calculators & Free Workflow Templates',
          impressions: 74000,
          clicks: 5800,
          conversions: 210,
          cac: 28,
        },
        confidenceScore: 98,
        winningVariant: 'Variant B',
        roiPercent: 320,
        monthsActive: 1,
      },
      {
        id: 'camp-outbound',
        name: 'Account-Based Enterprise Outbound',
        channel: 'Cold Enterprise Outbound',
        monthlyBudget: 9500,
        status: 'Active',
        targetCohort: 'Enterprise Whales',
        variantA: {
          hook: 'Personalized Executive Security & Compliance Audits',
          impressions: 1200,
          clicks: 240,
          conversions: 8,
          cac: 1187,
        },
        variantB: {
          hook: 'C-Suite Cost Reduction Briefings',
          impressions: 1150,
          clicks: 180,
          conversions: 5,
          cac: 1900,
        },
        confidenceScore: 82,
        winningVariant: 'Inconclusive',
        roiPercent: 240,
        monthsActive: 1,
      },
    ];

    // Initialize Event Stream
    this.events = [
      {
        id: 'ev-1',
        month: 1,
        timestamp: '09:00 AM',
        source: 'Market',
        title: 'Virtual Enterprise Established',
        description: `Nexus Factory initialized ${this.company.name} in ${this.company.industry}. Initial capital pool: $${(this.company.cashTreasury / 1000).toLocaleString()}k.`,
        severity: 'info',
      },
      {
        id: 'ev-2',
        month: 1,
        timestamp: '11:30 AM',
        source: 'Competitor',
        title: `${this.competitors[0]?.name || 'Incumbent'} Monitoring Entry`,
        description: `${this.competitors[0]?.name} expanded regional marketing spend to counter emerging challenger threat.`,
        severity: 'warning',
      },
    ];

    // Initial Proposals
    this.proposals = [
      {
        id: 'prop-1',
        proposerRole: 'CMO',
        title: 'Double Down on Interactive Template SEO',
        category: 'Marketing',
        description: 'Allocate an additional $4,500/mo to interactive workflow tools based on Variant B 98% win confidence.',
        projectedCost: 4500,
        expectedAnnualReturn: 62000,
        riskLevel: 'Low',
        status: 'Pending',
        monthProposed: 1,
        votes: {
          CEO: { vote: 'Approve', reasoning: 'High ROI organic loop accelerates defensible TAM expansion.' },
          CMO: { vote: 'Approve', reasoning: 'Statistically verified 320% ROI channel.' },
          CFO: { vote: 'Approve', reasoning: 'Low cash risk; payback period is under 60 days.' },
          COO: { vote: 'Approve', reasoning: 'Self-serve templates do not burden our support queue.' },
        },
        impactSummary: 'Reduces blended CAC by 18% and attracts 120+ organic SMBs monthly.',
      },
    ];

    // Initial Deliberations
    this.deliberations = [
      {
        id: 'delib-1',
        agentRole: 'CEO',
        month: 1,
        message: 'Welcome team. Our inaugural focus is proving unit economics and building defensibility against our competitors.',
        stance: 'Strategic Compromise',
        timestamp: '09:00 AM',
      },
      {
        id: 'delib-2',
        agentRole: 'CMO',
        month: 1,
        message: 'Marketing has spun up 3 experimental funnels. Early signals show interactive SEO outperforms paid search by 3.5x on CPA.',
        stance: 'Support',
        timestamp: '09:12 AM',
      },
      {
        id: 'delib-3',
        agentRole: 'CFO',
        month: 1,
        message: 'Caution on paid channels. We need at least 9 months of runway to guarantee survival without predatory dilution.',
        stance: 'Caution',
        timestamp: '09:18 AM',
      },
      {
        id: 'delib-4',
        agentRole: 'COO',
        month: 1,
        message: 'Operations and engineering are fully ramped. System reliability stands at 84% and we have headroom for 40% user expansion.',
        stance: 'Support',
        timestamp: '09:25 AM',
      },
    ];

    // Initialize Financial History with Month 1
    const initialRev = this.calculateMonthlyRevenue();
    const initialExpenses = this.calculateMonthlyExpenses();
    const initialGrossMargin = this.company.grossMarginPercent;
    const initialCogs = Math.round(initialRev * (1 - initialGrossMargin / 100));
    const initialNet = initialRev - initialCogs - initialExpenses;

    this.company.monthlyBurnRate = initialNet < 0 ? Math.abs(initialNet) : 0;
    this.company.runwayMonths = initialNet < 0 ? +(this.company.cashTreasury / Math.abs(initialNet)).toFixed(1) : 999;

    this.financialHistory = [
      {
        month: 1,
        label: 'Month 1',
        revenue: initialRev,
        cogs: initialCogs,
        grossProfit: initialRev - initialCogs,
        grossMarginPercent: initialGrossMargin,
        marketingExpense: this.campaigns.reduce((sum, c) => sum + (c.status === 'Active' ? c.monthlyBudget : 0), 0),
        operationsExpense: Math.round(this.company.headcount * 3200),
        rdExpense: Math.round(this.company.headcount * 3800),
        generalAdminExpense: Math.round(this.company.headcount * 1200 + 4000),
        totalExpenses: initialCogs + initialExpenses,
        netIncome: initialNet,
        cashEnding: this.company.cashTreasury,
        runwayMonths: this.company.runwayMonths,
        activeCustomers: this.getTotalCustomers(),
        headcount: this.company.headcount,
      },
    ];
  }

  public getTotalCustomers(): number {
    return this.cohorts.reduce((sum, c) => sum + c.activeCount, 0);
  }

  public calculateMonthlyRevenue(): number {
    return this.cohorts.reduce((sum, c) => sum + (c.activeCount * c.monthlyRevenuePerUser), 0);
  }

  public calculateMonthlyExpenses(): number {
    const marketingSpend = this.campaigns.reduce((sum, c) => sum + (c.status === 'Active' ? c.monthlyBudget : 0), 0);
    const salaryCost = this.company.headcount * 6200; // avg blended salary
    const infraAndTools = Math.round(this.getTotalCustomers() * 4.5 + 4000);
    const officeAndLegal = 4500;
    return marketingSpend + salaryCost + infraAndTools + officeAndLegal;
  }

  /**
   * Advance the simulation by 1 month tick
   */
  public advanceMonth(): FinancialMonthRecord {
    this.company.currentMonth += 1;
    const currentM = this.company.currentMonth;

    // 1. Customer Cohort Evolution & Churn Dynamics
    let totalNewCustomers = 0;
    this.cohorts.forEach((cohort) => {
      // Natural churn
      const baseChurnRate = cohort.churnRatePercent / 100;
      // NPS and reliability impact churn
      const reliabilityMultiplier = (100 - this.company.productReliabilityScore) / 100 * 0.4;
      const npsMultiplier = (100 - cohort.satisfactionNPS) / 200 * 0.3;
      const effectiveChurnRate = Math.max(0.005, baseChurnRate + reliabilityMultiplier + npsMultiplier);
      const lostCount = Math.round(cohort.activeCount * effectiveChurnRate);
      cohort.activeCount = Math.max(1, cohort.activeCount - lostCount);

      // New acquisitions from marketing & organic
      let newUsersForCohort = 0;
      this.campaigns.forEach((camp) => {
        if (camp.status === 'Active' && camp.targetCohort === cohort.id) {
          const effectiveCac = camp.winningVariant === 'Variant A' ? camp.variantA.cac : camp.variantB.cac;
          const conversions = Math.max(1, Math.round(camp.monthlyBudget / Math.max(10, effectiveCac)));
          newUsersForCohort += conversions;
        }
      });

      // Organic Word of Mouth (proportional to brand awareness & positive NPS)
      const organicBoost = Math.max(0, Math.round((cohort.activeCount * 0.03) * (cohort.satisfactionNPS / 100)));
      newUsersForCohort += organicBoost;

      cohort.activeCount += newUsersForCohort;
      totalNewCustomers += newUsersForCohort;

      // Dynamic NPS update
      const npsDelta = (this.company.productReliabilityScore > 80 ? 1.5 : -1.8) + (Math.random() * 2 - 1);
      cohort.satisfactionNPS = Math.min(95, Math.max(-20, Math.round(cohort.satisfactionNPS + npsDelta)));
    });

    // 2. Financial Calculations
    const monthlyRev = this.calculateMonthlyRevenue();
    const grossMargin = this.company.grossMarginPercent;
    const cogs = Math.round(monthlyRev * (1 - grossMargin / 100));
    
    const marketingExpense = this.campaigns.reduce((sum, c) => sum + (c.status === 'Active' ? c.monthlyBudget : 0), 0);
    const operationsExpense = Math.round(this.company.headcount * 3200 + this.getTotalCustomers() * 2.8);
    const rdExpense = Math.round(this.company.headcount * 3900);
    const generalAdminExpense = Math.round(this.company.headcount * 1100 + 4200);
    const totalOPEX = marketingExpense + operationsExpense + rdExpense + generalAdminExpense;

    const netIncome = monthlyRev - cogs - totalOPEX;
    this.company.cashTreasury += netIncome;
    this.company.monthlyRevenue = monthlyRev;
    this.company.monthlyBurnRate = netIncome < 0 ? Math.abs(netIncome) : 0;
    this.company.runwayMonths = netIncome < 0 ? +(this.company.cashTreasury / Math.abs(netIncome)).toFixed(1) : 999;
    
    // Valuation update (SaaS/Tech multiple)
    const annualRunRate = monthlyRev * 12;
    const growthMultiplier = netIncome >= 0 ? 8.5 : 5.2;
    this.company.valuation = Math.max(100000, Math.round(annualRunRate * growthMultiplier + this.company.cashTreasury * 0.8));

    // Overall NPS
    const avgNps = Math.round(this.cohorts.reduce((s, c) => s + c.satisfactionNPS, 0) / this.cohorts.length);
    this.company.overallNPS = avgNps;

    // Brand Awareness slight organic increase with marketing
    this.company.brandAwarenessScore = Math.min(98, Math.round(this.company.brandAwarenessScore + (marketingExpense > 15000 ? 1.2 : 0.5)));

    // Product Reliability maintenance/drift
    if (this.company.headcount < Math.round(this.getTotalCustomers() / 150)) {
      // Strained ops lowers reliability
      this.company.productReliabilityScore = Math.max(50, Math.round(this.company.productReliabilityScore - 1.5));
    } else {
      this.company.productReliabilityScore = Math.min(99, Math.round(this.company.productReliabilityScore + 1));
    }

    // 3. Competitor AI Dynamics & Market Share
    let totalMarketQuality = this.company.productReliabilityScore + (100 - this.company.basePrice / 5);
    this.competitors.forEach((comp) => {
      // Competitor random action
      if (Math.random() > 0.6) {
        const actions = [
          `Increased digital marketing spend by 15% targeting ${this.company.industry} buyers.`,
          `Released benchmark performance whitepaper comparing features against ${this.company.name}.`,
          `Offered 1-year contract buyout credits to lure away our mid-market clients.`,
          `Hired senior enterprise sales director from industry rival.`,
          `Underwent minor downtime incident affecting 12% of customer base.`,
        ];
        comp.recentAction = actions[Math.floor(Math.random() * actions.length)];
        comp.marketingAggression = Math.min(99, Math.max(30, comp.marketingAggression + (Math.random() * 8 - 4)));
      }
      totalMarketQuality += comp.productQualityScore;
    });

    // Market share recalculation
    const ourRelativePower = (this.company.productReliabilityScore * 1.2) + (this.company.brandAwarenessScore * 0.8) + (marketingExpense / 1000);
    const compTotalPower = this.competitors.reduce((s, c) => s + (c.productQualityScore * 1.1 + c.brandReputation * 0.7 + c.marketingAggression * 0.9), 0);
    const ourMarketShare = Math.min(65, Math.max(5, +(ourRelativePower / (ourRelativePower + compTotalPower) * 100).toFixed(1)));
    this.company.marketSharePercent = ourMarketShare;

    // Distribute remainder amongst competitors
    const remainderShare = 100 - ourMarketShare;
    this.competitors.forEach((comp, idx) => {
      comp.marketSharePercent = Math.max(2, Math.round((remainderShare * (idx === 0 ? 0.55 : 0.45 / (this.competitors.length - 1)))));
    });

    // 4. Marketing A/B Experiment Evolutions
    this.campaigns.forEach((camp) => {
      if (camp.status === 'Active') {
        camp.monthsActive += 1;
        // Increment impressions & conversions
        const newImprA = Math.round(camp.monthlyBudget * 3.8 * (0.9 + Math.random() * 0.2));
        const newClicksA = Math.round(newImprA * 0.045);
        const newConvA = Math.round(newClicksA * 0.038);
        camp.variantA.impressions += newImprA;
        camp.variantA.clicks += newClicksA;
        camp.variantA.conversions += newConvA;
        camp.variantA.cac = Math.round(camp.monthlyBudget * 0.5 / Math.max(1, newConvA));

        const newImprB = Math.round(camp.monthlyBudget * 3.6 * (0.9 + Math.random() * 0.2));
        const newClicksB = Math.round(newImprB * 0.052);
        const newConvB = Math.round(newClicksB * 0.044);
        camp.variantB.impressions += newImprB;
        camp.variantB.clicks += newClicksB;
        camp.variantB.conversions += newConvB;
        camp.variantB.cac = Math.round(camp.monthlyBudget * 0.5 / Math.max(1, newConvB));

        // Statistical confidence calculation
        camp.confidenceScore = Math.min(99, Math.round(camp.confidenceScore + 1.5));
        camp.winningVariant = camp.variantB.cac < camp.variantA.cac ? 'Variant B' : 'Variant A';
        camp.roiPercent = Math.round((monthlyRev / Math.max(1, camp.monthlyBudget)) * 100);
      }
    });

    // 5. C-Suite Autonomous Agent Cognitive Processing
    this.runAgentCognitiveCycle(currentM, netIncome, totalNewCustomers);

    // 6. Record Financial Statement
    const record: FinancialMonthRecord = {
      month: currentM,
      label: `Month ${currentM}`,
      revenue: monthlyRev,
      cogs,
      grossProfit: monthlyRev - cogs,
      grossMarginPercent: grossMargin,
      marketingExpense,
      operationsExpense,
      rdExpense,
      generalAdminExpense,
      totalExpenses: cogs + totalOPEX,
      netIncome,
      cashEnding: Math.round(this.company.cashTreasury),
      runwayMonths: this.company.runwayMonths,
      activeCustomers: this.getTotalCustomers(),
      headcount: this.company.headcount,
    };

    this.financialHistory.push(record);
    return record;
  }

  private runAgentCognitiveCycle(month: number, netIncome: number, newCustomers: number) {
    const isProfitable = netIncome >= 0;
    const runway = this.company.runwayMonths;

    // CEO Cognitive update
    const ceoThought = isProfitable
      ? `Company achieved net cash profitability at Month ${month}. We now hold operational autonomy without immediate reliance on venture rounds.`
      : runway < 6
      ? `CRITICAL: Cash runway compressed to ${runway} months. As CEO, I am initiating emergency capital preservation directives with the CFO.`
      : `Top-line ARR expanding steadily. Market share stands at ${this.company.marketSharePercent}%. Product-market fit is cementing across core cohorts.`;

    this.agents.CEO.recentThoughts.unshift({
      id: `t-ceo-${month}`,
      month,
      timestamp: '10:00 AM',
      topic: 'Strategic Overview',
      thought: ceoThought,
      sentiment: isProfitable ? 'positive' : runway < 6 ? 'critical' : 'positive',
      confidence: 0.95,
    });

    // CFO Cognitive update
    const cfoThought = runway < 6
      ? `Treasury balance is $${(this.company.cashTreasury / 1000).toFixed(0)}k. Monthly burn is $${(this.company.monthlyBurnRate / 1000).toFixed(0)}k. Recommending a 35% cut in non-performing ad spend and hiring pause.`
      : isProfitable
      ? `Net operating margin positive at +$${(netIncome / 1000).toFixed(1)}k. Treasury is replenishing organically. Excellent fiscal discipline.`
      : `Runway is healthy at ${runway} months. Monthly burn is within modeled variance. Capital efficiency remains satisfactory.`;

    this.agents.CFO.recentThoughts.unshift({
      id: `t-cfo-${month}`,
      month,
      timestamp: '10:15 AM',
      topic: 'Fiscal Guardrails',
      thought: cfoThought,
      sentiment: runway < 6 ? 'critical' : isProfitable ? 'positive' : 'neutral',
      confidence: 0.98,
    });

    // CMO Cognitive update
    const winningCampaign = this.campaigns.find(c => c.confidenceScore >= 95);
    const cmoThought = winningCampaign
      ? `Campaign '${winningCampaign.name}' resolved with 95%+ statistical significance. ${winningCampaign.winningVariant} achieved a superior CAC ($${winningCampaign.winningVariant === 'Variant A' ? winningCampaign.variantA.cac : winningCampaign.variantB.cac}). Reallocating budget accordingly.`
      : `Acquired ${newCustomers} new accounts this month. Blended CAC remains competitive against competitors' price index.`;

    this.agents.CMO.recentThoughts.unshift({
      id: `t-cmo-${month}`,
      month,
      timestamp: '10:30 AM',
      topic: 'Acquisition Intelligence',
      thought: cmoThought,
      sentiment: 'positive',
      confidence: 0.89,
    });

    // COO Cognitive update
    const custPerEmployee = Math.round(this.getTotalCustomers() / this.company.headcount);
    const cooThought = custPerEmployee > 220
      ? `Warning: Customer-to-employee ratio reached ${custPerEmployee}:1. Support tickets are up 28%. We must authorize 2 operations hires to safeguard NPS.`
      : `Operations running cleanly at ${this.company.productReliabilityScore}% uptime. Uptime SLA maintained for Enterprise cohort.`;

    this.agents.COO.recentThoughts.unshift({
      id: `t-coo-${month}`,
      month,
      timestamp: '10:45 AM',
      topic: 'Operational Throughput',
      thought: cooThought,
      sentiment: custPerEmployee > 220 ? 'warning' : 'positive',
      confidence: 0.92,
    });

    // Keep thoughts bounded to last 6 per agent
    Object.values(this.agents).forEach(agent => {
      if (agent.recentThoughts.length > 6) {
        agent.recentThoughts = agent.recentThoughts.slice(0, 6);
      }
    });

    // Auto-generate War Room Deliberations
    this.deliberations.unshift({
      id: `delib-${month}-1`,
      agentRole: 'CEO',
      month,
      message: ceoThought,
      stance: isProfitable ? 'Support' : runway < 6 ? 'Caution' : 'Support',
      timestamp: '11:00 AM',
    });

    this.deliberations.unshift({
      id: `delib-${month}-2`,
      agentRole: runway < 6 ? 'CFO' : 'CMO',
      month,
      message: runway < 6 ? cfoThought : cmoThought,
      stance: runway < 6 ? 'Caution' : 'Support',
      timestamp: '11:15 AM',
    });

    // Keep deliberations bounded
    if (this.deliberations.length > 25) {
      this.deliberations = this.deliberations.slice(0, 25);
    }

    // Add milestone events
    if (runway < 4 && this.company.cashTreasury > 0) {
      this.events.unshift({
        id: `ev-runway-${month}`,
        month,
        timestamp: '11:30 AM',
        source: 'Agent',
        title: 'Runway Warning Triggered',
        description: `CFO Marcus Sterling raised an operational emergency: Cash runway is down to ${runway} months.`,
        severity: 'alert',
        metricImpact: `Runway: ${runway} mo`,
      });
    }

    if (isProfitable && this.financialHistory.length > 1 && this.financialHistory[this.financialHistory.length - 1].netIncome < 0) {
      this.events.unshift({
        id: `ev-profit-${month}`,
        month,
        timestamp: '12:00 PM',
        source: 'Company' as any,
        title: 'Milestone: Cash Flow Positive Achieved!',
        description: `${this.company.name} reached operating profitability with +$${(netIncome / 1000).toFixed(1)}k net income this month.`,
        severity: 'success',
        metricImpact: `Net: +$${(netIncome / 1000).toFixed(1)}k`,
      });
    }
  }

  /**
   * Executive Board Intervention
   */
  public executeBoardDirective(
    actionType: 'INJECT_CAPITAL' | 'ENFORCE_AUSTERITY' | 'PRICE_INCREASE' | 'PRICE_DECREASE' | 'FIRE_AND_REPLACE_CMO' | 'FORCE_HIRE_OPS',
    value?: number
  ) {
    const currentM = this.company.currentMonth;
    switch (actionType) {
      case 'INJECT_CAPITAL': {
        const amount = value || 500000;
        this.company.cashTreasury += amount;
        this.company.valuation += Math.round(amount * 2.5);
        this.events.unshift({
          id: `ev-board-${Date.now()}`,
          month: currentM,
          timestamp: 'Board Session',
          source: 'Board',
          title: 'Board Directive: Emergency Capital Infusion',
          description: `The Board of Directors authorized a $${(amount / 1000).toLocaleString()}k capital injection to fortify the treasury.`,
          severity: 'success',
          metricImpact: `+$${(amount / 1000).toLocaleString()}k Treasury`,
        });
        break;
      }
      case 'ENFORCE_AUSTERITY': {
        this.campaigns.forEach(c => {
          c.monthlyBudget = Math.round(c.monthlyBudget * 0.6);
        });
        this.events.unshift({
          id: `ev-board-${Date.now()}`,
          month: currentM,
          timestamp: 'Board Session',
          source: 'Board',
          title: 'Board Directive: Emergency Austerity Enforced',
          description: 'The Board mandated an immediate 40% reduction in all marketing budgets to extend runway.',
          severity: 'warning',
          metricImpact: 'OPEX -40%',
        });
        break;
      }
      case 'PRICE_INCREASE': {
        const pct = value || 15;
        this.cohorts.forEach(c => {
          c.monthlyRevenuePerUser = Math.round(c.monthlyRevenuePerUser * (1 + pct / 100));
        });
        this.company.basePrice = Math.round(this.company.basePrice * (1 + pct / 100));
        this.events.unshift({
          id: `ev-board-${Date.now()}`,
          month: currentM,
          timestamp: 'Board Session',
          source: 'Board',
          title: `Board Directive: ${pct}% Pricing Increase`,
          description: `Authorized a ${pct}% price hike across all tiers to optimize gross margins.`,
          severity: 'info',
          metricImpact: `Pricing +${pct}%`,
        });
        break;
      }
      case 'PRICE_DECREASE': {
        const pct = value || 15;
        this.cohorts.forEach(c => {
          c.monthlyRevenuePerUser = Math.round(c.monthlyRevenuePerUser * (1 - pct / 100));
        });
        this.company.basePrice = Math.round(this.company.basePrice * (1 - pct / 100));
        this.events.unshift({
          id: `ev-board-${Date.now()}`,
          month: currentM,
          timestamp: 'Board Session',
          source: 'Board',
          title: `Board Directive: ${pct}% Strategic Price Cut`,
          description: `Authorized a ${pct}% price cut to choke off competitor market share expansion.`,
          severity: 'info',
          metricImpact: `Pricing -${pct}%`,
        });
        break;
      }
      case 'FORCE_HIRE_OPS': {
        this.company.headcount += 4;
        this.company.headcountByDepartment.COO += 4;
        this.company.productReliabilityScore = Math.min(99, this.company.productReliabilityScore + 6);
        this.events.unshift({
          id: `ev-board-${Date.now()}`,
          month: currentM,
          timestamp: 'Board Session',
          source: 'Board',
          title: 'Board Directive: Scale Operations Team (+4 Staff)',
          description: 'Hired 4 additional customer success and infrastructure engineers to fix support bottlenecks.',
          severity: 'success',
          metricImpact: 'Headcount +4',
        });
        break;
      }
      default:
        break;
    }
  }
}