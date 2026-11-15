import React from 'react';
import {
  Play,
  Pause,
  FastForward,
  SkipForward,
  Building2,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';
import { CompanyState } from '../engine/types';
import { SCENARIO_PRESETS } from '../engine/scenarioPresets';

interface HeaderProps {
  company: CompanyState;
  isPlaying: boolean;
  simSpeed: number;
  onTogglePlay: () => void;
  onSetSpeed: (speed: number) => void;
  onStepMonth: () => void;
  onOpenBoardModal: () => void;
  onOpenScenarioModal: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  company,
  isPlaying,
  simSpeed,
  onTogglePlay,
  onSetSpeed,
  onStepMonth,
  onOpenBoardModal,
  onOpenScenarioModal,
  onReset,
  onExport,
  onImport,
}) => {
  return (
    <header className="border-b border-[#E7DFC9] bg-[#FFFDF7] px-6 py-3.5 sticky top-0 z-30 shadow-[0_2px_8px_rgba(20,40,75,0.04)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Company Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#2457C5] flex items-center justify-center text-[#FFF8E9] shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-heading text-xl font-bold tracking-tight text-[#14284B]">
                {company.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F5EEDF] text-[#625F58] border border-[#E7DFC9]">
                {company.industry}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#2457C5]/10 text-[#2457C5] border border-[#2457C5]/20">
                Month {company.currentMonth}
              </span>
            </div>
            <p className="text-xs text-[#625F58] italic truncate max-w-md">
              "{company.tagline}"
            </p>
          </div>
        </div>

        {/* Center: Simulation Controls */}
        <div className="flex items-center gap-2 bg-[#F5EEDF]/80 p-1.5 rounded-xl border border-[#E7DFC9]">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isPlaying
                ? 'bg-[#BA2D32] hover:bg-[#9E2428] text-[#FFF8E9]'
                : 'bg-[#2457C5] hover:bg-[#1B439C] text-[#FFF8E9]'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Start Simulation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate</span>
              </>
            )}
          </button>

          <button
            onClick={onStepMonth}
            disabled={isPlaying}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#14284B] hover:bg-[#FFFDF7] disabled:opacity-40 transition-colors border border-transparent hover:border-[#E7DFC9]"
            title="Advance 1 Month Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Step +1 Mo</span>
          </button>

          {/* Speed Toggles */}
          <div className="flex items-center border-l border-[#D4C9AF] pl-1.5 gap-1">
            {[1, 2, 5, 10].map((speed) => (
              <button
                key={speed}
                onClick={() => onSetSpeed(speed)}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  simSpeed === speed
                    ? 'bg-[#14284B] text-[#FFF8E9]'
                    : 'text-[#625F58] hover:bg-[#FFFDF7] hover:text-[#14284B]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions: Scenarios, Board Intervention, Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBoardModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D9A441] hover:bg-[#C29033] text-[#14284B] shadow-sm transition-colors border border-[#C29033]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Board Directive</span>
          </button>

          <button
            onClick={onOpenScenarioModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFFDF7] hover:bg-[#F5EEDF] text-[#14284B] border border-[#E7DFC9] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#625F58]" />
            <span>Scenarios</span>
          </button>

          <div className="flex items-center gap-1 border-l border-[#E7DFC9] pl-2">
            <button
              onClick={onExport}
              className="p-1.5 text-[#625F58] hover:text-[#14284B] hover:bg-[#F5EEDF] rounded transition-colors"
              title="Export Simulation State (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onImport}
              className="p-1.5 text-[#625F58] hover:text-[#14284B] hover:bg-[#F5EEDF] rounded transition-colors"
              title="Import Simulation State"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              className="p-1.5 text-[#625F58] hover:text-[#BA2D32] hover:bg-[#F5EEDF] rounded transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};