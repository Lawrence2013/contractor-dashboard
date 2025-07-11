import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from '../toast';

interface Props {
  onClose: () => void;
}

export const AddServiceModal: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({
    name: '',
    availableFrom: '',
    availableTo: '',
    hourlyRate: '',
    dailyRate: '',
    quantity: '',
  });

  const mutation = useMutation(async () => {
    const res = await fetch('/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        availableFrom: form.availableFrom,
        availableTo: form.availableTo,
        rates: { hourly: Number(form.hourlyRate), daily: Number(form.dailyRate) },
        quantity: Number(form.quantity),
      }),
    });
    if (!res.ok) throw new Error('Failed to add');
    return res.json();
  }, {
    onSuccess: () => {
      toast.success('Service added');
      queryClient.invalidateQueries('services');
      onClose();
    },
    onError: () => toast.error('Failed to add service'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="bg-white p-4 space-y-2">
        <h2 className="text-lg font-bold">Add Service</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-1 w-full" />
        <input name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} className="border p-1 w-full" />
        <input name="availableTo" type="date" value={form.availableTo} onChange={handleChange} className="border p-1 w-full" />
        <input name="hourlyRate" placeholder="Hourly Rate" value={form.hourlyRate} onChange={handleChange} className="border p-1 w-full" />
        <input name="dailyRate" placeholder="Daily Rate" value={form.dailyRate} onChange={handleChange} className="border p-1 w-full" />
        <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border p-1 w-full" />
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-2 py-1 border">Cancel</button>
          <button type="submit" className="px-2 py-1 bg-blue-500 text-white">Save</button>
        </div>
      </form>
    </div>
  );
};

