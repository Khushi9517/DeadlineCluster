import React, { useState } from 'react';
import { DeadlineWithCluster, SubmissionCluster } from '../types/deadline';
import { FileCheck, Copy, Check, X, Printer, Shield } from 'lucide-react';

interface EvidenceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadlines: DeadlineWithCluster[];
  clusters: SubmissionCluster[];
}

export const EvidenceExportModal: React.FC<EvidenceExportModalProps> = ({
  isOpen,
  onClose,
  deadlines,
  clusters,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateReportText = () => {
    let report = `===========================================================\n`;
    report += `ACADEMIC WORKLOAD & ASSESSMENT OVERLAP REPORT\n`;
    report += `Institutional Reference: University of Portsmouth Assessment Guidance\n`;
    report += `Date Generated: ${new Date().toLocaleDateString('en-GB', { dateStyle: 'full' })}\n`;
    report += `===========================================================\n\n`;

    report += `1. OVERALL SUMMARY\n`;
    report += `Total Registered Assessments: ${deadlines.length}\n`;
    report += `Identified Conflict Clusters: ${clusters.length}\n\n`;

    if (clusters.length > 0) {
      report += `2. CRITICAL CONVERGENCE CLUSTERS (Rule: 3+ Submissions within 48 Hours)\n`;
      clusters.forEach((c, idx) => {
        report += `[Cluster #${idx + 1}] ${c.count} Submissions within ${c.spanHours} Hours\n`;
        report += `Timeframe: ${new Date(c.startTime).toLocaleString('en-GB')} to ${new Date(c.endTime).toLocaleString('en-GB')}\n`;
        report += `Participating Assessments:\n`;
        c.items.forEach((item) => {
          report += `  - ${item.subject} | ${item.title}\n`;
          report += `    Due: ${item.formattedDateTime}\n`;
        });
        report += `\n`;
      });
    } else {
      report += `2. NO CONFLICT CLUSTERS DETECTED\nDeadlines meet standard spacing guidelines.\n\n`;
    }

    report += `3. VERIFIED CHRONOLOGICAL ASSESSMENT REGISTER\n`;
    deadlines.forEach((item, idx) => {
      report += `${idx + 1}. [${item.subject}] ${item.title}\n`;
      report += `   Deadline: ${item.formattedDateTime}\n`;
      if (item.hoursFromPrev !== null) {
        report += `   Gap from previous submission: +${item.hoursFromPrev} hours\n`;
      }
      report += `   Source Evidence: "${item.sourceText}"\n`;
      if (item.ambiguityWarning) {
        report += `   Verification Note: ${item.ambiguityWarning}\n`;
      }
      report += `   Status: ${item.isVerified ? 'VERIFIED BY STUDENT' : 'PENDING REVIEW'}\n\n`;
    });

    report += `===========================================================\n`;
    report += `Scope Boundary Note: Prepared strictly for identifying overlapping\ncommitments and planning workload with module leaders.\n`;
    report += `===========================================================\n`;
    return report;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Assessment Overlap Evidence Notice
              </h3>
              <p className="text-xs text-slate-500">
                Formatted documentation for personal tutors or module leaders.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Monospace Document */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs bg-slate-900 text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
          {generateReportText()}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Portsmouth Assessment Guidance Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Evidence Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
