import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ServicesPage } from '../components/ServicesPage';

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      { _id: '1', name: 'Table', availableFrom: '2024-01-01', availableTo: '2024-01-02', rates: { hourly: 5, daily: 50 }, quantity: 1 },
    ],
  });
  (global as any).fetch = fetchMock;
});

afterEach(() => {
  fetchMock.mockReset();
});

test('renders services and opens add modal', async () => {
  render(<ServicesPage />, { wrapper: createWrapper() });
  expect(await screen.findByText('Table')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Add Service'));
  expect(screen.getAllByText('Add Service').length).toBeGreaterThan(1);
});
