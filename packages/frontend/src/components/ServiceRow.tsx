import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from '../toast';

export interface Service {
  _id: string;
  name: string;
  availableFrom: string;
  availableTo: string;
  rates: { hourly: number; daily: number };
  quantity: number;
}

interface Props {
  service: Service;
}

export const ServiceRow: React.FC<Props> = ({ service }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: service.name,
    hourlyRate: service.rates.hourly.toString(),
    dailyRate: service.rates.daily.toString(),
    quantity: service.quantity.toString(),
  });
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(async () => {
    const res = await fetch(`/services/${service._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        rates: { hourly: Number(form.hourlyRate), daily: Number(form.dailyRate) },
        quantity: Number(form.quantity),
      }),
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  }, {
    onSuccess: () => {
      toast.success('Service updated');
      queryClient.invalidateQueries('services');
      setEdit(false);
    },
    onError: () => toast.error('Update failed'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <tr>
      <td>{service.name}</td>
      <td>{new Date(service.availableFrom).toLocaleDateString()}</td>
      <td>{new Date(service.availableTo).toLocaleDateString()}</td>
      <td>
        {edit ? (
          <input name="hourlyRate" value={form.hourlyRate} onChange={handleChange} className="border p-1" />
        ) : (
          service.rates.hourly
        )}
      </td>
      <td>
        {edit ? (
          <input name="dailyRate" value={form.dailyRate} onChange={handleChange} className="border p-1" />
        ) : (
          service.rates.daily
        )}
      </td>
      <td>
        {edit ? (
          <input name="quantity" value={form.quantity} onChange={handleChange} className="border p-1" />
        ) : (
          service.quantity
        )}
      </td>
      <td>
        {edit ? (
          <>
            <button onClick={() => mutation.mutate()} className="mr-2 text-blue-500">Save</button>
            <button onClick={() => setEdit(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEdit(true)} className="text-blue-500">Edit</button>
        )}
      </td>
    </tr>
  );
};

