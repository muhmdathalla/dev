/**
 * Frontend Architecture & Portfolio Type Definitions
 * Strict TypeScript types for engineering telemetry, projects, and components.
 */

export type ProjectCategory = 'all' | 'systems' | 'web' | 'data';

export interface ArchitectureLayer {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface ProjectItem {
  readonly id: string;
  readonly title: string;
  readonly version?: string;
  readonly category: 'web' | 'data' | 'systems';
  readonly description: string;
  readonly techTags: readonly string[];
  readonly status: string;
  readonly repositoryUrl?: string;
  readonly liveUrl?: string;
  readonly documentationUrl?: string;
  readonly architecture?: readonly ArchitectureLayer[];
}

export interface MarketTelemetry {
  readonly usdIdr: number;
  readonly ihsg: number;
  readonly ihsgDeltaPercent: number;
  readonly btcUsd: number;
  readonly timestamp: string;
  readonly isMarketOpen: boolean;
}

export interface FrontendContribution {
  readonly id: string;
  readonly title: string;
  readonly repository: string;
  readonly repositoryUrl: string;
  readonly role: string;
  readonly techStack: readonly string[];
  readonly architecturalHighlights: readonly string[];
  readonly substantiveCommitRef: string;
  readonly prOrBranchUrl: string;
  readonly impactMetrics: string;
}

export interface TerminalExecutionResult {
  readonly outputLines: readonly string[];
  readonly status: 'success' | 'warning' | 'error' | 'info';
}

export type ThemeMode = 'dark' | 'light';
