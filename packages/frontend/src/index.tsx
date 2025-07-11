import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from './toast';
import { ServicesPage } from './components/ServicesPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <ServicesPage />
    </ToastProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
