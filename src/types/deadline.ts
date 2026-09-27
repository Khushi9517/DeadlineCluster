export interface Brief {
  id: string;
  subject: string;
  title: string;
  content: string;
  sourceChannel: 'Canvas Announcement' | 'Course Email' | 'Moodle Forum' | 'Lecture Note' | 'Syllabus Snippet';
  postedDate: string;
}

export interface ExtractedDeadline {
  id: string;
  title: string;
  subject: string;
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:mm
  sourceText: string;
  missingYear: boolean;
  inferredYear: number;
  isRelativeDate: boolean;
  relativePhrase?: string;
  relativeOptions?: Array<{ label: string; date: string }>;
  hasConflictingDates: boolean;
  conflictingDatesList?: string[];
  ambiguityWarning: string;
  confidence: 'high' | 'medium' | 'low';
  isVerified: boolean;
  notes?: string;
}

export interface DeadlineWithCluster extends ExtractedDeadline {
  timestamp: number; // epoch ms
  formattedDateTime: string;
  isInCluster: boolean;
  clusterId: string | null;
  hoursFromPrev: number | null;
  hoursToNext: number | null;
  clusterColor?: string;
}

export interface SubmissionCluster {
  id: string;
  startTime: number;
  endTime: number;
  spanHours: number;
  count: number;
  deadlineIds: string[];
  items: DeadlineWithCluster[];
  severity: 'high' | 'moderate';
  summaryText: string;
}

export interface ClusterRuleConfig {
  thresholdCount: number; // e.g. 3 submissions
  windowHours: number;    // e.g. 48 hours
}
