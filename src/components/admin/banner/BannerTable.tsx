import React from 'react';
import { Button } from '@/components/ui/button';

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
}

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

export default function BannerTable({ banners, onEdit, onDelete, onReorder }: BannerTableProps) {
  return (
    <table className="w-full text-left border">
      <thead>
        <tr className="bg-solar-primary text-white">
          <th className="p-2">Order</th>
          <th className="p-2">Title</th>
          <th className="p-2">Description</th>
          <th className="p-2">Image</th>
          <th className="p-2">Active</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {banners.map((banner, idx) => (
          <tr key={banner.id} className="border-b">
            <td className="p-2">
              <button onClick={() => onReorder(idx, idx - 1)} disabled={idx === 0}>↑</button>
              <button onClick={() => onReorder(idx, idx + 1)} disabled={idx === banners.length - 1}>↓</button>
            </td>
            <td className="p-2">{banner.title}</td>
            <td className="p-2">{banner.description}</td>
            <td className="p-2"><img src={banner.image_url} alt={banner.title} className="w-24 h-12 object-cover rounded" /></td>
            <td className="p-2">{banner.is_active ? 'Yes' : 'No'}</td>
            <td className="p-2">
              <Button onClick={() => onEdit(banner)} className="mr-2">Edit</Button>
              <Button onClick={() => onDelete(banner.id)} variant="destructive">Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 