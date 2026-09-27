import { ExtractedDeadline, DeadlineWithCluster, SubmissionCluster, ClusterRuleConfig } from '../types/deadline';

export const DEFAULT_CLUSTER_CONFIG: ClusterRuleConfig = {
  thresholdCount: 3, // 3 submissions
  windowHours: 48,   // within 48 hours
};

/**
 * Parses YYYY-MM-DD and HH:mm into epoch milliseconds
 */
export function getDeadlineTimestamp(dateStr: string, timeStr: string): number {
  if (!dateStr) return 0;
  const [year, month, day] = dateStr.split('-').map(Number);
  let [hours, minutes] = (timeStr || '23:59').split(':').map(Number);
  if (isNaN(hours)) hours = 23;
  if (isNaN(minutes)) minutes = 59;
  const d = new Date(year, (month || 1) - 1, day || 1, hours, minutes, 0, 0);
  return d.getTime();
}

/**
 * Formats epoch ms into readable format e.g. "Wed, Oct 14 · 17:00"
 */
export function formatDeadlineTimestamp(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) return 'Unset Date';
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Code-based sorting and sliding-window cluster detection algorithm.
 * Rule: Identifies groups where at least thresholdCount submissions fall within windowHours.
 */
export function detectClusters(
  deadlines: ExtractedDeadline[],
  config: ClusterRuleConfig = DEFAULT_CLUSTER_CONFIG
): {
  sortedDeadlines: DeadlineWithCluster[];
  clusters: SubmissionCluster[];
} {
  if (!deadlines || deadlines.length === 0) {
    return { sortedDeadlines: [], clusters: [] };
  }

  // 1. Enrich with timestamps and sort chronologically
  const enriched: DeadlineWithCluster[] = deadlines.map((item) => {
    const ts = getDeadlineTimestamp(item.deadlineDate, item.deadlineTime);
    return {
      ...item,
      timestamp: ts,
      formattedDateTime: formatDeadlineTimestamp(ts),
      isInCluster: false,
      clusterId: null,
      hoursFromPrev: null,
      hoursToNext: null,
    };
  });

  // Strict chronological sort using code
  enriched.sort((a, b) => a.timestamp - b.timestamp);

  // 2. Compute adjacent hour gaps
  for (let i = 0; i < enriched.length; i++) {
    if (i > 0) {
      const diffHours = (enriched[i].timestamp - enriched[i - 1].timestamp) / (1000 * 60 * 60);
      enriched[i].hoursFromPrev = Math.round(diffHours * 10) / 10;
      enriched[i - 1].hoursToNext = Math.round(diffHours * 10) / 10;
    }
  }

  const windowMs = config.windowHours * 60 * 60 * 1000;
  const n = enriched.length;
  const clusteredIndices = new Set<number>();
  const windowRanges: Array<{ start: number; end: number; indices: number[] }> = [];

  // 3. Sliding window over all sorted deadlines
  for (let i = 0; i < n; i++) {
    const currentWindow: number[] = [i];
    for (let j = i + 1; j < n; j++) {
      if (enriched[j].timestamp - enriched[i].timestamp <= windowMs) {
        currentWindow.push(j);
      } else {
        break;
      }
    }

    if (currentWindow.length >= config.thresholdCount) {
      currentWindow.forEach((idx) => clusteredIndices.add(idx));
      windowRanges.push({
        start: enriched[currentWindow[0]].timestamp,
        end: enriched[currentWindow[currentWindow.length - 1]].timestamp,
        indices: currentWindow,
      });
    }
  }

  // 4. Group adjacent/overlapping cluster windows into coherent cluster blocks
  const clusters: SubmissionCluster[] = [];
  if (windowRanges.length > 0) {
    // Merge connected components of clustered indices
    const visited = new Set<number>();
    const sortedClusteredIndices = Array.from(clusteredIndices).sort((a, b) => a - b);

    let currentGroup: number[] = [];
    for (let k = 0; k < sortedClusteredIndices.length; k++) {
      const idx = sortedClusteredIndices[k];
      if (visited.has(idx)) continue;

      if (currentGroup.length === 0) {
        currentGroup.push(idx);
        visited.add(idx);
      } else {
        const lastIdx = currentGroup[currentGroup.length - 1];
        // If consecutive in cluster or separated by <= windowHours
        const gap = enriched[idx].timestamp - enriched[lastIdx].timestamp;
        if (gap <= windowMs) {
          currentGroup.push(idx);
          visited.add(idx);
        } else {
          // Finish current cluster
          if (currentGroup.length >= config.thresholdCount) {
            clusters.push(buildClusterObject(currentGroup, enriched, clusters.length + 1));
          }
          currentGroup = [idx];
          visited.add(idx);
        }
      }
    }

    if (currentGroup.length >= config.thresholdCount) {
      clusters.push(buildClusterObject(currentGroup, enriched, clusters.length + 1));
    }
  }

  // 5. Update enriched items with cluster membership
  clusters.forEach((cluster) => {
    cluster.items.forEach((item) => {
      const target = enriched.find((e) => e.id === item.id);
      if (target) {
        target.isInCluster = true;
        target.clusterId = cluster.id;
      }
    });
  });

  return { sortedDeadlines: enriched, clusters };
}

function buildClusterObject(
  indices: number[],
  enriched: DeadlineWithCluster[],
  indexNum: number
): SubmissionCluster {
  const clusterItems = indices.map((i) => enriched[i]);
  const startTime = clusterItems[0].timestamp;
  const endTime = clusterItems[clusterItems.length - 1].timestamp;
  const spanHours = Math.round(((endTime - startTime) / (1000 * 60 * 60)) * 10) / 10;
  const clusterId = `cluster-${indexNum}`;

  const startDateStr = new Date(startTime).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const endDateStr = new Date(endTime).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return {
    id: clusterId,
    startTime,
    endTime,
    spanHours,
    count: clusterItems.length,
    deadlineIds: clusterItems.map((item) => item.id),
    items: clusterItems,
    severity: clusterItems.length >= 3 && spanHours <= 48 ? 'high' : 'moderate',
    summaryText: `${clusterItems.length} submissions in ${spanHours}h (${startDateStr} - ${endDateStr})`,
  };
}
