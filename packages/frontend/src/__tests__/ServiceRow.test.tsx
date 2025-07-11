import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ServiceRow, Service } from '../components/ServiceRow';

const service: Service = {
  _id: '1',
  name: 'Table',
  availableFrom: '2024-01-01',
  availableTo: '2024-01-02',
  rates: { hourly: 5, daily: 50 },
  quantity: 1,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => service });
  (global as any).fetch = fetchMock;
});

afterEach(() => {
  fetchMock.mockReset();
});

test('edits service inline', async () => {
  render(
    <table>
      <tbody>
        <ServiceRow service={service} />
      </tbody>
    </table>,
    { wrapper }
  );
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByDisplayValue('5'), { target: { value: '6', name: 'hourlyRate' } });
  fireEvent.click(screen.getByText('Save'));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
});
