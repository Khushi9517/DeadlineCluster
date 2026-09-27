import React from 'react';
import { AlertOctagon, Clock, CheckCircle2, ChevronRight, Sliders, Calendar } from 'lucide-react';
import { SubmissionCluster, ClusterRuleConfig } from '../types/deadline';

interface ClusterAlertBannerProps {
  clusters: SubmissionCluster[];
  config: ClusterRuleConfig;
  onUpdateConfig: (newConfig: ClusterRuleConfig) => void;
  onSelectCluster: (clusterId: string) => void;
}

export const ClusterAlertBanner: React.FC<ClusterAlertBannerProps> = ({
  clusters,
  config,
  onUpdateConfig,
  onSelectCluster,
}) => {
  const hasClusters = clusters.length > 0;

  return (
    <section className="mb-8">
      {hasClusters ? (
        <div className="bg-red-50 border-2 border-red-500/60 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-red-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-600 text-white rounded-lg shrink-0 mt-0.5 shadow-sm">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    Crowded Period Flagged
                  </span>
                  <span className="text-xs text-red-600 font-medium">
                    Rule triggered: {config.thresholdCount} submissions in &le; {config.windowHours}h
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {clusters.length} Submission Cluster{clusters.length > 1 ? 's' : ''} Detected
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Multiple subjects have high-stakes deadlines converging within hours of each other.
                </p>
              </div>
            </div>

            {/* Rule Config Controls */}
            <div className="flex items-center gap-2 bg-white/80 border border-red-200 px-3 py-1.5 rounded-lg text-xs self-start lg:self-center">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 font-medium">Rule criteria:</span>
              <select
                aria-label="Cluster submission count rule"
                value={config.thresholdCount}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    thresholdCount: Number(e.target.value),
                  })
                }
                className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 font-mono text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value={2}>2 submissions</option>
                <option value={3}>3 submissions (standard)</option>
                <option value={4}>4 submissions</option>
              </select>
              <span className="text-slate-500">within</span>
              <select
                aria-label="Cluster window hours"
                value={config.windowHours}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    windowHours: Number(e.target.value),
                  })
                }
                className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 font-mono text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value={24}>24 hours</option>
                <option value={48}>48 hours (standard)</option>
                <option value={72}>72 hours</option>
                <option value={96}>96 hours</option>
              </select>
            </div>
          </div>

          {/* List of active clusters */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {clusters.map((cluster, idx) => (
              <div
                key={cluster.id}
                onClick={() => onSelectCluster(cluster.id)}
                className="cursor-pointer bg-white p-4 rounded-lg border border-red-200 hover:border-red-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-red-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      Cluster #{idx + 1}
                    </span>
                    <span className="font-mono text-slate-700 tabular-nums">
                      Span: {cluster.spanHours} hrs
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {cluster.count} Submissions within {cluster.spanHours} hours
                  </h4>

                  <div className="text-xs text-slate-600 space-y-1 my-2">
                    {cluster.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-0.5 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">
                          {item.subject}: {item.title}
                        </span>
                        <span className="font-mono text-[11px] text-slate-600 tabular-nums shrink-0 ml-2">
                          {item.deadlineDate.slice(5)} · {item.deadlineTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-red-600 font-medium">
                  <span>Click to highlight items below</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-900 block">
                No Critical Clusters Detected
              </span>
              <span>
                No periods with {config.thresholdCount} or more submissions within {config.windowHours} hours. Deadlines are reasonably spaced out.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums text-[11px]">Rule: {config.thresholdCount} in {config.windowHours}h</span>
          </div>
        </div>
      )}
    </section>
  );
};
