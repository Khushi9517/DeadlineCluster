import React, { useState } from 'react';
import { ExtractedDeadline } from '../types/deadline';
import { Plus, X, Calendar, Clock, BookOpen, Quote, AlertTriangle, CheckCircle } from 'lucide-react';

interface AddDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newDeadline: ExtractedDeadline) => void;
}

export const AddDeadlineModal: React.FC<AddDeadlineModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [subject, setSubject] = useState('CS401 Web Systems');
  const [title, setTitle] = useState('Full-Stack Application Submission');
  const [deadlineDate, setDeadlineDate] = useState('2026-10-18');
  const [deadlineTime, setDeadlineTime] = useState('17:00');
  const [sourceText, setSourceText] = useState('Directly submitted via course portal before cutoff time.');
  const [hasWarning, setHasWarning] = useState(false);
  const [ambiguityWarning, setAmbiguityWarning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !title.trim() || !deadlineDate) return;

    const newId = `deadline-custom-${Date.now()}`;
    const newDeadline: ExtractedDeadline = {
      id: newId,
      subject: subject.trim(),
      title: title.trim(),
      deadlineDate,
      deadlineTime: deadlineTime || '23:59',
      sourceText: sourceText.trim() || 'Manually reported assessment deadline.',
      missingYear: false,
      inferredYear: 2026,
      isRelativeDate: false,
      hasConflictingDates: false,
      ambiguityWarning: hasWarning ? ambiguityWarning.trim() : '',
      confidence: 'high',
      isVerified: true,
      notes: '',
    };

    onAdd(newDeadline);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Assessment Deadline</h3>
              <p className="text-xs text-slate-500">
                Manually record a subject assessment deadline in your master register.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Subject */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Subject / Module Code &amp; Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. CS401 Web Systems & Architectures"
              className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Assessment Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Assessment Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Implementation & Evaluation Report"
              className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Submission Date</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Cutoff Time (24h)</span>
              </label>
              <input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Supporting Source Text */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block flex items-center gap-1">
              <Quote className="w-3.5 h-3.5 text-slate-500" />
              <span>Supporting Source Text / Brief Excerpt</span>
            </label>
            <textarea
              rows={3}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste supporting quote from syllabus or course announcement..."
              className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Ambiguity Flag Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={hasWarning}
                onChange={(e) => setHasWarning(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="font-medium">Flag ambiguity or relative date note for student review</span>
            </label>

            {hasWarning && (
              <div className="mt-2 space-y-1">
                <input
                  type="text"
                  value={ambiguityWarning}
                  onChange={(e) => setAmbiguityWarning(e.target.value)}
                  placeholder="e.g. Tentative draft date mentioned; verify portal lock time."
                  className="w-full text-xs text-amber-900 bg-amber-50 border border-amber-300 rounded-lg px-3 py-1.5 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save &amp; Add Deadline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
