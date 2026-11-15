import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Brain,
  Swords,
  FileSpreadsheet,
  FlaskConical,
  GitFork,
  SlidersHorizontal,
  Building2,
  Sparkles,
} from 'lucide-react';
import { NexusSimulator } from './engine/simulator';
import { SCENARIO_PRESETS } from './engine/scenarioPresets';
import { Header } from './components/Header';
import { ExecutiveSummaryHUD } from './components/ExecutiveSummaryHUD';
import { CommandCenterView } from './components/CommandCenterView';
import { WarRoomView } from './components/WarRoomView';
import { CompetitorView } from './components/CompetitorView';
import { FinancialView } from './components/FinancialView';
import { MarketingLabView } from './components/MarketingLabView';
import { DecisionSandboxView } from './components/DecisionSandboxView';
import { BoardDirectiveModal } from './components/BoardDirectiveModal';
import { ScenarioModal } from './components/ScenarioModal';
import { ScenarioPreset, MarketingCampaign } from './engine/types';

export function App() {
  const [currentPreset, setCurrentPreset] = useState<ScenarioPreset>(SCENARIO_PRESETS[0]);
  const simulatorRef = useRef<NexusSimulator>(new NexusSimulator(SCENARIO_PRESETS[0]));
  const [, setTick] = useState(0); // force re-render on tick

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('command');

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  const sim = simulatorRef.current;

  // Sound feedback using Web Audio API
  const playChime = (frequency = 600, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked by autoplay policies
    }
  };

  // Main Simulation Loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      const intervalMs = Math.max(100, Math.round(1200 / simSpeed));
      interval = setInterval(() => {
        sim.advanceMonth();
        setTick((t) => t + 1);
        playChime(700, 0.04);
      }, intervalMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, simSpeed]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    playChime(isPlaying ? 400 : 800);
  };

  const handleStepMonth = () => {
    sim.advanceMonth();
    setTick((t) => t + 1);
    playChime(750, 0.06);
  };

  const handleReset = () => {
    setIsPlaying(false);
    simulatorRef.current = new NexusSimulator(currentPreset);
    setTick((t) => t + 1);
    playChime(350);
  };

  const handleSelectScenario = (preset: ScenarioPreset) => {
    setIsPlaying(false);
    setCurrentPreset(preset);
    simulatorRef.current = new NexusSimulator(preset);
    setTick((t) => t + 1);
    playChime(850, 0.1);
  };

  const handleVoteProposal = (proposalId: string, approve: boolean) => {
    const prop = sim.proposals.find((p) => p.id === proposalId);
    if (prop) {
      prop.status = approve ? 'Approved' : 'Rejected';
      if (approve) {
        sim.events.unshift({
          id: `ev-vote-${Date.now()}`,
          month: sim.company.currentMonth,
          timestamp: 'Board Action',
          source: 'Board',
          title: `Proposal Approved: ${prop.title}`,
          description: `The Board ratified '${prop.title}'. ${prop.impactSummary}`,
          severity: 'success',
        });
      }
      setTick((t) => t + 1);
      playChime(approve ? 880 : 380);
    }
  };

  const handlePostBoardMessage = (msg: string) => {
    sim.deliberations.unshift({
      id: `delib-user-${Date.now()}`,
      agentRole: 'CEO',
      month: sim.company.currentMonth,
      message: `[BOARD DIRECTIVE]: "${msg}"`,
      stance: 'Strategic Compromise',
      timestamp: 'Just now',
    });
    setTick((t) => t + 1);
    playChime(900, 0.08);
  };

  const handleToggleCampaign = (campId: string) => {
    const c = sim.campaigns.find((item) => item.id === campId);
    if (c) {
      c.status = c.status === 'Active' ? 'Paused' : 'Active';
      setTick((t) => t + 1);
      playChime(500);
    }
  };

  const handleAddCampaign = (newCamp: MarketingCampaign) => {
    sim.campaigns.unshift(newCamp);
    sim.events.unshift({
      id: `ev-camp-${Date.now()}`,
      month: sim.company.currentMonth,
      timestamp: 'Marketing Action',
      source: 'Agent',
      title: `Launched Experiment: ${newCamp.name}`,
      description: `New A/B campaign on ${newCamp.channel} with budget $${newCamp.monthlyBudget.toLocaleString()}/mo.`,
      severity: 'info',
    });
    setTick((t) => t + 1);
    playChime(950, 0.1);
  };

  const handleApplyStrategy = (strategyId: string) => {
    if (strategyId === 'branch-growth') {
      sim.campaigns.forEach((c) => (c.monthlyBudget = Math.round(c.monthlyBudget * 1.6)));
      sim.company.basePrice = Math.round(sim.company.basePrice * 0.9);
      sim.company.activeStrategy = 'Venture Growth Blitz — Market Share Expansion';
    } else if (strategyId === 'branch-profit') {
      sim.campaigns.forEach((c) => (c.monthlyBudget = Math.round(c.monthlyBudget * 0.5)));
      sim.company.basePrice = Math.round(sim.company.basePrice * 1.15);
      sim.company.activeStrategy = 'Fiscally Conservative Bootstrapping — Default Alive';
    } else {
      sim.company.activeStrategy = 'Enterprise Upmarket Specialization — High ACV';
    }

    sim.events.unshift({
      id: `ev-strat-${Date.now()}`,
      month: sim.company.currentMonth,
      timestamp: 'Strategy Shift',
      source: 'Board',
      title: `Strategic Timeline Pivot Executed`,
      description: `Company adopted new trajectory: "${sim.company.activeStrategy}".`,
      severity: 'success',
    });
    setTick((t) => t + 1);
    playChime(1050, 0.12);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sim, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${sim.company.name.toLowerCase().replace(/\s+/g, '-')}-m${sim.company.currentMonth}-sim.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.company && data.cohorts) {
              Object.assign(sim, data);
              setTick((t) => t + 1);
              playChime(900);
            }
          } catch (err) {
            alert('Invalid simulation file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9] text-[#14284B] flex flex-col selection:bg-[#2457C5] selection:text-[#FFF8E9]">
      
      {/* 1. Executive Topbar */}
      <Header
        company={sim.company}
        isPlaying={isPlaying}
        simSpeed={simSpeed}
        onTogglePlay={handleTogglePlay}
        onSetSpeed={(s) => setSimSpeed(s)}
        onStepMonth={handleStepMonth}
        onOpenBoardModal={() => setIsBoardModalOpen(true)}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        onReset={handleReset}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* 2. Executive Summary HUD */}
      <ExecutiveSummaryHUD
        company={sim.company}
        history={sim.financialHistory}
      />

      {/* 3. Primary Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-6 w-full mb-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#FFFDF7] rounded-xl border border-[#E7DFC9] overflow-x-auto shadow-xs">
          {[
            { id: 'command', label: 'Command Center', icon: Activity },
            { id: 'war-room', label: 'Executive War Room', icon: Brain, badge: sim.deliberations.length },
            { id: 'competitors', label: 'Market & Competitors', icon: Swords },
            { id: 'financial', label: 'Financial Ledger & P&L', icon: FileSpreadsheet },
            { id: 'marketing', label: 'Marketing Lab (A/B)', icon: FlaskConical },
            { id: 'sandbox', label: 'Strategic Branches', icon: GitFork },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  playChime(500, 0.03);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#14284B] text-[#FFF8E9] shadow-xs'
                    : 'text-[#625F58] hover:bg-[#F5EEDF] hover:text-[#14284B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D9A441]' : 'text-[#625F58]'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-[#2457C5] text-[#FFF8E9]' : 'bg-[#E7DFC9] text-[#625F58]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Active View Tab Body */}
      <main className="flex-1 pb-12">
        {activeTab === 'command' && (
          <CommandCenterView
            company={sim.company}
            history={sim.financialHistory}
            agents={sim.agents}
            events={sim.events}
            cohorts={sim.cohorts}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'war-room' && (
          <WarRoomView
            agents={sim.agents}
            proposals={sim.proposals}
            deliberations={sim.deliberations}
            company={sim.company}
            onVoteProposal={handleVoteProposal}
            onPostBoardMessage={handlePostBoardMessage}
          />
        )}

        {activeTab === 'competitors' && (
          <CompetitorView
            company={sim.company}
            competitors={sim.competitors}
            cohorts={sim.cohorts}
          />
        )}

        {activeTab === 'financial' && (
          <FinancialView
            company={sim.company}
            history={sim.financialHistory}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingLabView
            campaigns={sim.campaigns}
            onToggleCampaign={handleToggleCampaign}
            onAddCampaign={handleAddCampaign}
          />
        )}

        {activeTab === 'sandbox' && (
          <DecisionSandboxView
            company={sim.company}
            onApplyStrategy={handleApplyStrategy}
          />
        )}
      </main>

      {/* Modals */}
      <BoardDirectiveModal
        isOpen={isBoardModalOpen}
        company={sim.company}
        onClose={() => setIsBoardModalOpen(false)}
        onExecuteDirective={(type, val) => {
          sim.executeBoardDirective(type, val);
          setTick((t) => t + 1);
          playChime(1000, 0.15);
        }}
      />

      <ScenarioModal
        isOpen={isScenarioModalOpen}
        activePresetId={currentPreset.id}
        onClose={() => setIsScenarioModalOpen(false)}
        onSelectScenario={handleSelectScenario}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-[#E7DFC9] bg-[#FFFDF7] py-4 text-center text-xs text-[#625F58]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif-heading font-bold text-[#14284B]">NEXUS FACTORY</span>
            <span>•</span>
            <span>Autonomous Business & Multi-Agent Simulator</span>
          </div>
          <div className="font-mono text-[11px]">
            Engineered with Royal Blue & Cream Aesthetic • Zero Sci-Fi Gimmicks
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;