import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useToast } from '../toast';

export interface LineItem {
  _id: string;
  service: { _id: string; name: string };
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Order {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
  lineItems: LineItem[];
}

interface DetailProps {
  order: Order;
  onClose: () => void;
}

const OrderDetail: React.FC<DetailProps> = ({ order, onClose }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);

  const acceptMutation = useMutation(async () => {
    const res = await fetch(`/orders/${order._id}/accept`, { method: 'PATCH' });
    if (!res.ok) throw new Error('failed');
    return res.json();
  }, {
    onSuccess: () => {
      toast.success('Order accepted');
      queryClient.invalidateQueries('orders');
      onClose();
    },
    onError: () => toast.error('Failed to accept order'),
  });

  const rejectMutation = useMutation(async () => {
    const body = selected.length ? { lineItemIds: selected } : {};
    const res = await fetch(`/orders/${order._id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('failed');
    return res.json();
  }, {
    onSuccess: () => {
      toast.success('Order updated');
      queryClient.invalidateQueries('orders');
      onClose();
    },
    onError: () => toast.error('Failed to reject order'),
  });

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" data-testid="order-detail">
      <div className="bg-white p-4 space-y-2">
        <h2 className="text-lg font-bold">Order {order._id}</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th></th>
              <th>Item</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {order.lineItems.map((li) => (
              <tr key={li._id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`select-${li._id}`}
                    checked={selected.includes(li._id)}
                    onChange={() => toggle(li._id)}
                  />
                </td>
                <td>{li.service.name}</td>
                <td>{li.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-2 py-1 border">Close</button>
          <button onClick={() => acceptMutation.mutate()} className="px-2 py-1 bg-green-500 text-white">Accept</button>
          <button onClick={() => rejectMutation.mutate()} className="px-2 py-1 bg-red-500 text-white">Reject</button>
        </div>
      </div>
    </div>
  );
};

export const OrdersPage: React.FC = () => {
  const { data } = useQuery<Order[]>(['orders'], async () => {
    const res = await fetch('/orders?status=pending');
    if (!res.ok) throw new Error('error');
    return res.json();
  }, { refetchInterval: 5000 });

  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold">Orders</h1>
      <table className="min-w-full border" data-testid="orders-table">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Status</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((o) => (
            <tr key={o._id} onClick={() => setSelected(o)} className="cursor-pointer hover:bg-gray-50">
              <td>{o._id}</td>
              <td>{o.status}</td>
              <td>{o.lineItems.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

