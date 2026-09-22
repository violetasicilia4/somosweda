import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

// Intercept and suppress external browser extension errors (e.g. MetaMask, wallet extensions)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (
      reason.includes('MetaMask') ||
      reason.includes('ethereum') ||
      reason.includes('wallet') ||
      reason.includes('chrome-extension') ||
      reason.includes('moz-extension')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn('Suppressed third-party browser extension error:', reason);
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    const filename = event.filename || '';
    if (
      msg.includes('MetaMask') ||
      msg.includes('ethereum') ||
      filename.includes('extension') ||
      filename.includes('chrome-extension')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn('Suppressed third-party browser extension error:', msg);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

