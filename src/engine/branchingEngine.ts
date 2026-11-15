import { CompanyState, TimelineBranch } from './types';

export function generateStrategicBranches(
  currentState: CompanyState,
  startMonth: number
): TimelineBranch[] {
  const monthsToProject = 12;

  // 1. Branch A: Growth Blitz
  const branchAMetrics = [];
  let cashA = currentState.cashTreasury;
  let revA = currentState.monthlyRevenue;
  let marketShareA = currentState.marketSharePercent;

  for (let m = 1; m <= monthsToProject; m++) {
    const futureMonth = startMonth + m;
    // Growth blitz: revenue grows faster (+9-12% monthly compounding), but burn is heavy ($1.6x)
    revA = Math.round(revA * (1 + 0.08 + (m <= 6 ? 0.03 : 0.01)));
    const cogsA = Math.round(revA * (1 - (currentState.grossMarginPercent / 100)));
    const opexA = Math.round(currentState.monthlyBurnRate * 1.55 + (m * 2200));
    const netIncomeA = revA - cogsA - opexA;
    cashA = Math.max(0, cashA + netIncomeA);
    marketShareA = Math.min(65, +(marketShareA + 0.9).toFixed(1));
    const runwayA = netIncomeA < 0 ? +(cashA / Math.abs(netIncomeA)).toFixed(1) : 999;
    const survivalA = cashA > 0 ? (runwayA > 8 ? 88 : runwayA > 3 ? 55 : 22) : 5;

    branchAMetrics.push({
      month: futureMonth,
      cash: Math.round(cashA),
      revenue: Math.round(revA),
      netIncome: Math.round(netIncomeA),
      marketShare: marketShareA,
      runway: runwayA,
      survivalProbability: survivalA,
    });
  }

  // 2. Branch B: Cash Preservation & Profitability
  const branchBMetrics = [];
  let cashB = currentState.cashTreasury;
  let revB = currentState.monthlyRevenue;
  let marketShareB = currentState.marketSharePercent;

  for (let m = 1; m <= monthsToProject; m++) {
    const futureMonth = startMonth + m;
    // Price hike + cost cutting: revenue grows moderately (+3-4%), but burn drops by 55%
    revB = Math.round(revB * (1 + 0.032));
    const cogsB = Math.round(revB * (1 - ((currentState.grossMarginPercent + 6) / 100)));
    const opexB = Math.round(currentState.monthlyBurnRate * 0.48);
    const netIncomeB = revB - cogsB - opexB;
    cashB = Math.round(cashB + netIncomeB);
    // Market share stabilizes or slightly dips due to higher pricing
    marketShareB = Math.max(8, +(marketShareB - 0.2).toFixed(1));
    const runwayB = netIncomeB >= 0 ? 999 : +(cashB / Math.abs(netIncomeB)).toFixed(1);
    const survivalB = netIncomeB >= 0 ? 96 : (runwayB > 12 ? 90 : 70);

    branchBMetrics.push({
      month: futureMonth,
      cash: Math.round(cashB),
      revenue: Math.round(revB),
      netIncome: Math.round(netIncomeB),
      marketShare: marketShareB,
      runway: runwayB,
      survivalProbability: survivalB,
    });
  }

  // 3. Branch C: Enterprise Upmarket Migration
  const branchCMetrics = [];
  let cashC = currentState.cashTreasury;
  let revC = currentState.monthlyRevenue;
  let marketShareC = currentState.marketSharePercent;

  for (let m = 1; m <= monthsToProject; m++) {
    const futureMonth = startMonth + m;
    // Enterprise migration: initial lag for 3 months, then high contract value ARR surges
    const growthRate = m <= 3 ? 0.015 : (m <= 7 ? 0.065 : 0.11);
    revC = Math.round(revC * (1 + growthRate));
    const cogsC = Math.round(revC * (1 - ((currentState.grossMarginPercent + 4) / 100)));
    const opexC = Math.round(currentState.monthlyBurnRate * 1.15); // enterprise sales reps cost more
    const netIncomeC = revC - cogsC - opexC;
    cashC = Math.max(0, cashC + netIncomeC);
    marketShareC = Math.min(50, +(marketShareC + 0.4).toFixed(1));
    const runwayC = netIncomeC < 0 ? +(cashC / Math.abs(netIncomeC)).toFixed(1) : 999;
    const survivalC = cashC > 0 ? (runwayC > 6 ? 82 : 45) : 10;

    branchCMetrics.push({
      month: futureMonth,
      cash: Math.round(cashC),
      revenue: Math.round(revC),
      netIncome: Math.round(netIncomeC),
      marketShare: marketShareC,
      runway: runwayC,
      survivalProbability: survivalC,
    });
  }

  return [
    {
      id: 'branch-growth',
      branchName: 'Strategy Alpha: Venture Growth Blitz',
      description: 'Double marketing expenditure, expand sales team, and offer 15% pricing discount to rapidly steal market share from legacy competitors.',
      forkMonth: startMonth,
      strategicPivot: 'Hyper-Growth at expense of near-term runway',
      projectedMetrics: branchAMetrics,
      verdict: branchAMetrics[monthsToProject - 1].cash > 0 ? 'High Success Probability' : 'High Bankruptcy Risk',
      keyTradeoff: 'Requires external Series A capital within 8 months or company faces insolvency.',
    },
    {
      id: 'branch-profit',
      branchName: 'Strategy Beta: Fiscally Conservative Bootstrapping',
      description: 'Slash non-core marketing spend by 50%, institute a strict hiring freeze, and increase pricing by 15% to reach default alive status.',
      forkMonth: startMonth,
      strategicPivot: 'Default Alive & Sustained Cash-Flow Profitability',
      projectedMetrics: branchBMetrics,
      verdict: 'High Success Probability',
      keyTradeoff: 'Concedes top-line market share to aggressive venture-backed competitors.',
    },
    {
      id: 'branch-enterprise',
      branchName: 'Strategy Gamma: Upmarket Enterprise Pivot',
      description: 'De-prioritize low-margin prosumers and reallocate sales engineering toward 6-figure annual enterprise contracts with dedicated SLAs.',
      forkMonth: startMonth,
      strategicPivot: 'High-ACV Enterprise Specialization',
      projectedMetrics: branchCMetrics,
      verdict: 'Moderate Risk',
      keyTradeoff: 'Long 90-day enterprise procurement cycles delay initial cash collection.',
    },
  ];
}
