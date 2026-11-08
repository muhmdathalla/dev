import React, { useState, useMemo } from 'react';
import type { FrontendContribution } from '../types/portfolio';

const CONTRIBUTIONS: readonly FrontendContribution[] = [
  {
    id: 'repo-dev-portfolio',
    title: 'Modern Frontend Architecture & Dual-Theme System',
    repository: 'muhmdathalla/dev',
    repositoryUrl: 'https://github.com/muhmdathalla/dev',
    role: 'Architect & Lead Maintainer',
    techStack: ['React 18', 'TypeScript (Strict)', 'Modern CSS Custom Properties', 'WCAG 2.1 AA'],
    architecturalHighlights: [
      'Typed custom hook pipeline (useMarketTelemetry) with error boundaries and live SSE/REST fallback',
      'Bulletproof dual-theme engine (Dark/Light) with instant state synchronization and zero layout reflow',
      'Interactive developer terminal emulator with simulated all-pairs shortest paths graph algorithm'
    ],
    substantiveCommitRef: '1cbfe6e (feat: dual-theme engine & real-time market telemetry ticker)',
    prOrBranchUrl: 'https://github.com/muhmdathalla/dev/tree/main/src',
    impactMetrics: '100% Type Coverage · 0 Layoff Reflow · Fully Accessible'
  },
  {
    id: 'repo-nativecopy',
    title: 'Cross-Device Developer Bridge & Code Injection Engine',
    repository: 'muhmdathalla/nativecopy',
    repositoryUrl: 'https://github.com/muhmdathalla/nativecopy',
    role: 'Creator & Maintainer',
    techStack: ['TypeScript', 'VS Code Extension API', 'Server-Sent Events (SSE)', 'MediaPipe AI', 'Python'],
    architecturalHighlights: [
      'Engineered low-latency unidirectional event streaming pipe connecting mobile hardware to IDE',
      'Integrated Google MediaPipe hand landmark tracking for touchless sub-millisecond cursor gestures',
      'Built native VS Code active text editor buffer injection with zero external daemon overhead'
    ],
    substantiveCommitRef: 'v1.2.0 (Core Engine: Real-Time Stream Ingestion & Vector Math Pipeline)',
    prOrBranchUrl: 'https://github.com/muhmdathalla/nativecopy#readme',
    impactMetrics: '<15ms Latency · Real-Time Vector Math · Seamless Cross-Device Sync'
  }
];

export const FrontendShowcase: React.FC = () => {
  const [selectedContributionId, setSelectedContributionId] = useState<string>('repo-dev-portfolio');
  const [activeTab, setActiveTab] = useState<'architecture' | 'source' | 'applicationCopy'>('architecture');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const selectedContribution = useMemo(() => {
    return CONTRIBUTIONS.find(c => c.id === selectedContributionId) ?? CONTRIBUTIONS[0];
  }, [selectedContributionId]);

  const handleCopyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="react-showcase-container">
      <div className="react-showcase-header">
        <div className="react-pill">
          <i className="fab fa-react"></i>
          <span>React 18 &middot; Strict TypeScript Showcase</span>
        </div>
        <div className="showcase-nav-pills" role="tablist">
          {CONTRIBUTIONS.map(contrib => (
            <button
              key={contrib.id}
              role="tab"
              aria-selected={selectedContributionId === contrib.id}
              className={`showcase-selector-btn ${selectedContributionId === contrib.id ? 'active' : ''}`}
              onClick={() => setSelectedContributionId(contrib.id)}
            >
              <i className="fas fa-code-branch"></i>
              <span>{contrib.repository}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="showcase-content-box">
        <div className="showcase-summary-row">
          <div>
            <h3 className="showcase-title">{selectedContribution.title}</h3>
            <p className="showcase-role">
              <strong>Role:</strong> {selectedContribution.role} &middot;{' '}
              <a href={selectedContribution.repositoryUrl} target="_blank" rel="noopener noreferrer" className="showcase-repo-link">
                <i className="fab fa-github"></i> {selectedContribution.repository}
              </a>
            </p>
          </div>
          <div className="showcase-actions">
            <a
              href={selectedContribution.prOrBranchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-sm"
            >
              <i className="fas fa-arrow-up-right-from-square"></i> Inspect Substantive Work
            </a>
          </div>
        </div>

        <div className="showcase-tabs-nav">
          <button
            className={`showcase-tab ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <i className="fas fa-layer-group"></i> Architectural Highlights
          </button>
          <button
            className={`showcase-tab ${activeTab === 'source' ? 'active' : ''}`}
            onClick={() => setActiveTab('source')}
          >
            <i className="fas fa-file-code"></i> TypeScript Types & Contracts
          </button>
          <button
            className={`showcase-tab ${activeTab === 'applicationCopy' ? 'active' : ''}`}
            onClick={() => setActiveTab('applicationCopy')}
          >
            <i className="fas fa-paste"></i> Job Application Link & Text
          </button>
        </div>

        <div className="showcase-tab-body">
          {activeTab === 'architecture' && (
            <div className="tab-pane-architecture">
              <ul className="showcase-bullet-list">
                {selectedContribution.architecturalHighlights.map((highlight, index) => (
                  <li key={index}>
                    <i className="fas fa-check-circle"></i>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="showcase-meta-bar">
                <div className="meta-block">
                  <span className="label">Key Commit / Deliverable:</span>
                  <span className="value code-font">{selectedContribution.substantiveCommitRef}</span>
                </div>
                <div className="meta-block">
                  <span className="label">Performance Metrics:</span>
                  <span className="value">{selectedContribution.impactMetrics}</span>
                </div>
              </div>

              <div className="tech-stack-pills">
                {selectedContribution.techStack.map((tech, idx) => (
                  <span key={idx} className="tech-pill">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="tab-pane-code">
              <pre className="code-block">
                <code>{`// Type contract from src/types/portfolio.ts
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

// Custom Hook Implementation
export function useMarketTelemetry(pollIntervalMs = 60000) {
  const [telemetry, setTelemetry] = useState<MarketTelemetry>(INITIAL);
  const [isLive, setIsLive] = useState<boolean>(true);
  ...
  return { telemetry, refresh: fetchRates, isLive };
}`}</code>
              </pre>
            </div>
          )}

          {activeTab === 'applicationCopy' && (
            <div className="tab-pane-copy">
              <p className="copy-instruction">
                Copy this formatted text directly into your frontend job application:
              </p>
              <div className="copy-box">
                <textarea
                  readOnly
                  rows={4}
                  className="copy-textarea"
                  value={`${selectedContribution.title} (${selectedContribution.repository})
Repository: ${selectedContribution.repositoryUrl}
Substantive Work / Code: ${selectedContribution.prOrBranchUrl}
Key Tech: ${selectedContribution.techStack.join(', ')}
Description: ${selectedContribution.architecturalHighlights[0]}`}
                />
                <button
                  className="btn-copy-application"
                  onClick={() => handleCopyLink(
`${selectedContribution.title} (${selectedContribution.repository})
Repository: ${selectedContribution.repositoryUrl}
Substantive Work / Code: ${selectedContribution.prOrBranchUrl}
Key Tech: ${selectedContribution.techStack.join(', ')}
Description: ${selectedContribution.architecturalHighlights[0]}`
                  )}
                >
                  <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
