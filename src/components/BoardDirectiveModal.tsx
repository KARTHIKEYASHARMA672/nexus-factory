import React, { useState } from 'react';
import {
  Sparkles,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import { CompanyState } from '../engine/types';

interface BoardDirectiveModalProps {
  isOpen: boolean;
  company: CompanyState;
  onClose: () => void;
  onExecuteDirective: (
    actionType: 'INJECT_CAPITAL' | 'ENFORCE_AUSTERITY' | 'PRICE_INCREASE' | 'PRICE_DECREASE' | 'FORCE_HIRE_OPS',
    value?: number
  ) => void;
}

export const BoardDirectiveModal: React.FC<BoardDirectiveModalProps> = ({
  isOpen,
  company,
  onClose,
  onExecuteDirective,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#14284B]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DFC9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#D9A441]/20 text-[#8B610F]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#14284B]">
                Board of Directors Intervention
              </h3>
              <p className="text-xs text-[#625F58]">
                Issue binding corporate resolutions that supersede normal C-Suite autonomy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#625F58] hover:text-[#14284B] p-1"
          >
            ✕
          </button>
        </div>

        {/* Current State Summary */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#FFF8E9] border border-[#E7DFC9] text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#625F58] font-sans block">Treasury</span>
            <span className="font-bold text-[#14284B]">${(company.cashTreasury / 1000).toFixed(0)}k</span>
          </div>
          <div>
            <span className="text-[10px] text-[#625F58] font-sans block">Runway</span>
            <span className="font-bold text-[#2457C5]">{company.runwayMonths} mo</span>
          </div>
          <div>
            <span className="text-[10px] text-[#625F58] font-sans block">Headcount</span>
            <span className="font-bold text-[#14284B]">{company.headcount} Staff</span>
          </div>
        </div>

        {/* Action Directives List */}
        <div className="space-y-3">
          
          {/* 1. Inject Capital */}
          <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/40 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-[#14284B] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#1E7B54]" />
                Emergency Capital Infusion
              </h4>
              <p className="text-[11px] text-[#625F58] mt-0.5">
                Inject $500,000 in equity treasury to extend runway by ~6 months.
              </p>
            </div>
            <button
              onClick={() => {
                onExecuteDirective('INJECT_CAPITAL', 500000);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#1E7B54] hover:bg-[#165E40] text-[#FFF8E9] shrink-0 shadow-sm"
            >
              Inject $500k
            </button>
          </div>

          {/* 2. Enforce Austerity */}
          <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/40 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-[#14284B] flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-[#BA2D32]" />
                Enforce Immediate Marketing Austerity
              </h4>
              <p className="text-[11px] text-[#625F58] mt-0.5">
                Slash all active marketing budgets by 40% immediately to halt burn rate.
              </p>
            </div>
            <button
              onClick={() => {
                onExecuteDirective('ENFORCE_AUSTERITY');
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#BA2D32] hover:bg-[#962226] text-[#FFF8E9] shrink-0 shadow-sm"
            >
              Cut OPEX 40%
            </button>
          </div>

          {/* 3. Price Hike */}
          <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/40 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-[#14284B] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#2457C5]" />
                Mandate +15% Price Increase
              </h4>
              <p className="text-[11px] text-[#625F58] mt-0.5">
                Raise base pricing across all customer tiers by 15% to expand gross margin.
              </p>
            </div>
            <button
              onClick={() => {
                onExecuteDirective('PRICE_INCREASE', 15);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2457C5] hover:bg-[#1B439C] text-[#FFF8E9] shrink-0 shadow-sm"
            >
              Raise +15%
            </button>
          </div>

          {/* 4. Operations Scaling */}
          <div className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/40 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-[#14284B] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#14284B]" />
                Authorize Emergency Operations Hiring (+4 Staff)
              </h4>
              <p className="text-[11px] text-[#625F58] mt-0.5">
                Add 4 customer success and platform engineers to boost reliability to 99%.
              </p>
            </div>
            <button
              onClick={() => {
                onExecuteDirective('FORCE_HIRE_OPS');
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#14284B] hover:bg-[#2457C5] text-[#FFF8E9] shrink-0 shadow-sm"
            >
              Hire +4 Staff
            </button>
          </div>

        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#625F58] hover:bg-[#F5EEDF]"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};