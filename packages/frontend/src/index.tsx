import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from './toast';
import { ServicesPage } from './components/ServicesPage';
import * as Sentry from '@sentry/react';

Sentry.init({ dsn: (import.meta as any).env.VITE_SENTRY_DSN || '' });

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <ServicesPage />
    </ToastProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById('root') as HTMLElement).render(
  <Sentry.ErrorBoundary fallback={<p>An unexpected error occurred</p>}>
    <App />
  </Sentry.ErrorBoundary>
);
