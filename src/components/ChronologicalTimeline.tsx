import React from 'react';
import { DeadlineWithCluster, SubmissionCluster } from '../types/deadline';
import { Calendar, AlertCircle, ArrowRight } from 'lucide-react';

interface ChronologicalTimelineProps {
  deadlines: DeadlineWithCluster[];
  clusters: SubmissionCluster[];
  selectedClusterId: string | null;
  onSelectDeadline: (id: string) => void;
}

export const ChronologicalTimeline: React.FC<ChronologicalTimelineProps> = ({
  deadlines,
  clusters,
  selectedClusterId,
  onSelectDeadline,
}) => {
  if (deadlines.length === 0) return null;

  const minTs = deadlines[0].timestamp;
  const maxTs = deadlines[deadlines.length - 1].timestamp;
  const totalDuration = Math.max(maxTs - minTs, 1000 * 60 * 60 * 24); // at least 1 day

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-700" />
            Chronological Workload Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Algorithmic timeline showing submission spacing and cluster crunch periods.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-slate-600 font-medium">In 48h Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span className="text-slate-600 font-medium">Standard Spacing</span>
          </div>
        </div>
      </div>

      {/* Cluster Window Highlights Summary */}
      {clusters.length > 0 && (
        <div className="mb-6 p-3 bg-red-50/80 border border-red-200 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">
              Crunch Alert: {clusters[0].count} submissions compressed into {clusters[0].spanHours} hours
            </span>
          </div>
          <span className="font-mono text-red-700 text-[11px] tabular-nums">
            {new Date(clusters[0].startTime).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} – {new Date(clusters[0].endTime).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      )}

      {/* Sequential Milestone Flow */}
      <div className="relative">
        <div className="space-y-4">
          {deadlines.map((item, index) => {
            const isClustered = item.isInCluster;
            const isSelected = selectedClusterId && item.clusterId === selectedClusterId;

            return (
              <div
                key={item.id}
                onClick={() => onSelectDeadline(item.id)}
                className={`group cursor-pointer rounded-lg p-3 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isClustered
                    ? isSelected
                      ? 'bg-red-50/90 border-red-400 shadow-sm ring-1 ring-red-400'
                      : 'bg-red-50/40 border-red-200 hover:border-red-300'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left: Index & Subject Title */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isClustered ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {item.subject}
                      </span>
                      {isClustered && (
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                          Cluster Item
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 truncate max-w-sm sm:max-w-md">
                      {item.title}
                    </div>
                  </div>
                </div>

                {/* Right: Timestamp and Gap from previous */}
                <div className="flex items-center gap-4 text-xs sm:text-right shrink-0">
                  {item.hoursFromPrev !== null && (
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-600 block">Gap from prev</span>
                      <span
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          item.hoursFromPrev <= 24
                            ? 'text-red-600'
                            : item.hoursFromPrev <= 48
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        +{item.hoursFromPrev}h
                      </span>
                    </div>
                  )}

                  <div className="text-left sm:text-right min-w-[120px]">
                    <span className="text-[11px] text-slate-600 block">Submission Deadline</span>
                    <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {item.formattedDateTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
