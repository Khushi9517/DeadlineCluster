import React from 'react';
import { BookOpen, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';

export const PortsmouthGuidanceBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-6 mb-8 border border-slate-800 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>INSTITUTIONAL EVIDENCE &amp; WORKLOAD POLICY</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            University of Portsmouth Assessment Guidance: Centralising Deadlines
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Higher education guidance (including the University of Portsmouth’s study skills &amp; assessment policy)
            advises students to gather deadlines across all module briefs into a single unified record as early as Week 1.
            Without an aggregated view, students encounter &ldquo;submission convergence&rdquo;—discovering that three or more high-stakes
            assessments fall due within a 48-hour window.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">The 48-Hour Crunch Risk</strong>
                Submitting 3+ assignments within 48 hours dramatically spikes cognitive fatigue and penalty risks.
                Flagging clusters provides students with objective evidence to plan work or request mitigating adjustments.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Zero Silent Guessing Policy</strong>
                Informal phrases like &ldquo;next Friday&rdquo; or omitted years must be made visible with supporting quotes
                so students verify official submission timestamps directly with module briefs.
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-2 p-4 rounded-lg bg-slate-800/40 border border-slate-700/40 text-xs text-slate-400 max-w-xs">
          <span className="font-semibold text-slate-200">Scope Boundary Reminder</span>
          <p className="leading-normal">
            This tool strictly flags submission conflicts and extracts verifiable deadlines.
            It does not fabricate automated study schedules or modify university deadlines.
          </p>
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Planning Monthly Workload</span>
            <span className="font-mono text-slate-300">UoP Skills Ref</span>
          </div>
        </div>
      </div>
    </div>
  );
};
