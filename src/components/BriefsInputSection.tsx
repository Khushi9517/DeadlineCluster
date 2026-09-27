import React, { useState } from 'react';
import { Brief } from '../types/deadline';
import { INITIAL_SIX_BRIEFS } from '../data/sampleBriefs';
import {
  FileText,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Clipboard,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';

interface BriefsInputSectionProps {
  briefs: Brief[];
  onUpdateBriefs: (newBriefs: Brief[]) => void;
  onExtract: () => void;
  isExtracting: boolean;
  highlightedBriefId: string | null;
}

export const BriefsInputSection: React.FC<BriefsInputSectionProps> = ({
  briefs,
  onUpdateBriefs,
  onExtract,
  isExtracting,
  highlightedBriefId,
}) => {
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleUpdateBrief = (id: string, updatedFields: Partial<Brief>) => {
    onUpdateBriefs(
      briefs.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const handleAddBrief = () => {
    const newId = `brief-custom-${Date.now()}`;
    const newBrief: Brief = {
      id: newId,
      subject: 'NEW101 New Course',
      title: 'Course Assessment Brief',
      content: 'Assignment brief: Final project submission is due October 28 at 17:00 via course portal.',
      sourceChannel: 'Canvas Announcement',
      postedDate: 'Today',
    };
    onUpdateBriefs([...briefs, newBrief]);
  };

  const handleDeleteBrief = (id: string) => {
    onUpdateBriefs(briefs.filter((b) => b.id !== id));
  };

  const handleResetToStandard = () => {
    onUpdateBriefs(INITIAL_SIX_BRIEFS);
  };

  const handleBulkPasteSubmit = () => {
    if (!bulkText.trim()) return;
    // Split by double newline or delimiter
    const chunks = bulkText
      .split(/\n\s*\n/)
      .map((c) => c.trim())
      .filter(Boolean);

    const newBriefs: Brief[] = chunks.map((chunk, idx) => {
      const firstLine = chunk.split('\n')[0] || '';
      return {
        id: `brief-bulk-${Date.now()}-${idx}`,
        subject: firstLine.length < 40 ? firstLine : `Module ${idx + 1}`,
        title: `Pasted Assessment Announcement #${idx + 1}`,
        content: chunk,
        sourceChannel: 'Course Email',
        postedDate: 'Pasted Text',
      };
    });

    onUpdateBriefs(newBriefs);
    setPasteModalOpen(false);
    setBulkText('');
  };

  return (
    <section className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Raw Assessment Announcements &amp; Briefs
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
              {briefs.length} briefs loaded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Messy notifications, emails, and syllabus snippets across multiple subjects.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPasteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste Bulk</span>
          </button>

          <button
            onClick={handleAddBrief}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Brief</span>
          </button>

          <button
            onClick={handleResetToStandard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-600 text-xs font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
            title="Reset to 6 Portsmouth Assessment Briefs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 6 Briefs</span>
          </button>
        </div>
      </div>

      {/* Grid of Brief Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {briefs.map((brief, idx) => {
          const isHighlighted = highlightedBriefId === brief.id;

          return (
            <div
              key={brief.id}
              id={`brief-card-${brief.id}`}
              className={`rounded-xl border transition-all p-5 flex flex-col justify-between ${
                isHighlighted
                  ? 'bg-amber-50/60 border-amber-400 shadow-md ring-2 ring-amber-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Meta Bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">
                      Brief #{idx + 1}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-600 font-medium">
                      {brief.sourceChannel}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{brief.postedDate}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteBrief(brief.id)}
                    title="Delete brief"
                    className="text-slate-400 hover:text-red-600 transition-colors p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subject & Title Inputs */}
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    value={brief.subject}
                    onChange={(e) => handleUpdateBrief(brief.id, { subject: e.target.value })}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent border-b border-slate-200 focus:border-slate-800 focus:outline-none pb-0.5"
                    placeholder="Subject Code & Name"
                  />
                  <input
                    type="text"
                    value={brief.title}
                    onChange={(e) => handleUpdateBrief(brief.id, { title: e.target.value })}
                    className="w-full text-xs text-slate-600 bg-transparent border-b border-slate-100 focus:border-slate-800 focus:outline-none pb-0.5"
                    placeholder="Assessment Title"
                  />
                </div>

                {/* Raw Announcement Content Textarea */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-600 block">
                    Announcement Text
                  </label>
                  <textarea
                    rows={4}
                    value={brief.content}
                    onChange={(e) => handleUpdateBrief(brief.id, { content: e.target.value })}
                    className="w-full text-xs font-mono leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3 focus:bg-white focus:border-slate-800 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Card Footer status */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono text-slate-600">{brief.content.length} characters</span>
                <span className="text-slate-600">Editable raw input</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paste Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Paste Multiple Announcements
            </h3>
            <p className="text-xs text-slate-500">
              Paste email text, forum posts, or syllabus paragraphs separated by blank lines. We will parse each paragraph into a distinct brief.
            </p>

            <textarea
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Paste raw announcement text here..."
              className="w-full text-xs font-mono p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkPasteSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Import Announcements
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
