import React, { useState } from 'react';
import {
  DeadlineWithCluster,
  SubmissionCluster,
} from '../types/deadline';
import {
  Check,
  AlertTriangle,
  Quote,
  Clock,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Plus,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface VerifiedDeadlineListProps {
  deadlines: DeadlineWithCluster[];
  clusters: SubmissionCluster[];
  selectedClusterId: string | null;
  onUpdateDeadline: (id: string, updatedFields: Partial<DeadlineWithCluster>) => void;
  onDeleteDeadline: (id: string) => void;
  onAddDeadline: () => void;
  onSelectCluster: (clusterId: string | null) => void;
  onJumpToBrief: (briefId: string) => void;
}

export const VerifiedDeadlineList: React.FC<VerifiedDeadlineListProps> = ({
  deadlines,
  clusters,
  selectedClusterId,
  onUpdateDeadline,
  onDeleteDeadline,
  onAddDeadline,
  onSelectCluster,
  onJumpToBrief,
}) => {
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'clustered' | 'unverified'>('all');

  const toggleQuote = (id: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDeadlines = deadlines.filter((item) => {
    if (filterMode === 'clustered') return item.isInCluster;
    if (filterMode === 'unverified') return !item.isVerified;
    return true;
  });

  const verifiedCount = deadlines.filter((d) => d.isVerified).length;

  return (
    <section className="space-y-6">
      {/* Action / Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Verified Deadline Register
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
              {deadlines.length} assessments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Editable assessment submissions with supporting text excerpts. Code sorts and checks for clusters.
          </p>
        </div>

        {/* Filter Segmented Control & Add Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({deadlines.length})
            </button>
            <button
              onClick={() => setFilterMode('clustered')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterMode === 'clustered'
                  ? 'bg-white text-red-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clustered ({deadlines.filter((d) => d.isInCluster).length})
            </button>
            <button
              onClick={() => setFilterMode('unverified')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterMode === 'unverified'
                  ? 'bg-white text-amber-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unverified ({deadlines.length - verifiedCount})
            </button>
          </div>

          <button
            onClick={() => {
              setFilterMode('all');
              onAddDeadline();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filteredDeadlines.map((item, idx) => {
          const isHighlighted = selectedClusterId && item.clusterId === selectedClusterId;
          const hasAmbiguity =
            item.missingYear || item.isRelativeDate || item.hasConflictingDates || item.ambiguityWarning;

          return (
            <div
              key={item.id}
              data-deadline-id={item.id}
              id={`deadline-card-${item.id}`}
              className={`rounded-xl border transition-all p-5 ${
                item.isInCluster
                  ? isHighlighted
                    ? 'bg-red-50/90 border-red-500 shadow-md ring-1 ring-red-400'
                    : 'bg-red-50/30 border-red-200 hover:border-red-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Row 1: Header with Subject, Cluster Tag & Verification Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>

                  <input
                    type="text"
                    value={item.subject}
                    onChange={(e) => onUpdateDeadline(item.id, { subject: e.target.value })}
                    className="text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none px-1 py-0.5 transition-colors"
                    placeholder="Subject Code"
                  />

                  {item.isInCluster && (
                    <span className="text-[11px] font-mono font-bold tracking-tight text-red-700 bg-red-100/90 border border-red-200 px-2 py-0.5 rounded">
                      48h Cluster Conflict
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Verification Status Button */}
                  <button
                    onClick={() => onUpdateDeadline(item.id, { isVerified: !item.isVerified })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      item.isVerified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${item.isVerified ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>{item.isVerified ? 'Verified by Student' : 'Mark Verified'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteDeadline(item.id)}
                    title="Remove deadline"
                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: Editable Fields (Title, Date, Time, Gap) */}
              <div className="grid md:grid-cols-12 gap-4 my-4">
                {/* Title */}
                <div className="md:col-span-6 space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 block">
                    Assessment Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => onUpdateDeadline(item.id, { title: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Date Picker */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 block">
                    Submission Date (YYYY-MM-DD)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={item.deadlineDate}
                      onChange={(e) => onUpdateDeadline(item.id, { deadlineDate: e.target.value })}
                      className="w-full text-xs font-mono font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Time Picker */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 block">
                    Cutoff Time (24h)
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={item.deadlineTime}
                      onChange={(e) => onUpdateDeadline(item.id, { deadlineTime: e.target.value })}
                      className="w-full text-xs font-mono font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Engineering Challenge: Ambiguity Warnings & Handling Without Silent Guessing */}
              {hasAmbiguity && (
                <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 my-3 text-xs text-amber-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-amber-950 block">
                        Ambiguity Detected — Student Verification Required
                      </span>
                      <p className="text-amber-800 leading-normal mt-0.5">
                        {item.ambiguityWarning || 'Notice contains ambiguous or relative date references.'}
                      </p>
                    </div>
                  </div>

                  {/* Relative Phrasing Quick Resolution (e.g. Next Friday) */}
                  {item.isRelativeDate && item.relativeOptions && (
                    <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center gap-2">
                      <span className="text-amber-800 font-medium">Select intended Friday:</span>
                      {item.relativeOptions.map((opt) => (
                        <button
                          key={opt.date}
                          onClick={() => {
                            onUpdateDeadline(item.id, {
                              deadlineDate: opt.date,
                              isRelativeDate: false,
                              ambiguityWarning: '',
                              isVerified: true,
                            });
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium border transition-colors ${
                            item.deadlineDate === opt.date
                              ? 'bg-amber-200 border-amber-400 text-amber-950 font-bold'
                              : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Conflicting Dates Quick Resolution */}
                  {item.hasConflictingDates && item.conflictingDatesList && item.conflictingDatesList.length > 0 && (
                    <div className="pt-2 border-t border-amber-200/80 space-y-1">
                      <span className="text-amber-800 font-medium block">Dates mentioned in announcement:</span>
                      <div className="flex flex-wrap gap-2">
                        {item.conflictingDatesList.map((desc, dIdx) => (
                          <div
                            key={dIdx}
                            className="bg-white/90 border border-amber-300 px-2 py-1 rounded text-[11px] font-mono text-amber-950"
                          >
                            {desc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Year Quick Confirmation */}
                  {item.missingYear && (
                    <div className="pt-2 border-t border-amber-200/80 flex items-center gap-2">
                      <span className="text-amber-800 font-medium">Academic Year:</span>
                      <button
                        onClick={() => {
                          onUpdateDeadline(item.id, {
                            missingYear: false,
                            ambiguityWarning: item.isRelativeDate ? item.ambiguityWarning : '',
                          });
                        }}
                        className="px-2 py-0.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded text-[11px] font-mono"
                      >
                        Confirm Year {item.inferredYear}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Supporting Source Text Quote */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Quote className="w-3.5 h-3.5 text-slate-700" />
                    <span>Supporting Source Text:</span>
                    <button
                      onClick={() => toggleQuote(item.id)}
                      className="text-slate-600 hover:text-slate-900 underline ml-1"
                    >
                      {expandedQuotes[item.id] ? 'collapse' : 'view quote'}
                    </button>
                  </div>

                  <p
                    className={`italic text-slate-700 bg-slate-50 border-l-2 border-slate-300 px-3 py-1.5 rounded-r text-[11px] leading-relaxed transition-all ${
                      expandedQuotes[item.id] ? 'block' : 'line-clamp-1'
                    }`}
                  >
                    &ldquo;{item.sourceText}&rdquo;
                  </p>
                </div>

                {/* Hours gap from previous submission */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-xs">
                  {item.hoursFromPrev !== null && (
                    <span className="font-mono text-slate-700 text-[11px] tabular-nums">
                      Gap: +{item.hoursFromPrev}h
                    </span>
                  )}

                  <button
                    onClick={() => onJumpToBrief(item.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    <span>View Brief</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDeadlines.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
          No deadlines match the current filter.
        </div>
      )}
    </section>
  );
};
