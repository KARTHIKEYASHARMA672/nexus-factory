import React from 'react';
import {
  ShieldAlert,
  Users,
  Target,
  Swords,
  TrendingDown,
  DollarSign,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { CompetitorCompany, CustomerCohort, CompanyState } from '../engine/types';

interface CompetitorViewProps {
  company: CompanyState;
  competitors: CompetitorCompany[];
  cohorts: CustomerCohort[];
}

export const CompetitorView: React.FC<CompetitorViewProps> = ({
  company,
  competitors,
  cohorts,
}) => {
  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
  };

  const getThreatBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return 'bg-[#BA2D32]/10 text-[#BA2D32] border-[#BA2D32]/30';
      case 'Moderate':
        return 'bg-[#D9A441]/15 text-[#9E6E16] border-[#D9A441]/30';
      default:
        return 'bg-[#1E7B54]/10 text-[#1E7B54] border-[#1E7B54]/30';
    }
  };

  const totalMarketShare = company.marketSharePercent + competitors.reduce((s, c) => s + c.marketSharePercent, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6 py-2">
      
      {/* 1. Market Share Distribution Bar */}
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
              Market Share Breakdown ({company.industry})
            </h3>
            <p className="text-xs text-[#625F58]">
              Relative market penetration and competitive moat
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#2457C5]">
            Our Share: {company.marketSharePercent}%
          </span>
        </div>

        {/* Stacked Visual Bar */}
        <div className="w-full h-7 rounded-xl overflow-hidden flex border border-[#E7DFC9] bg-[#E7DFC9]">
          {/* Company Share */}
          <div
            style={{ width: `${(company.marketSharePercent / totalMarketShare) * 100}%` }}
            className="bg-[#2457C5] h-full flex items-center justify-center text-[#FFF8E9] text-[11px] font-mono font-bold truncate px-1 transition-all"
            title={`${company.name}: ${company.marketSharePercent}%`}
          >
            {company.name} ({company.marketSharePercent}%)
          </div>

          {/* Competitor Shares */}
          {competitors.map((comp, idx) => {
            const colors = ['bg-[#14284B]', 'bg-[#76283B]', 'bg-[#4E2B56]', 'bg-[#625F58]'];
            const bg = colors[idx % colors.length];
            return (
              <div
                key={comp.id}
                style={{ width: `${(comp.marketSharePercent / totalMarketShare) * 100}%` }}
                className={`${bg} h-full flex items-center justify-center text-[#FFF8E9] text-[11px] font-mono font-bold truncate px-1 transition-all`}
                title={`${comp.name}: ${comp.marketSharePercent}%`}
              >
                {comp.name} ({comp.marketSharePercent}%)
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-[#625F58]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2457C5] inline-block"></span>
            <span className="font-bold text-[#14284B]">{company.name} (Us)</span>
          </div>
          {competitors.map((comp, idx) => {
            const dotColors = ['bg-[#14284B]', 'bg-[#76283B]', 'bg-[#4E2B56]', 'bg-[#625F58]'];
            return (
              <div key={comp.id} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${dotColors[idx % dotColors.length]} inline-block`}></span>
                <span>{comp.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Competitor Intelligence Dossiers */}
      <div>
        <div className="flex items-center gap-2 mb-3.5">
          <Swords className="w-4 h-4 text-[#2457C5]" />
          <h3 className="font-serif-heading text-lg font-bold text-[#14284B]">
            Competitor Intelligence Dossiers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm space-y-3 hover:border-[#D4C9AF] transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif-heading text-base font-bold text-[#14284B]">
                  {comp.name}
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getThreatBadge(comp.threatLevel)}`}>
                  {comp.threatLevel} Threat
                </span>
              </div>

              <div className="text-xs text-[#625F58]">
                Archetype: <b className="text-[#14284B]">{comp.archetype}</b>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#FFF8E9] border border-[#E7DFC9] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#625F58] block">Market Share</span>
                  <span className="font-mono-data font-bold text-[#14284B]">{comp.marketSharePercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#625F58] block">Product Quality</span>
                  <span className="font-mono-data font-bold text-[#14284B]">{comp.productQualityScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#625F58] block">Price Index</span>
                  <span className="font-mono-data font-bold text-[#2457C5]">{comp.priceIndex}x</span>
                </div>
              </div>

              {/* Recent Move */}
              <div className="text-xs p-2.5 rounded-xl bg-[#F5EEDF]/60 border border-[#E7DFC9]">
                <span className="text-[10px] uppercase font-bold text-[#625F58] block mb-0.5">
                  Recent Rival Maneuver:
                </span>
                <p className="text-[11px] text-[#14284B] italic leading-tight">
                  "{comp.recentAction}"
                </p>
              </div>

              {/* AI Strategic Assessment */}
              <div className="text-[11px] text-[#625F58] pt-2 border-t border-[#E7DFC9]">
                <span className="font-bold text-[#14284B]">CEO Counter-Tactic: </span>
                {comp.priceIndex < 0.8
                  ? 'Do not engage in price war; emphasize SLA reliability and enterprise features.'
                  : comp.productQualityScore > 85
                  ? 'Accelerate development on developer integrations to neutralize feature gap.'
                  : 'Siphon mid-market accounts using transparent pricing and 1-click migration.'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Customer Cohort Health & Behavioral Matrix */}
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2457C5]" />
            <h3 className="font-serif-heading text-lg font-bold text-[#14284B]">
              Customer Cohort Dynamics & Economics
            </h3>
          </div>
          <span className="text-xs font-mono text-[#625F58]">
            Total Customers: {cohorts.reduce((s, c) => s + c.activeCount, 0).toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7DFC9] text-[#625F58] font-mono text-[11px]">
                <th className="py-2.5 px-3">Cohort Segment</th>
                <th className="py-2.5 px-3 text-right">Active Accounts</th>
                <th className="py-2.5 px-3 text-right">Monthly ARPU</th>
                <th className="py-2.5 px-3 text-right">Monthly Churn</th>
                <th className="py-2.5 px-3 text-right">Satisfaction (NPS)</th>
                <th className="py-2.5 px-3 text-right">Est. LTV</th>
                <th className="py-2.5 px-3 text-right">Price Sensitivity</th>
                <th className="py-2.5 px-3">Primary Feature Demands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFC9]/60">
              {cohorts.map((cohort) => (
                <tr key={cohort.id} className="hover:bg-[#FFF8E9]/50 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#14284B] block">{cohort.name}</span>
                    <span className="text-[11px] text-[#625F58] truncate block max-w-xs">{cohort.description}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#14284B]">
                    {cohort.activeCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-[#2457C5]">
                    {formatCurrency(cohort.monthlyRevenuePerUser)}/mo
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-[#BA2D32]">
                    {cohort.churnRatePercent}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      cohort.satisfactionNPS >= 60 ? 'bg-[#1E7B54]/10 text-[#1E7B54]' : cohort.satisfactionNPS >= 40 ? 'bg-[#D9A441]/15 text-[#9E6E16]' : 'bg-[#BA2D32]/10 text-[#BA2D32]'
                    }`}>
                      +{cohort.satisfactionNPS}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#14284B]">
                    {formatCurrency(cohort.totalLifetimeValue)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cohort.priceSensitivity === 'Extreme' ? 'bg-[#BA2D32]/10 text-[#BA2D32]' : cohort.priceSensitivity === 'High' ? 'bg-[#D9A441]/15 text-[#9E6E16]' : 'bg-[#1E7B54]/10 text-[#1E7B54]'
                    }`}>
                      {cohort.priceSensitivity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-[#625F58]">
                    <div className="flex flex-wrap gap-1">
                      {cohort.featureDemands.map((f, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-[#FFF8E9] border border-[#E7DFC9] text-[10px]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};