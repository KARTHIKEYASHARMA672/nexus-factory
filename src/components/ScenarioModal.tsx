import React from 'react';
import {
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { SCENARIO_PRESETS } from '../engine/scenarioPresets';
import { ScenarioPreset } from '../engine/types';

interface ScenarioModalProps {
  isOpen: boolean;
  activePresetId: string;
  onClose: () => void;
  onSelectScenario: (preset: ScenarioPreset) => void;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({
  isOpen,
  activePresetId,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#14284B]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DFC9]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#2457C5]" />
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#14284B]">
                Enterprise Simulation Scenarios
              </h3>
              <p className="text-xs text-[#625F58]">
                Select a business challenge to test your AI C-Suite under different market stresses.
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

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {SCENARIO_PRESETS.map((preset) => {
            const isActive = preset.id === activePresetId;

            return (
              <div
                key={preset.id}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  isActive
                    ? 'bg-[#2457C5]/5 border-[#2457C5] ring-1 ring-[#2457C5]/20 shadow-sm'
                    : 'bg-[#FFF8E9]/50 border-[#E7DFC9] hover:bg-[#FFF8E9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-heading text-base font-bold text-[#14284B]">
                      {preset.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F5EEDF] text-[#625F58] border border-[#E7DFC9]">
                      {preset.industry}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    preset.difficulty.includes('Easy')
                      ? 'bg-[#1E7B54]/10 text-[#1E7B54]'
                      : preset.difficulty.includes('Moderate')
                      ? 'bg-[#2457C5]/10 text-[#2457C5]'
                      : preset.difficulty.includes('Hard')
                      ? 'bg-[#D9A441]/15 text-[#9E6E16]'
                      : 'bg-[#BA2D32]/10 text-[#BA2D32]'
                  }`}>
                    {preset.difficulty}
                  </span>
                </div>

                <p className="text-xs text-[#625F58] leading-relaxed">
                  {preset.description}
                </p>

                <div className="grid grid-cols-4 gap-2 p-2 rounded-lg bg-[#FFFDF7] border border-[#E7DFC9] text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#625F58] font-sans block">Initial Cash</span>
                    <span className="font-bold text-[#14284B]">${(preset.startingCash / 1000).toLocaleString()}k</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#625F58] font-sans block">Starting MRR</span>
                    <span className="font-bold text-[#1E7B54]">${(preset.startingMrr / 1000).toLocaleString()}k/mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#625F58] font-sans block">Customers</span>
                    <span className="font-bold text-[#14284B]">{preset.startingCustomers.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#625F58] font-sans block">Headcount</span>
                    <span className="font-bold text-[#14284B]">{preset.startingHeadcount} Staff</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#BA2D32] font-semibold">
                    Core Challenge: {preset.primaryChallenge}
                  </span>

                  <button
                    onClick={() => {
                      onSelectScenario(preset);
                      onClose();
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-[#2457C5] text-[#FFF8E9]'
                        : 'bg-[#14284B] hover:bg-[#2457C5] text-[#FFF8E9]'
                    }`}
                  >
                    <span>{isActive ? 'Current Active' : 'Load Scenario'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end border-t border-[#E7DFC9]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#625F58] hover:bg-[#F5EEDF]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};