import React from 'react';
import { createRoot } from 'react-dom/client';
import { FrontendShowcase } from './components/FrontendShowcase';

export function mountFrontendShowcase(containerId = 'react-frontend-showcase'): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <FrontendShowcase />
    </React.StrictMode>
  );
}

// Auto-mount if container exists
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    mountFrontendShowcase();
  });
}
