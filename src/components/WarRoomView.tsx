import React, { useState } from 'react';
import {
  Brain,
  MessageSquare,
  Vote,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  AgentProfile,
  AgentRole,
  AgentProposal,
  DeliberationMessage,
  CompanyState,
} from '../engine/types';

interface WarRoomViewProps {
  agents: Record<AgentRole, AgentProfile>;
  proposals: AgentProposal[];
  deliberations: DeliberationMessage[];
  company: CompanyState;
  onVoteProposal: (proposalId: string, approve: boolean) => void;
  onPostBoardMessage: (message: string) => void;
}

export const WarRoomView: React.FC<WarRoomViewProps> = ({
  agents,
  proposals,
  deliberations,
  company,
  onVoteProposal,
  onPostBoardMessage,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('CEO');
  const [customDirective, setCustomDirective] = useState('');

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDirective.trim()) return;
    onPostBoardMessage(customDirective);
    setCustomDirective('');
  };

  const getRoleBadgeColor = (role: AgentRole) => {
    switch (role) {
      case 'CEO':
        return 'bg-[#2457C5]/10 text-[#2457C5] border-[#2457C5]/30';
      case 'CFO':
        return 'bg-[#1E7B54]/10 text-[#1E7B54] border-[#1E7B54]/30';
      case 'CMO':
        return 'bg-[#D9A441]/20 text-[#8B610F] border-[#D9A441]/40';
      case 'COO':
        return 'bg-[#14284B]/10 text-[#14284B] border-[#14284B]/30';
    }
  };

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'Support':
        return 'bg-[#1E7B54]/10 text-[#1E7B54] border-[#1E7B54]/30';
      case 'Caution':
        return 'bg-[#D9A441]/15 text-[#9E6E16] border-[#D9A441]/30';
      case 'Object':
        return 'bg-[#BA2D32]/10 text-[#BA2D32] border-[#BA2D32]/30';
      default:
        return 'bg-[#2457C5]/10 text-[#2457C5] border-[#2457C5]/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6 py-2">
      
      {/* 4 C-Suite Agent Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['CEO', 'CFO', 'CMO', 'COO'] as AgentRole[]).map((role) => {
          const agent = agents[role];
          const isSelected = selectedAgent === role;

          return (
            <div
              key={role}
              onClick={() => setSelectedAgent(role)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-[#FFFDF7] border-[#2457C5] ring-2 ring-[#2457C5]/20 shadow-md'
                  : 'bg-[#FFFDF7] border-[#E7DFC9] hover:border-[#D4C9AF] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getRoleBadgeColor(role)}`}>
                  {role}
                </span>
                <span className="text-xs font-mono font-semibold text-[#625F58]">
                  Rating: <b className="text-[#14284B]">{agent.approvalRating}%</b>
                </span>
              </div>

              <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                {agent.name}
              </h3>
              <p className="text-xs text-[#625F58] mb-2">{agent.title}</p>

              <div className="text-[11px] p-2 rounded-lg bg-[#FFF8E9] border border-[#E7DFC9] text-[#14284B] mb-2">
                <span className="font-bold text-[#625F58] block mb-0.5">Focus Objective:</span>
                <p className="line-clamp-2 leading-tight">{agent.currentObjective}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#625F58] pt-1 border-t border-[#E7DFC9]/60">
                <span>Personality:</span>
                <span className="font-semibold text-[#14284B]">{agent.personality}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main War Room Chamber: Live Deliberation Transcript & Agent Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Deliberation Room Transcript */}
        <div className="lg:col-span-7 bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7DFC9]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2457C5]" />
              <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                Executive Deliberation Chamber
              </h3>
            </div>
            <span className="text-xs font-mono text-[#625F58]">
              {deliberations.length} Transcripts Recorded
            </span>
          </div>

          {/* Transcript Feed */}
          <div className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1">
            {deliberations.map((msg) => {
              const agent = agents[msg.agentRole];
              return (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/40 hover:bg-[#FFF8E9] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getRoleBadgeColor(msg.agentRole)}`}>
                        {msg.agentRole} • {agent ? agent.name : 'Board of Directors'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStanceColor(msg.stance)}`}>
                        {msg.stance}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#625F58]">
                      Month {msg.month} • {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#14284B] leading-relaxed">
                    "{msg.message}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Board Directive Input */}
          <form onSubmit={handleSendDirective} className="pt-3 border-t border-[#E7DFC9] flex items-center gap-2">
            <input
              type="text"
              value={customDirective}
              onChange={(e) => setCustomDirective(e.target.value)}
              placeholder="Inject Board of Directors guidance or question into the C-Suite..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E7DFC9] bg-[#FFF8E9] focus:outline-none focus:ring-1 focus:ring-[#2457C5] text-[#14284B] placeholder-[#625F58]"
            />
            <button
              type="submit"
              disabled={!customDirective.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2457C5] hover:bg-[#1B439C] disabled:opacity-50 text-[#FFF8E9] transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Direct</span>
            </button>
          </form>
        </div>

        {/* Right Column (5 Cols): Selected Agent Monologue & Strategic Proposals */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Selected Agent Internal Monologue History */}
          <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7DFC9]">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#D9A441]" />
                <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                  {agents[selectedAgent].name}'s Internal Thoughts
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getRoleBadgeColor(selectedAgent)}`}>
                {selectedAgent}
              </span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {agents[selectedAgent].recentThoughts.map((thought) => (
                <div
                  key={thought.id}
                  className="p-3 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/50 text-xs"
                >
                  <div className="flex items-center justify-between mb-1 text-[11px] text-[#625F58]">
                    <span className="font-semibold text-[#14284B]">{thought.topic}</span>
                    <span className="font-mono">M{thought.month} • {thought.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#14284B] leading-snug">
                    {thought.thought}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#625F58]">
                    <span>Confidence: <b>{Math.round(thought.confidence * 100)}%</b></span>
                    <span className={`font-semibold ${
                      thought.sentiment === 'positive' ? 'text-[#1E7B54]' : thought.sentiment === 'critical' ? 'text-[#BA2D32]' : 'text-[#625F58]'
                    }`}>
                      {thought.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Strategic Proposals & Board Ratification */}
          <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7DFC9]">
              <div className="flex items-center gap-2">
                <Vote className="w-4 h-4 text-[#2457C5]" />
                <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                  Strategic C-Suite Proposals
                </h3>
              </div>
              <span className="text-[11px] text-[#625F58] font-mono">
                {proposals.length} Proposals
              </span>
            </div>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {proposals.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3.5 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9]/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#14284B]">{prop.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prop.status === 'Approved'
                        ? 'bg-[#1E7B54]/10 text-[#1E7B54]'
                        : prop.status === 'Rejected'
                        ? 'bg-[#BA2D32]/10 text-[#BA2D32]'
                        : 'bg-[#D9A441]/20 text-[#8B610F]'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#625F58] leading-snug">
                    {prop.description}
                  </p>

                  <div className="p-2 rounded bg-[#FFFDF7] border border-[#E7DFC9] text-[10px] space-y-1">
                    <span className="font-bold text-[#625F58] block">Agent Voting Tally:</span>
                    <div className="grid grid-cols-2 gap-1 font-mono">
                      {(['CEO', 'CFO', 'CMO', 'COO'] as AgentRole[]).map((r) => (
                        <div key={r} className="flex items-center justify-between">
                          <span>{r}:</span>
                          <span className={`font-bold ${
                            prop.votes[r]?.vote === 'Approve' ? 'text-[#1E7B54]' : 'text-[#BA2D32]'
                          }`}>
                            {prop.votes[r]?.vote || 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {prop.status === 'Pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onVoteProposal(prop.id, true)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#1E7B54] hover:bg-[#165E40] text-[#FFF8E9] font-bold text-[11px] transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Board Ratify</span>
                      </button>
                      <button
                        onClick={() => onVoteProposal(prop.id, false)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#BA2D32] hover:bg-[#962226] text-[#FFF8E9] font-bold text-[11px] transition-colors"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>Board Veto</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};