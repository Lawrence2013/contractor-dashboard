import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { OrdersPage } from '../components/OrdersPage';

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn();
  (global as any).fetch = fetchMock;
});

afterEach(() => {
  fetchMock.mockReset();
});

test('opens order detail and accepts order', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: '1',
        status: 'pending',
        lineItems: [
          { _id: 'li1', service: { _id: 's1', name: 'A' }, quantity: 1, status: 'pending' },
        ],
      },
    ],
  });

  render(<OrdersPage />, { wrapper: createWrapper() });
  expect(await screen.findByText('pending')).toBeInTheDocument();

  fireEvent.click(screen.getAllByText('1')[0]);
  expect(screen.getByTestId('order-detail')).toBeInTheDocument();

  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] });
  fireEvent.click(screen.getByText('Accept'));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/orders/1/accept', expect.anything()));
});

test('partial reject sends line item ids', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        _id: '1',
        status: 'pending',
        lineItems: [
          { _id: 'li1', service: { _id: 's1', name: 'A' }, quantity: 1, status: 'pending' },
          { _id: 'li2', service: { _id: 's2', name: 'B' }, quantity: 2, status: 'pending' },
        ],
      },
    ],
  });

  render(<OrdersPage />, { wrapper: createWrapper() });
  expect(await screen.findByText('pending')).toBeInTheDocument();
  fireEvent.click(screen.getAllByText('1')[0]);

  const checkbox = screen.getByLabelText('select-li1');
  fireEvent.click(checkbox);

  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] });
  fireEvent.click(screen.getByText('Reject'));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
    '/orders/1/reject',
    expect.objectContaining({
      method: 'PATCH',
      body: JSON.stringify({ lineItemIds: ['li1'] }),
    })
  ));
});

