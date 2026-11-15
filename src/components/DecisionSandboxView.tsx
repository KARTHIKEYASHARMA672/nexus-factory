import React, { useState } from 'react';
import {
  GitFork,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Scale,
  Zap,
} from 'lucide-react';
import { CompanyState, TimelineBranch } from '../engine/types';
import { generateStrategicBranches } from '../engine/branchingEngine';

interface DecisionSandboxViewProps {
  company: CompanyState;
  onApplyStrategy: (strategyId: string) => void;
}

export const DecisionSandboxView: React.FC<DecisionSandboxViewProps> = ({
  company,
  onApplyStrategy,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('branch-growth');
  const branches: TimelineBranch[] = generateStrategicBranches(company, company.currentMonth);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6 py-2">
      
      {/* Top Banner */}
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <GitFork className="w-5 h-5 text-[#2457C5]" />
          <h2 className="font-serif-heading text-lg font-bold text-[#14284B]">
            Strategic Decision Sandbox & What-If Branching
          </h2>
        </div>
        <p className="text-xs text-[#625F58]">
          Fork the company's timeline at Month {company.currentMonth} to simulate 12-month downstream consequences across competing strategic paths.
        </p>
      </div>

      {/* 3 Strategy Branch Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map((branch) => {
          const isSelected = selectedBranchId === branch.id;
          const endMetric = branch.projectedMetrics[branch.projectedMetrics.length - 1];

          return (
            <div
              key={branch.id}
              onClick={() => setSelectedBranchId(branch.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer text-left space-y-3 ${
                isSelected
                  ? 'bg-[#FFFDF7] border-[#2457C5] ring-2 ring-[#2457C5]/20 shadow-md'
                  : 'bg-[#FFFDF7] border-[#E7DFC9] hover:border-[#D4C9AF] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2457C5]">
                  Fork at M{branch.forkMonth}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  endMetric.survivalProbability >= 80
                    ? 'bg-[#1E7B54]/10 text-[#1E7B54]'
                    : endMetric.survivalProbability >= 50
                    ? 'bg-[#D9A441]/15 text-[#9E6E16]'
                    : 'bg-[#BA2D32]/10 text-[#BA2D32]'
                }`}>
                  {endMetric.survivalProbability}% Survival Odds
                </span>
              </div>

              <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                {branch.branchName}
              </h3>
              <p className="text-xs text-[#625F58] leading-relaxed line-clamp-2">
                {branch.description}
              </p>

              {/* Quick projected stats */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#FFF8E9] border border-[#E7DFC9] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#625F58] font-sans block">12-Mo End Cash</span>
                  <span className={`font-bold ${endMetric.cash > 0 ? 'text-[#14284B]' : 'text-[#BA2D32]'}`}>
                    {formatCurrency(endMetric.cash)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#625F58] font-sans block">12-Mo ARR</span>
                  <span className="font-bold text-[#1E7B54]">
                    {formatCurrency(endMetric.revenue * 12)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#625F58] border-t border-[#E7DFC9]/60">
                <span>Verdict:</span>
                <span className="font-semibold text-[#14284B]">{branch.verdict}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive into Selected Strategy Branch */}
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E7DFC9]">
          <div>
            <span className="text-xs font-mono text-[#2457C5] font-bold uppercase tracking-wider">
              Selected Branch Trajectory
            </span>
            <h3 className="font-serif-heading text-xl font-bold text-[#14284B] mt-0.5">
              {selectedBranch.branchName}
            </h3>
            <p className="text-xs text-[#625F58] mt-1">
              Core Strategic Tradeoff: <b className="text-[#14284B]">{selectedBranch.keyTradeoff}</b>
            </p>
          </div>

          <button
            onClick={() => onApplyStrategy(selectedBranch.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14284B] hover:bg-[#2457C5] text-[#FFF8E9] transition-all shadow-sm shrink-0"
          >
            <Zap className="w-4 h-4 text-[#D9A441]" />
            <span>Commit Simulation to This Branch</span>
          </button>
        </div>

        {/* 12-Month Projected Trajectory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7DFC9] text-[#625F58] font-mono text-[11px] bg-[#FFF8E9]/60">
                <th className="py-2.5 px-3">Sim Month</th>
                <th className="py-2.5 px-3 text-right">Projected Cash</th>
                <th className="py-2.5 px-3 text-right">Monthly Revenue</th>
                <th className="py-2.5 px-3 text-right">Net Monthly P&L</th>
                <th className="py-2.5 px-3 text-right">Market Share</th>
                <th className="py-2.5 px-3 text-right">Runway</th>
                <th className="py-2.5 px-3 text-right">Survival Probability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFC9]/60 font-mono">
              {selectedBranch.projectedMetrics.map((m) => (
                <tr key={m.month} className="hover:bg-[#FFF8E9]/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-bold text-[#14284B]">
                    Month {m.month}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${
                    m.cash > 0 ? 'text-[#14284B]' : 'text-[#BA2D32]'
                  }`}>
                    {formatCurrency(m.cash)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#1E7B54]">
                    {formatCurrency(m.revenue)}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${
                    m.netIncome >= 0 ? 'text-[#1E7B54]' : 'text-[#BA2D32]'
                  }`}>
                    {m.netIncome >= 0 ? `+${formatCurrency(m.netIncome)}` : `-${formatCurrency(Math.abs(m.netIncome))}`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#2457C5]">
                    {m.marketShare}%
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {m.runway >= 999 ? 'Default Alive' : `${m.runway} mo`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      m.survivalProbability >= 80
                        ? 'bg-[#1E7B54]/10 text-[#1E7B54]'
                        : m.survivalProbability >= 50
                        ? 'bg-[#D9A441]/15 text-[#9E6E16]'
                        : 'bg-[#BA2D32]/10 text-[#BA2D32]'
                    }`}>
                      {m.survivalProbability}%
                    </span>
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