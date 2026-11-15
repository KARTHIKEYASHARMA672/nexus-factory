import React, { useState } from 'react';
import {
  FlaskConical,
  TrendingUp,
  Target,
  Trophy,
  PlusCircle,
  Play,
  Pause,
  Percent,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  MarketingCampaign,
  MarketingChannel,
  CustomerCohortType,
} from '../engine/types';

interface MarketingLabViewProps {
  campaigns: MarketingCampaign[];
  onToggleCampaign: (id: string) => void;
  onAddCampaign: (newCampaign: MarketingCampaign) => void;
}

export const MarketingLabView: React.FC<MarketingLabViewProps> = ({
  campaigns,
  onToggleCampaign,
  onAddCampaign,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<MarketingChannel>('Performance Paid Ads');
  const [budget, setBudget] = useState(8000);
  const [cohort, setCohort] = useState<CustomerCohortType>('Mid-Market Leaders');
  const [hookA, setHookA] = useState('Cut operational costs by 40% with automated workflows');
  const [hookB, setHookB] = useState('The modern platform engineered for high-velocity teams');

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      name,
      channel,
      monthlyBudget: budget,
      status: 'Active',
      targetCohort: cohort,
      variantA: {
        hook: hookA,
        impressions: 12000,
        clicks: 480,
        conversions: 18,
        cac: Math.round(budget * 0.5 / 18),
      },
      variantB: {
        hook: hookB,
        impressions: 12500,
        clicks: 610,
        conversions: 26,
        cac: Math.round(budget * 0.5 / 26),
      },
      confidenceScore: 78,
      winningVariant: 'Inconclusive',
      roiPercent: 195,
      monthsActive: 1,
    };

    onAddCampaign(newCamp);
    setShowAddModal(false);
    setName('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6 py-2">
      
      {/* Top Banner & Launch Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-5 h-5 text-[#2457C5]" />
            <h2 className="font-serif-heading text-lg font-bold text-[#14284B]">
              Marketing Experimentation Lab (A/B Test Studio)
            </h2>
          </div>
          <p className="text-xs text-[#625F58]">
            Simulate ad copy hooks, landing page funnels, and statistical significance across customer segments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2457C5] hover:bg-[#1B439C] text-[#FFF8E9] transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch A/B Experiment</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        {campaigns.map((camp) => {
          const ctrA = +((camp.variantA.clicks / Math.max(1, camp.variantA.impressions)) * 100).toFixed(2);
          const ctrB = +((camp.variantB.clicks / Math.max(1, camp.variantB.impressions)) * 100).toFixed(2);
          const cvrA = +((camp.variantA.conversions / Math.max(1, camp.variantA.clicks)) * 100).toFixed(2);
          const cvrB = +((camp.variantB.conversions / Math.max(1, camp.variantB.clicks)) * 100).toFixed(2);

          return (
            <div
              key={camp.id}
              className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-5 shadow-sm space-y-4"
            >
              {/* Campaign Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-[#E7DFC9]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-heading text-base font-bold text-[#14284B]">
                      {camp.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#F5EEDF] text-[#625F58] border border-[#E7DFC9]">
                      {camp.channel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2457C5]/10 text-[#2457C5]">
                      Target: {camp.targetCohort}
                    </span>
                  </div>
                  <span className="text-xs text-[#625F58]">
                    Monthly Budget: <b className="font-mono text-[#14284B]">{formatCurrency(camp.monthlyBudget)}/mo</b> • ROI: <b className="font-mono text-[#1E7B54]">+{camp.roiPercent}%</b>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-[#625F58] block">Statistical Confidence</span>
                    <span className="font-mono text-xs font-bold text-[#14284B]">
                      {camp.confidenceScore}% Significance
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleCampaign(camp.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      camp.status === 'Active'
                        ? 'bg-[#1E7B54]/10 text-[#1E7B54] border-[#1E7B54]/30 hover:bg-[#1E7B54]/20'
                        : 'bg-[#625F58]/10 text-[#625F58] border-[#625F58]/30 hover:bg-[#625F58]/20'
                    }`}
                  >
                    {camp.status === 'Active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{camp.status}</span>
                  </button>
                </div>
              </div>

              {/* A/B Test Head-to-Head Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Variant A */}
                <div className={`p-4 rounded-xl border relative transition-all ${
                  camp.winningVariant === 'Variant A'
                    ? 'bg-[#1E7B54]/5 border-[#1E7B54] ring-1 ring-[#1E7B54]/20'
                    : 'bg-[#FFF8E9]/40 border-[#E7DFC9]'
                }`}>
                  {camp.winningVariant === 'Variant A' && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E7B54] text-[#FFF8E9]">
                      <Trophy className="w-3 h-3" /> Winner
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-[#2457C5] block mb-1">
                    Variant A (Control Hook)
                  </span>
                  <p className="text-xs text-[#14284B] font-serif-heading italic mb-3">
                    "{camp.variantA.hook}"
                  </p>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono bg-[#FFFDF7] p-2 rounded-lg border border-[#E7DFC9]">
                    <div>
                      <span className="text-[10px] text-[#625F58] block">Impr</span>
                      <span className="font-bold text-[#14284B]">{camp.variantA.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#625F58] block">CTR</span>
                      <span className="font-bold text-[#14284B]">{ctrA}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#625F58] block">Conv</span>
                      <span className="font-bold text-[#1E7B54]">{camp.variantA.conversions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#625F58] block">CAC</span>
                      <span className="font-bold text-[#2457C5]">{formatCurrency(camp.variantA.cac)}</span>
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div className={`p-4 rounded-xl border relative transition-all ${
                  camp.winningVariant === 'Variant B'
                    ? 'bg-[#1E7B54]/5 border-[#1E7B54] ring-1 ring-[#1E7B54]/20'
                    : 'bg-[#FFF8E9]/40 border-[#E7DFC9]'
                }`}>
                  {camp.winningVariant === 'Variant B' && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E7B54] text-[#FFF8E9]">
                      <Trophy className="w-3 h-3" /> Winner
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-[#2457C5] block mb-1">
                    Variant B (Challenger Hook)
                  </span>
                  <p className="text-xs text-[#14284B] font-serif-heading italic mb-3">
                    "{camp.variantB.hook}"
                  </p>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono bg-[#FFFDF7] p-2 rounded-lg border border-[#E7DFC9]">
                    <div>
                      <span className="text-[10px] text-[#625F58] block">Impr</span>
                      <span className="font-bold text-[#14284B]">{camp.variantB.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#625F58] block">CTR</span>
                      <span className="font-bold text-[#14284B]">{ctrB}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#625F58] block">Conv</span>
                      <span className="font-bold text-[#1E7B54]">{camp.variantB.conversions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#625F58] block">CAC</span>
                      <span className="font-bold text-[#2457C5]">{formatCurrency(camp.variantB.cac)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Launch Experiment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#14284B]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF7] border border-[#E7DFC9] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7DFC9]">
              <h3 className="font-serif-heading text-lg font-bold text-[#14284B]">
                Deploy New Marketing A/B Experiment
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-[#625F58] hover:text-[#14284B]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#14284B] mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Developer Community Referral Drive"
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9] focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#14284B] mb-1">Acquisition Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as MarketingChannel)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9] focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                  >
                    <option value="Performance Paid Ads">Performance Paid Ads</option>
                    <option value="Organic Search & SEO">Organic Search & SEO</option>
                    <option value="Social Video & Influencers">Social Video & Influencers</option>
                    <option value="Cold Enterprise Outbound">Cold Enterprise Outbound</option>
                    <option value="Referral Viral Loops">Referral Viral Loops</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#14284B] mb-1">Monthly Budget ($)</label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9] focus:outline-none focus:ring-1 focus:ring-[#2457C5] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#14284B] mb-1">Target Customer Segment</label>
                <select
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value as CustomerCohortType)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9] focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                >
                  <option value="Enterprise Whales">Enterprise Whales</option>
                  <option value="Mid-Market Leaders">Mid-Market Leaders</option>
                  <option value="SMBs & Teams">SMBs & Teams</option>
                  <option value="Self-Serve Prosumers">Self-Serve Prosumers</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#14284B] mb-1">Variant A Copy (Control Hook)</label>
                <input
                  type="text"
                  required
                  value={hookA}
                  onChange={(e) => setHookA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9] focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#14284B] mb-1">Variant B Copy (Challenger Hook)</label>
                <input
                  type="text"
                  required
                  value={hookB}
                  onChange={(e) => setHookB(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DFC9] bg-[#FFF8E9] focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7DFC9]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#625F58] hover:bg-[#F5EEDF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2457C5] hover:bg-[#1B439C] text-[#FFF8E9]"
                >
                  Deploy Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};