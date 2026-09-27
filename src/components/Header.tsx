import React from 'react';
import { Calendar, AlertCircle, Sparkles, RefreshCw, BookOpen, Plus } from 'lucide-react';

interface HeaderProps {
  onExtract: () => void;
  onAddDeadline: () => void;
  isExtracting: boolean;
  activeTab: 'briefs' | 'deadlines' | 'timeline' | 'guidance';
  setActiveTab: (tab: 'briefs' | 'deadlines' | 'timeline' | 'guidance') => void;
  clusterCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onExtract,
  onAddDeadline,
  isExtracting,
  activeTab,
  setActiveTab,
  clusterCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            DC
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('deadlines');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-slate-700 transition-colors"
          >
            DeadlineCluster
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`transition-colors relative py-1 ${
              activeTab === 'deadlines'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Verified Deadlines
            {clusterCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center text-[11px] font-mono font-semibold px-1.5 py-0.2 bg-red-100 text-red-700 rounded">
                {clusterCount} conflict{clusterCount > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('briefs')}
            className={`transition-colors relative py-1 ${
              activeTab === 'briefs'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Input Briefs
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`transition-colors relative py-1 ${
              activeTab === 'timeline'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Cluster Timeline
          </button>

          <button
            onClick={() => setActiveTab('guidance')}
            className={`transition-colors relative py-1 flex items-center gap-1.5 ${
              activeTab === 'guidance'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Portsmouth Guidance
          </button>
        </nav>

        {/* Zone 3: Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onAddDeadline}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-slate-700" />
            <span>Add Deadline</span>
          </button>

          <button
            onClick={onExtract}
            disabled={isExtracting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 transition-colors rounded-lg shadow-sm whitespace-nowrap"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Extract Deadlines</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
