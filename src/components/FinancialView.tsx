import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calculator,
  Scale,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { FinancialMonthRecord, CompanyState } from '../engine/types';

interface FinancialViewProps {
  company: CompanyState;
  history: FinancialMonthRecord[];
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  company,
  history,
}) => {
  const currentRecord = history[history.length - 1];
  const previousRecord = history.length > 1 ? history[history.length - 2] : null;

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  // Unit Economics calculation
  const blendedRev = currentRecord?.revenue || company.monthlyRevenue;
  const blendedMarketing = currentRecord?.marketingExpense || 18000;
  const blendedCogs = currentRecord?.cogs || 15000;
  const grossProfit = blendedRev - blendedCogs;
  const grossMargin = company.grossMarginPercent;

  // LTV / CAC calculation
  const totalCustomers = currentRecord?.activeCustomers || 1200;
  const arpu = Math.round(blendedRev / Math.max(1, totalCustomers));
  const estimatedLTV = Math.round(arpu * (grossMargin / 100) * 28); // 28 month avg life
  const estimatedCAC = Math.round(blendedMarketing / Math.max(1, totalCustomers * 0.08));
  const ltvCacRatio = +(estimatedLTV / Math.max(1, estimatedCAC)).toFixed(1);
  const paybackPeriodMonths = +(estimatedCAC / Math.max(1, arpu * (grossMargin / 100))).toFixed(1);

  // MoM Revenue growth %
  const momGrowth = previousRecord
    ? +(((currentRecord.revenue - previousRecord.revenue) / Math.max(1, previousRecord.revenue)) * 100).toFixed(1)
    : 0;

  // Profit margin %
  const profitMarginPercent = currentRecord ? +((currentRecord.netIncome / Math.max(1, currentRecord.revenue)) * 100).toFixed(1) : 0;
  const ruleOf40 = +(momGrowth * 12 + profitMarginPercent).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6 py-2">
      
      {/* 1. Unit Economics & Executive Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        
        <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
          <span className="text-[11px] font-semibold text-[#625F58] uppercase tracking-wider block mb-1">
            LTV / CAC Ratio
          </span>
          <div className="font-mono-data text-xl font-bold text-[#14284B]">
            {ltvCacRatio}x
          </div>
          <span className={`text-[10px] font-semibold ${ltvCacRatio >= 3 ? 'text-[#1E7B54]' : 'text-[#BA2D32]'}`}>
            {ltvCacRatio >= 3 ? '✓ Highly Defensible' : '⚠ Caution: High Acquisition Cost'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
          <span className="text-[11px] font-semibold text-[#625F58] uppercase tracking-wider block mb-1">
            CAC Payback
          </span>
          <div className="font-mono-data text-xl font-bold text-[#14284B]">
            {paybackPeriodMonths} mo
          </div>
          <span className="text-[10px] text-[#625F58]">
            Target: &lt;12 Months
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
          <span className="text-[11px] font-semibold text-[#625F58] uppercase tracking-wider block mb-1">
            Blended LTV
          </span>
          <div className="font-mono-data text-xl font-bold text-[#1E7B54]">
            {formatCurrency(estimatedLTV)}
          </div>
          <span className="text-[10px] text-[#625F58]">
            Per Active Account
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
          <span className="text-[11px] font-semibold text-[#625F58] uppercase tracking-wider block mb-1">
            Blended CAC
          </span>
          <div className="font-mono-data text-xl font-bold text-[#2457C5]">
            {formatCurrency(estimatedCAC)}
          </div>
          <span className="text-[10px] text-[#625F58]">
            Acquisition Cost
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
          <span className="text-[11px] font-semibold text-[#625F58] uppercase tracking-wider block mb-1">
            Gross Margin
          </span>
          <div className="font-mono-data text-xl font-bold text-[#14284B]">
            {grossMargin}%
          </div>
          <span className="text-[10px] text-[#625F58]">
            Gross Profit: {formatCurrency(grossProfit)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFFDF7] shadow-sm">
          <span className="text-[11px] font-semibold text-[#625F58] uppercase tracking-wider block mb-1">
            Rule of 40 Score
          </span>
          <div className={`font-mono-data text-xl font-bold ${ruleOf40 >= 40 ? 'text-[#1E7B54]' : 'text-[#D9A441]'}`}>
            {ruleOf40}%
          </div>
          <span className="text-[10px] text-[#625F58]">
            {ruleOf40 >= 40 ? '✓ Elite SaaS Tier' : 'Growth/Margin Balance'}
          </span>
        </div>

      </div>

      {/* 2. Monthly P&L Ledger (Income Statement) */}
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#2457C5]" />
            <h3 className="font-serif-heading text-lg font-bold text-[#14284B]">
              Monthly Profit & Loss Statement (P&L Ledger)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#625F58]">
            {history.length} Financial Periods Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7DFC9] text-[#625F58] font-mono text-[11px] bg-[#FFF8E9]/60">
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">COGS</th>
                <th className="py-2.5 px-3 text-right">Gross Profit</th>
                <th className="py-2.5 px-3 text-right">Margin %</th>
                <th className="py-2.5 px-3 text-right">Sales & Mktg</th>
                <th className="py-2.5 px-3 text-right">R&D / Eng</th>
                <th className="py-2.5 px-3 text-right">G&A / Ops</th>
                <th className="py-2.5 px-3 text-right">Net Income</th>
                <th className="py-2.5 px-3 text-right">Ending Cash</th>
                <th className="py-2.5 px-3 text-right">Runway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFC9]/60 font-mono">
              {history.map((record) => {
                const isProfitable = record.netIncome >= 0;
                return (
                  <tr key={record.month} className="hover:bg-[#FFF8E9]/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#14284B] font-sans">
                      {record.label}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#1E7B54]">
                      {formatCurrency(record.revenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#BA2D32]">
                      {formatCurrency(record.cogs)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#14284B]">
                      {formatCurrency(record.grossProfit)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#625F58]">
                      {record.grossMarginPercent}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#625F58]">
                      {formatCurrency(record.marketingExpense)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#625F58]">
                      {formatCurrency(record.rdExpense)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#625F58]">
                      {formatCurrency(record.generalAdminExpense + record.operationsExpense)}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${
                      isProfitable ? 'text-[#1E7B54]' : 'text-[#BA2D32]'
                    }`}>
                      {isProfitable ? `+${formatCurrency(record.netIncome)}` : `-${formatCurrency(Math.abs(record.netIncome))}`}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#14284B]">
                      {formatCurrency(record.cashEnding)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isProfitable ? 'bg-[#1E7B54]/10 text-[#1E7B54]' : record.runwayMonths < 6 ? 'bg-[#BA2D32]/10 text-[#BA2D32]' : 'bg-[#2457C5]/10 text-[#2457C5]'
                      }`}>
                        {isProfitable ? 'Profitable' : `${record.runwayMonths} mo`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};