import React from 'react';
import {
  Wallet,
  TrendingUp,
  Flame,
  Award,
  ShieldCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { CompanyState, FinancialMonthRecord } from '../engine/types';

interface ExecutiveSummaryHUDProps {
  company: CompanyState;
  history: FinancialMonthRecord[];
}

export const ExecutiveSummaryHUD: React.FC<ExecutiveSummaryHUDProps> = ({
  company,
  history,
}) => {
  const currentRecord = history[history.length - 1];
  const previousRecord = history.length > 1 ? history[history.length - 2] : null;

  // Monthly Revenue Growth %
  const revGrowth = previousRecord
    ? +(((currentRecord.revenue - previousRecord.revenue) / Math.max(1, previousRecord.revenue)) * 100).toFixed(1)
    : 0;

  const isProfitable = currentRecord ? currentRecord.netIncome >= 0 : false;
  const isRunwayCritical = company.runwayMonths < 6 && !isProfitable;
  const isRunwayWarning = company.runwayMonths < 9 && !isProfitable;

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(val) >= 1000) {
      return `$${(val / 1000).toFixed(1)}k`;
    }
    return `$${val.toLocaleString()}`;
  };

  const revenuePerEmployee = Math.round(company.monthlyRevenue / Math.max(1, company.headcount));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-7xl mx-auto px-6 py-4">
      
      {/* 1. Cash Treasury & Runway */}
      <div className={`p-3.5 rounded-xl border bg-[#FFFDF7] shadow-sm transition-all ${
        isRunwayCritical
          ? 'border-[#BA2D32] ring-1 ring-[#BA2D32]/30'
          : isRunwayWarning
          ? 'border-[#D9A441]'
          : 'border-[#E7DFC9]'
      }`}>
        <div className="flex items-center justify-between text-xs text-[#625F58] mb-1">
          <span className="font-semibold uppercase tracking-wider">Treasury & Runway</span>
          <Wallet className="w-3.5 h-3.5 text-[#2457C5]" />
        </div>
        <div className="font-mono-data text-lg font-bold text-[#14284B] leading-tight">
          {formatCurrency(company.cashTreasury)}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          {isProfitable ? (
            <span className="inline-flex items-center gap-1 text-[#1E7B54] font-semibold bg-[#1E7B54]/10 px-1.5 py-0.5 rounded text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> Default Alive
            </span>
          ) : (
            <span className={`font-mono-data font-bold px-1.5 py-0.5 rounded text-[11px] ${
              isRunwayCritical
                ? 'bg-[#BA2D32]/10 text-[#BA2D32]'
                : isRunwayWarning
                ? 'bg-[#D9A441]/15 text-[#9E6E16]'
                : 'bg-[#2457C5]/10 text-[#2457C5]'
            }`}>
              {company.runwayMonths} mo runway
            </span>
          )}
        </div>
      </div>

      {/* 2. Monthly Revenue & ARR */}
      <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#625F58] mb-1">
          <span className="font-semibold uppercase tracking-wider">Monthly MRR</span>
          <TrendingUp className="w-3.5 h-3.5 text-[#1E7B54]" />
        </div>
        <div className="font-mono-data text-lg font-bold text-[#14284B] leading-tight">
          {formatCurrency(company.monthlyRevenue)}
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-[#625F58]">
          <span className="text-[11px] font-mono">ARR {formatCurrency(company.monthlyRevenue * 12)}</span>
          <span className={`font-mono-data font-semibold text-[11px] ${
            revGrowth >= 0 ? 'text-[#1E7B54]' : 'text-[#BA2D32]'
          }`}>
            {revGrowth >= 0 ? `+${revGrowth}%` : `${revGrowth}%`}
          </span>
        </div>
      </div>

      {/* 3. Net Burn / Profit */}
      <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#625F58] mb-1">
          <span className="font-semibold uppercase tracking-wider">Net Monthly P&L</span>
          <Flame className={`w-3.5 h-3.5 ${isProfitable ? 'text-[#1E7B54]' : 'text-[#BA2D32]'}`} />
        </div>
        <div className={`font-mono-data text-lg font-bold leading-tight ${
          isProfitable ? 'text-[#1E7B54]' : 'text-[#BA2D32]'
        }`}>
          {currentRecord ? (
            isProfitable 
              ? `+${formatCurrency(currentRecord.netIncome)}`
              : `-${formatCurrency(Math.abs(currentRecord.netIncome))}`
          ) : '$0'}
        </div>
        <div className="mt-1 text-xs text-[#625F58] text-[11px]">
          {isProfitable ? 'Net Profit Margin' : 'Monthly Cash Burn'}
        </div>
      </div>

      {/* 4. Market Share */}
      <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#625F58] mb-1">
          <span className="font-semibold uppercase tracking-wider">Market Share</span>
          <Award className="w-3.5 h-3.5 text-[#D9A441]" />
        </div>
        <div className="font-mono-data text-lg font-bold text-[#14284B] leading-tight">
          {company.marketSharePercent}%
        </div>
        <div className="mt-1 text-xs text-[#625F58] text-[11px]">
          Valuation: <span className="font-mono-data font-semibold text-[#14284B]">{formatCurrency(company.valuation)}</span>
        </div>
      </div>

      {/* 5. Product Reliability & NPS */}
      <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#625F58] mb-1">
          <span className="font-semibold uppercase tracking-wider">Reliability & NPS</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#2457C5]" />
        </div>
        <div className="font-mono-data text-lg font-bold text-[#14284B] leading-tight">
          {Math.round(company.productReliabilityScore)}%
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-[#625F58] text-[11px]">
          <span>Net Promoter Score</span>
          <span className="font-mono-data font-bold text-[#2457C5]">+{company.overallNPS}</span>
        </div>
      </div>

      {/* 6. Headcount & Efficiency */}
      <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#625F58] mb-1">
          <span className="font-semibold uppercase tracking-wider">Team & Scale</span>
          <Users className="w-3.5 h-3.5 text-[#14284B]" />
        </div>
        <div className="font-mono-data text-lg font-bold text-[#14284B] leading-tight">
          {company.headcount} Staff
        </div>
        <div className="mt-1 text-xs text-[#625F58] text-[11px]">
          <span className="font-mono-data">{formatCurrency(revenuePerEmployee)}/emp/mo</span>
        </div>
      </div>

    </div>
  );
};