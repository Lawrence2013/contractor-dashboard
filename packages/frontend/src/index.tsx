import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <div className="p-4">Contractor Dashboard</div>;

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
