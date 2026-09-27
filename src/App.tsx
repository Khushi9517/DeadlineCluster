import React, { useState, useEffect, useMemo } from 'react';
import { Brief, ExtractedDeadline, ClusterRuleConfig } from './types/deadline';
import { INITIAL_SIX_BRIEFS } from './data/sampleBriefs';
import { detectClusters, DEFAULT_CLUSTER_CONFIG } from './utils/clustering';
import { extractDeadlinesFromBriefs, localRuleExtractor } from './services/deadlineExtractor';
import { Header } from './components/Header';
import { PortsmouthGuidanceBanner } from './components/PortsmouthGuidanceBanner';
import { ClusterAlertBanner } from './components/ClusterAlertBanner';
import { ChronologicalTimeline } from './components/ChronologicalTimeline';
import { VerifiedDeadlineList } from './components/VerifiedDeadlineList';
import { BriefsInputSection } from './components/BriefsInputSection';
import { EvidenceExportModal } from './components/EvidenceExportModal';
import { AddDeadlineModal } from './components/AddDeadlineModal';
import {
  FileText,
  Calendar,
  AlertTriangle,
  Clock,
  BookOpen,
  ArrowRight,
  Share2,
  Sparkles,
  Info,
} from 'lucide-react';

export default function App() {
  const [briefs, setBriefs] = useState<Brief[]>(INITIAL_SIX_BRIEFS);
  const [deadlines, setDeadlines] = useState<ExtractedDeadline[]>(() =>
    localRuleExtractor(INITIAL_SIX_BRIEFS)
  );
  const [clusterConfig, setClusterConfig] = useState<ClusterRuleConfig>(DEFAULT_CLUSTER_CONFIG);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'deadlines' | 'briefs' | 'timeline' | 'guidance'>('deadlines');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [highlightedBriefId, setHighlightedBriefId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    'Extracted 6 assignment deadlines with 1 active cluster flagged (3+ in 48h).'
  );

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Algorithmic sorting & cluster detection in code
  const { sortedDeadlines, clusters } = useMemo(() => {
    return detectClusters(deadlines, clusterConfig);
  }, [deadlines, clusterConfig]);

  // Handle AI extraction from current briefs
  const handleExtract = async () => {
    setIsExtracting(true);
    try {
      const extracted = await extractDeadlinesFromBriefs(briefs);
      setDeadlines(extracted);
      setToastMessage(`Extracted ${extracted.length} deadlines. Code sorting and cluster rules applied.`);
      setActiveTab('deadlines');
    } catch (err: any) {
      console.error('Failed to extract deadlines:', err);
      // Fallback
      const fallback = localRuleExtractor(briefs);
      setDeadlines(fallback);
      setToastMessage('Applied local deterministic rule extractor.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleUpdateDeadline = (id: string, updatedFields: Partial<ExtractedDeadline>) => {
    setDeadlines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveNewDeadline = (newDeadline: ExtractedDeadline) => {
    setDeadlines((prev) => [...prev, newDeadline]);
    setToastMessage(`Added deadline: [${newDeadline.subject}] ${newDeadline.title}`);
    setActiveTab('deadlines');
    setTimeout(() => {
      const el = document.querySelector(`[data-deadline-id="${newDeadline.id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handleJumpToBrief = (briefId: string) => {
    setHighlightedBriefId(briefId);
    setActiveTab('briefs');
    setTimeout(() => {
      const el = document.getElementById(`brief-card-${briefId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Bar Contract (3 zones) */}
      <Header
        onExtract={handleExtract}
        onAddDeadline={() => setIsAddModalOpen(true)}
        isExtracting={isExtracting}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clusterCount={clusters.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subtle Toast Feedback */}
        {toastMessage && (
          <div className="mb-6 p-3 bg-slate-900 text-white text-xs rounded-lg flex items-center justify-between shadow-md transition-all">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white font-mono text-xs px-2"
            >
              dismiss
            </button>
          </div>
        )}

        {/* Top Summary Bar & Evidence CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Student Multi-Subject Assessment Manager</span>
              <span aria-hidden="true">·</span>
              <span>Portsmouth Guidance Standard</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-700 tabular-nums">Academic Year 2026/27</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Assessment Deadline &amp; Conflict Cluster Extractor
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Evidence Overlap Notice</span>
            </button>
          </div>
        </div>

        {/* Always visible cluster crunch alert if detected */}
        <ClusterAlertBanner
          clusters={clusters}
          config={clusterConfig}
          onUpdateConfig={setClusterConfig}
          onSelectCluster={(cid) => {
            setSelectedClusterId(cid);
            setActiveTab('deadlines');
          }}
        />

        {/* Tab 1: Verified Deadlines (Primary View) */}
        {activeTab === 'deadlines' && (
          <div className="space-y-8">
            <VerifiedDeadlineList
              deadlines={sortedDeadlines}
              clusters={clusters}
              selectedClusterId={selectedClusterId}
              onUpdateDeadline={handleUpdateDeadline}
              onDeleteDeadline={handleDeleteDeadline}
              onAddDeadline={() => setIsAddModalOpen(true)}
              onSelectCluster={setSelectedClusterId}
              onJumpToBrief={handleJumpToBrief}
            />

            <ChronologicalTimeline
              deadlines={sortedDeadlines}
              clusters={clusters}
              selectedClusterId={selectedClusterId}
              onSelectDeadline={(id) => {
                const el = document.querySelector(`[data-deadline-id="${id}"]`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />
          </div>
        )}

        {/* Tab 2: Raw Input Briefs */}
        {activeTab === 'briefs' && (
          <BriefsInputSection
            briefs={briefs}
            onUpdateBriefs={setBriefs}
            onExtract={handleExtract}
            isExtracting={isExtracting}
            highlightedBriefId={highlightedBriefId}
          />
        )}

        {/* Tab 3: Detailed Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <ChronologicalTimeline
              deadlines={sortedDeadlines}
              clusters={clusters}
              selectedClusterId={selectedClusterId}
              onSelectDeadline={(id) => {
                setActiveTab('deadlines');
                setTimeout(() => {
                  const el = document.querySelector(`[data-deadline-id="${id}"]`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }}
            />
          </div>
        )}

        {/* Tab 4: Institutional Guidance */}
        {activeTab === 'guidance' && (
          <div className="space-y-6">
            <PortsmouthGuidanceBanner />

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
              <h3 className="text-sm font-bold text-slate-900">
                Institutional Workload Planning Methodology
              </h3>
              <p>
                International academic benchmarking reveals that students who aggregate assessment timelines into
                a single master record at the start of term exhibit significantly lower rates of last-minute penalty
                submissions and mitigating circumstance claims.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="block text-slate-900 mb-1">1. Centralisation</strong>
                  Collate Canvas, Moodle, email, and syllabus notices into a unified chronological register.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="block text-slate-900 mb-1">2. Cluster Identification</strong>
                  Algorithmic detection flags periods where 3 or more deadlines compress into &le; 48 hours.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="block text-slate-900 mb-1">3. Early Staggering</strong>
                  Allows students to sequence writing milestones weeks prior, without needing deadline changes.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">DeadlineCluster</span>
            <span aria-hidden="true">·</span>
            <span>University of Portsmouth Assessment Guidance Aligned</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Code-Based Sliding Window Clustering</span>
            <span aria-hidden="true">·</span>
            <span>No Silent Guessing</span>
          </div>
        </div>
      </footer>

      {/* Evidence Export Modal */}
      <EvidenceExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        deadlines={sortedDeadlines}
        clusters={clusters}
      />

      {/* Add Deadline Modal */}
      <AddDeadlineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleSaveNewDeadline}
      />
    </div>
  );
}
