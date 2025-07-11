import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ServicesTable } from './ServicesTable';
import { Service } from './ServiceRow';
import { AddServiceModal } from './AddServiceModal';

export const ServicesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const { data } = useQuery(['services'], async () => {
    const res = await fetch('/services');
    if (!res.ok) throw new Error('error');
    return res.json() as Promise<Service[]>;
  });

  const filtered = (data || []).filter((s) => s.name.toLowerCase().includes(filter.toLowerCase()));
  const pageSize = 5;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Services</h1>
        <button onClick={() => setShowAdd(true)} className="bg-blue-500 text-white px-2 py-1">Add Service</button>
      </div>
      <input placeholder="Filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-1" />
      <ServicesTable services={paged} />
      <div className="flex gap-2 mt-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>{page} / {pageCount || 1}</span>
        <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</button>
      </div>
      {showAdd && <AddServiceModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};

