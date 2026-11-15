import React from 'react';
import {
  TrendingUp,
  Activity,
  Radio,
  Target,
  Brain,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  CompanyState,
  FinancialMonthRecord,
  AgentProfile,
  AgentRole,
  SimulationEvent,
  CustomerCohort,
} from '../engine/types';

interface CommandCenterViewProps {
  company: CompanyState;
  history: FinancialMonthRecord[];
  agents: Record<AgentRole, AgentProfile>;
  events: SimulationEvent[];
  cohorts: CustomerCohort[];
  onNavigateToTab: (tabId: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  company,
  history,
  agents,
  events,
  cohorts,
  onNavigateToTab,
}) => {
  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  // Generate SVG Path for Financial Trajectory
  const maxVal = Math.max(
    ...history.map((h) => Math.max(h.revenue, h.totalExpenses)),
    50000
  );
  const chartHeight = 160;
  const chartWidth = 540;
  const stepX = history.length > 1 ? chartWidth / (history.length - 1) : chartWidth;

  const revPoints = history.map((h, i) => {
    const x = i * stepX;
    const y = chartHeight - (h.revenue / maxVal) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  });

  const expPoints = history.map((h, i) => {
    const x = i * stepX;
    const y = chartHeight - (h.totalExpenses / maxVal) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  });

  const revPath = `M ${revPoints.join(' L ')}`;
  const expPath = `M ${expPoints.join(' L ')}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6 py-2">
      
      {/* Top Banner: Active Strategic Direction */}
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#2457C5]/10 text-[#2457C5] border border-[#2457C5]/20 mt-0.5">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2457C5]">
                Autonomous Executive Guidance
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E7B54]/10 text-[#1E7B54]">
                Active Loop
              </span>
            </div>
            <h2 className="font-serif-heading text-lg font-bold text-[#14284B] mt-0.5">
              "{company.activeStrategy}"
            </h2>
            <p className="text-xs text-[#625F58] mt-1">
              AI C-Suite agents autonomously evaluate channel unit economics, competitive price actions, and runway every month.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('war-room')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#14284B] hover:bg-[#2457C5] text-[#FFF8E9] transition-colors shadow-sm"
          >
            <Brain className="w-4 h-4 text-[#D9A441]" />
            <span>Open War Room</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      </div>

      {/* Main Grid: Financial Trajectory & C-Suite Live State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Trajectory Chart + Customer Cohort Distribution */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Revenue vs Expenses Trendline */}
          <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                  Financial Velocity & Operating Margin
                </h3>
                <p className="text-xs text-[#625F58]">
                  Monthly Revenue (MRR) vs Total OPEX Expenses
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#1E7B54] rounded-full inline-block"></span>
                  <span className="text-[#1E7B54] font-semibold">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#BA2D32] rounded-full inline-block"></span>
                  <span className="text-[#BA2D32] font-semibold">Expenses</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative border-b border-[#E7DFC9] pb-2">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
                {/* Horizontal reference grid lines */}
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1="0"
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke="#E7DFC9"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Expense Line */}
                <path
                  d={expPath}
                  fill="none"
                  stroke="#BA2D32"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Revenue Line */}
                <path
                  d={revPath}
                  fill="none"
                  stroke="#1E7B54"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {history.map((h, i) => {
                  const x = i * stepX;
                  const yRev = chartHeight - (h.revenue / maxVal) * (chartHeight - 20) - 10;
                  const yExp = chartHeight - (h.totalExpenses / maxVal) * (chartHeight - 20) - 10;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yRev} r="3.5" fill="#1E7B54" />
                      <circle cx={x} cy={yExp} r="3.5" fill="#BA2D32" />
                    </g>
                  );
                })}
              </svg>

              {/* Month Markers */}
              <div className="flex justify-between text-[10px] font-mono text-[#625F58] mt-2">
                <span>Month 1</span>
                {history.length > 2 && (
                  <span>Month {Math.round(history.length / 2)}</span>
                )}
                <span>Month {history.length}</span>
              </div>
            </div>

            {/* Bottom Chart Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#E7DFC9]/60 text-xs">
              <div>
                <span className="text-[#625F58] text-[11px] block">Gross Margin</span>
                <span className="font-mono-data font-bold text-[#14284B] text-sm">
                  {company.grossMarginPercent}%
                </span>
              </div>
              <div>
                <span className="text-[#625F58] text-[11px] block">Ending Cash</span>
                <span className="font-mono-data font-bold text-[#14284B] text-sm">
                  {formatCurrency(company.cashTreasury)}
                </span>
              </div>
              <div>
                <span className="text-[#625F58] text-[11px] block">Est. Valuation</span>
                <span className="font-mono-data font-bold text-[#2457C5] text-sm">
                  {formatCurrency(company.valuation)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Cohort Breakdown Card */}
          <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                  Customer Cohort Portfolio
                </h3>
                <p className="text-xs text-[#625F58]">
                  Volume, ARPU and Monthly Churn across segments
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('competitors')}
                className="text-xs font-semibold text-[#2457C5] hover:underline"
              >
                Inspect Cohorts →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className="p-3 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/40 hover:bg-[#FFF8E9] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#14284B] truncate">
                      {cohort.name}
                    </span>
                    <span className="font-mono-data text-xs font-bold text-[#2457C5]">
                      {cohort.activeCount} Accts
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#625F58]">
                    <span>ARPU: <b className="font-mono text-[#14284B]">{formatCurrency(cohort.monthlyRevenuePerUser)}/mo</b></span>
                    <span>Churn: <b className="font-mono text-[#BA2D32]">{cohort.churnRatePercent}%</b></span>
                  </div>
                  {/* Progress bar of cohort volume */}
                  <div className="w-full bg-[#E7DFC9] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#2457C5] h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (cohort.activeCount / Math.max(1, cohorts.reduce((s, c) => s + c.activeCount, 0))) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols): Live Agent Cognitive Feed & Event Stream */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Autonomous C-Suite Thought Stream */}
          <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#2457C5]" />
                <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                  AI C-Suite Real-Time Thoughts
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#625F58]">
                Month {company.currentMonth}
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {(['CEO', 'CFO', 'CMO', 'COO'] as AgentRole[]).map((role) => {
                const agent = agents[role];
                const latestThought = agent.recentThoughts[0];
                return (
                  <div
                    key={role}
                    className="p-3 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/30 hover:border-[#D4C9AF] transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          role === 'CEO'
                            ? 'bg-[#2457C5]/10 text-[#2457C5]'
                            : role === 'CFO'
                            ? 'bg-[#1E7B54]/10 text-[#1E7B54]'
                            : role === 'CMO'
                            ? 'bg-[#D9A441]/20 text-[#8B610F]'
                            : 'bg-[#14284B]/10 text-[#14284B]'
                        }`}>
                          {role} • {agent.name.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-[#625F58]">
                          {latestThought?.topic || agent.focusArea}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#625F58]">
                        {latestThought?.timestamp || '10:00 AM'}
                      </span>
                    </div>

                    <p className="text-xs text-[#14284B] leading-relaxed">
                      "{latestThought?.thought || 'Evaluating ongoing operational performance and resource allocation.'}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Event Stream */}
          <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#D9A441]" />
                <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                  Company & Market Event Log
                </h3>
              </div>
              <span className="text-[10px] text-[#625F58]">
                {events.length} logged
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {events.slice(0, 8).map((ev) => (
                <div
                  key={ev.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    ev.severity === 'alert'
                      ? 'bg-[#BA2D32]/5 border-[#BA2D32]/30 text-[#14284B]'
                      : ev.severity === 'warning'
                      ? 'bg-[#D9A441]/10 border-[#D9A441]/30 text-[#14284B]'
                      : ev.severity === 'success'
                      ? 'bg-[#1E7B54]/5 border-[#1E7B54]/30 text-[#14284B]'
                      : 'bg-[#FFF8E9]/50 border-[#E7DFC9] text-[#14284B]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    ev.severity === 'alert'
                      ? 'bg-[#BA2D32]'
                      : ev.severity === 'warning'
                      ? 'bg-[#D9A441]'
                      : ev.severity === 'success'
                      ? 'bg-[#1E7B54]'
                      : 'bg-[#2457C5]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">{ev.title}</span>
                      <span className="font-mono text-[10px] text-[#625F58]">M{ev.month}</span>
                    </div>
                    <p className="text-[11px] text-[#625F58] mt-0.5 leading-snug">
                      {ev.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};