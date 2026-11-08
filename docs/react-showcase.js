/**
 * Compiled React 18 & TypeScript Component Bundle
 * Source: src/components/FrontendShowcase.tsx & src/types/portfolio.ts
 * Author: Muhammad Athalla Bagaskara
 */

(function () {
  'use strict';

  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    return;
  }

  const { useState, useMemo, createElement: h } = React;

  const CONTRIBUTIONS = [
    {
      id: 'repo-dev-portfolio',
      title: 'Modern Frontend Architecture & Dual-Theme System',
      repository: 'muhmdathalla/dev',
      repositoryUrl: 'https://github.com/muhmdathalla/dev',
      role: 'Architect & Lead Maintainer',
      techStack: ['React 18', 'TypeScript (Strict)', 'Modern CSS Custom Properties', 'WCAG 2.1 AA', 'REST & SSE Telemetry'],
      architecturalHighlights: [
        'Modular typed architecture with strict TypeScript contracts (src/types/portfolio.ts) and zero any-types',
        'Custom React hooks pipeline (useMarketTelemetry) for resilient real-time polling with network fallbacks',
        'Engineered Dual-Theme engine (Dark/Light) with instant state synchronization and zero layout shift',
        'Interactive developer terminal emulator and real-time client-side project filtering matrix'
      ],
      substantiveCommitRef: '1cbfe6e (feat: dual-theme engine & real-time market telemetry ticker)',
      prOrBranchUrl: 'https://github.com/muhmdathalla/dev/tree/main/src',
      impactMetrics: '100% Type Safety · 0 Layout Shift · Sub-50ms Interaction Latency'
    },
    {
      id: 'repo-nativecopy',
      title: 'Cross-Device Developer Bridge & Code Injection Engine',
      repository: 'muhmdathalla/nativecopy',
      repositoryUrl: 'https://github.com/muhmdathalla/nativecopy',
      role: 'Creator & Maintainer',
      techStack: ['TypeScript', 'VS Code Extension API', 'Server-Sent Events (SSE)', 'MediaPipe AI', 'Python'],
      architecturalHighlights: [
        'Engineered low-latency unidirectional event streaming pipe connecting mobile devices directly to VS Code',
        'Integrated Google MediaPipe hand landmark tracking for touchless sub-millisecond cursor gestures',
        'Built native VS Code active text editor buffer injection with zero external daemon overhead'
      ],
      substantiveCommitRef: 'v1.2.0 (Core Engine: Real-Time Stream Ingestion & Vector Math Pipeline)',
      prOrBranchUrl: 'https://github.com/muhmdathalla/nativecopy#readme',
      impactMetrics: '<15ms Latency · Real-Time Vector Math · Seamless Cross-Device Sync'
    }
  ];

  function FrontendShowcase() {
    const [selectedId, setSelectedId] = useState('repo-dev-portfolio');
    const [activeTab, setActiveTab] = useState('architecture');
    const [copySuccess, setCopySuccess] = useState(false);

    const selected = useMemo(() => {
      return CONTRIBUTIONS.find(c => c.id === selectedId) || CONTRIBUTIONS[0];
    }, [selectedId]);

    const formattedApplicationText = useMemo(() => {
      return `Project/Contribution: ${selected.title}
Repository: ${selected.repositoryUrl}
Source Code / Substantive Work: ${selected.prOrBranchUrl}
Key Tech: ${selected.techStack.join(', ')}
Role: ${selected.role}
Summary: ${selected.architecturalHighlights[0]}; ${selected.architecturalHighlights[1]}.
Key Commit: ${selected.substantiveCommitRef}`;
    }, [selected]);

    const handleCopy = () => {
      navigator.clipboard.writeText(formattedApplicationText).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(() => {});
    };

    return h('div', { className: 'react-showcase-container' },
      h('div', { className: 'react-showcase-header' },
        h('div', { className: 'react-pill' },
          h('i', { className: 'fab fa-react' }),
          h('span', null, 'React 18 · Strict TypeScript Frontend Architecture')
        ),
        h('div', { className: 'showcase-nav-pills', role: 'tablist' },
          CONTRIBUTIONS.map(c =>
            h('button', {
              key: c.id,
              role: 'tab',
              'aria-selected': selectedId === c.id,
              className: `showcase-selector-btn ${selectedId === c.id ? 'active' : ''}`,
              onClick: () => setSelectedId(c.id)
            },
              h('i', { className: 'fas fa-code-branch' }),
              h('span', null, c.repository)
            )
          )
        )
      ),

      h('div', { className: 'showcase-content-box' },
        h('div', { className: 'showcase-summary-row' },
          h('div', null,
            h('h3', { className: 'showcase-title' }, selected.title),
            h('p', { className: 'showcase-role' },
              h('strong', null, 'Role: '),
              selected.role,
              ' · ',
              h('a', {
                href: selected.repositoryUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'showcase-repo-link'
              },
                h('i', { className: 'fab fa-github' }),
                ' ',
                selected.repository
              )
            )
          ),
          h('div', { className: 'showcase-actions' },
            h('a', {
              href: selected.prOrBranchUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'btn-primary-sm'
            },
              h('i', { className: 'fas fa-arrow-up-right-from-square' }),
              ' Inspect Substantive Work'
            )
          )
        ),

        h('div', { className: 'showcase-tabs-nav' },
          h('button', {
            className: `showcase-tab ${activeTab === 'architecture' ? 'active' : ''}`,
            onClick: () => setActiveTab('architecture')
          },
            h('i', { className: 'fas fa-layer-group' }),
            ' Architectural Highlights'
          ),
          h('button', {
            className: `showcase-tab ${activeTab === 'source' ? 'active' : ''}`,
            onClick: () => setActiveTab('source')
          },
            h('i', { className: 'fas fa-file-code' }),
            ' TypeScript Types & Source Contracts'
          ),
          h('button', {
            className: `showcase-tab ${activeTab === 'applicationCopy' ? 'active' : ''}`,
            onClick: () => setActiveTab('applicationCopy')
          },
            h('i', { className: 'fas fa-paste' }),
            ' Job Application Format (1-Click Copy)'
          )
        ),

        h('div', { className: 'showcase-tab-body' },
          activeTab === 'architecture' && h('div', { className: 'tab-pane-architecture' },
            h('ul', { className: 'showcase-bullet-list' },
              selected.architecturalHighlights.map((hl, i) =>
                h('li', { key: i },
                  h('i', { className: 'fas fa-check-circle' }),
                  h('span', null, hl)
                )
              )
            ),
            h('div', { className: 'showcase-meta-bar' },
              h('div', { className: 'meta-block' },
                h('span', { className: 'label' }, 'Key Commit / Deliverable:'),
                h('span', { className: 'value code-font' }, selected.substantiveCommitRef)
              ),
              h('div', { className: 'meta-block' },
                h('span', { className: 'label' }, 'Performance Metrics:'),
                h('span', { className: 'value' }, selected.impactMetrics)
              )
            ),
            h('div', { className: 'tech-stack-pills' },
              selected.techStack.map((tech, idx) =>
                h('span', { key: idx, className: 'tech-pill' }, tech)
              )
            )
          ),

          activeTab === 'source' && h('div', { className: 'tab-pane-code' },
            h('pre', { className: 'code-block' },
              h('code', null, `// Strict TypeScript Contract: src/types/portfolio.ts
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

// React 18 Custom Hook Contract: src/hooks/useMarketTelemetry.ts
export function useMarketTelemetry(pollIntervalMs = 60000): {
  telemetry: MarketTelemetry;
  refresh: () => Promise<void>;
  isLive: boolean;
} {
  const [telemetry, setTelemetry] = useState<MarketTelemetry>(INITIAL);
  ...
  return { telemetry, refresh, isLive };
}`)
            )
          ),

          activeTab === 'applicationCopy' && h('div', { className: 'tab-pane-copy' },
            h('p', { className: 'copy-instruction' },
              'Ready to paste into your frontend job application form (covers repository links, commits, tech stack, and substantive work):'
            ),
            h('div', { className: 'copy-box' },
              h('textarea', {
                readOnly: true,
                rows: 6,
                className: 'copy-textarea',
                value: formattedApplicationText
              }),
              h('button', {
                className: 'btn-copy-application',
                onClick: handleCopy
              },
                h('i', { className: `fas ${copySuccess ? 'fa-check' : 'fa-copy'}` }),
                h('span', null, copySuccess ? 'Copied to Clipboard!' : 'Copy Formatted Text')
              )
            )
          )
        )
      )
    );
  }

  function mount() {
    const el = document.getElementById('react-frontend-showcase');
    if (!el) return;
    const root = ReactDOM.createRoot(el);
    root.render(h(FrontendShowcase));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
