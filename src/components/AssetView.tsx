'use client';

import React from 'react';
import { Package } from 'lucide-react';
import { AssetRecord } from '@/types/hrms';

interface AssetProps {
  assets: AssetRecord[];
}

export const AssetView: React.FC<AssetProps> = ({ assets }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-900" /> Asset Management
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Track laptops, biometric terminals, hardware allocation & serial numbers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((a) => (
          <div key={a.id} className="bg-white p-5 border border-slate-300 shadow-sm space-y-3">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-950 text-[10px] font-mono font-bold uppercase border border-blue-200">
                  {a.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{a.assetName}</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                {a.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between font-mono text-slate-600">
                <span>Serial Number:</span>
                <span className="text-slate-900 font-bold">{a.serialNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Allocated To:</span>
                <span className="text-blue-900 font-bold">{a.assignedTo}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Allocation Date:</span>
                <span className="font-semibold text-slate-800">{a.allocatedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
