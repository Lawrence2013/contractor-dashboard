import React from 'react';
import { ServiceRow, Service } from './ServiceRow';

interface Props {
  services: Service[];
}

export const ServicesTable: React.FC<Props> = ({ services }) => (
  <table className="min-w-full border">
    <thead>
      <tr className="bg-gray-100">
        <th>Name</th>
        <th>From</th>
        <th>To</th>
        <th>Hourly</th>
        <th>Daily</th>
        <th>Qty</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {services.map((s) => (
        <ServiceRow key={s._id} service={s} />
      ))}
    </tbody>
  </table>
);

