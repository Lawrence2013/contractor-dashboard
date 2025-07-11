import React, { createContext, useContext, useState } from 'react';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastContext = createContext({
  success: (msg: string) => {},
  error: (msg: string) => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const add = (type: 'success' | 'error', message: string) => {
    const toast = { id: Date.now(), type, message };
    setToasts((t) => [...t, toast]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toast.id)), 3000);
  };

  return (
    <ToastContext.Provider value={{ success: (m) => add('success', m), error: (m) => add('error', m) }}>
      {children}
      <div className="fixed top-0 right-0 p-4 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-3 py-2 text-white ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

