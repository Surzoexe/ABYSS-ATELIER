import React, { useState } from 'react';
import { ProductionBatch } from '../types';
import { playTactileClick } from '../utils/soundEngine';
import { Cpu, Activity, CheckCircle2, Clock, Hammer, ShieldAlert } from 'lucide-react';

interface ProductionManifestViewProps {
  batches: ProductionBatch[];
}

export const ProductionManifestView: React.FC<ProductionManifestViewProps> = ({ batches }) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  const filteredBatches = selectedStage === 'ALL'
    ? batches
    : batches.filter((b) => b.stage === selectedStage);

  const stages = ['ALL', 'VAULT_INSPECTED', 'STITCHING', 'OXIDATION', 'CURING'];

  const getStageBadge = (stage: ProductionBatch['stage']) => {
    switch (stage) {
      case 'VAULT_INSPECTED':
        return (
          <span className="bg-[#e4e4e7] text-[#09090b] px-2 py-0.5 font-bold tracking-wider text-[9px] uppercase">
            VAULT VERIFIED
          </span>
        );
      case 'OXIDATION':
        return (
          <span className="bg-[#7f1d1d] text-[#fca5a5] border border-[#fca5a5] px-2 py-0.5 font-bold tracking-wider text-[9px] uppercase">
            OXIDATION BATH
          </span>
        );
      case 'STITCHING':
        return (
          <span className="bg-[#18181b] text-white border border-[#3f3f46] px-2 py-0.5 tracking-wider text-[9px] uppercase">
            KEVLAR STITCHING
          </span>
        );
      case 'CURING':
        return (
          <span className="bg-[#121214] text-[#a1a1aa] border border-[#27272a] px-2 py-0.5 tracking-wider text-[9px] uppercase">
            PARAFFIN CURING
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#18181b] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#71717a] uppercase mb-1">
            <span className="text-[#a1a1aa] font-semibold">PRODUCTION LEDGER</span>
            <span>//</span>
            <span>ACTIVE ATELIER BATCH RUNS & METALLURGY</span>
          </div>
          <h1 className="font-syne font-extrabold text-3xl md:text-5xl lg:text-6xl text-[#e4e4e7] tracking-tight uppercase">
            FABRICATION RUNS
          </h1>
        </div>

        <div className="p-3 bg-[#09090b] border border-[#27272a] text-xs font-mono text-[#a1a1aa] max-w-md">
          <div className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1">
            FACILITIES ACTIVE:
          </div>
          <div className="text-[#e4e4e7]">BERLIN VAULT #01, KOJIMA LOOMS, SOLINGEN FOUNDRY</div>
        </div>
      </div>

      {/* Stage Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest whitespace-nowrap mr-2">
          STAGE FILTER:
        </span>
        {stages.map((st) => {
          const isSelected = selectedStage === st;
          return (
            <button
              key={st}
              onClick={() => {
                playTactileClick();
                setSelectedStage(st);
              }}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border whitespace-nowrap transition-colors duration-0 ${
                isSelected
                  ? 'bg-[#e4e4e7] text-[#09090b] border-[#e4e4e7] font-semibold'
                  : 'bg-[#09090b] text-[#71717a] border-[#27272a] hover:border-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          );
        })}
      </div>

      {/* Production Runs Atelier Table with 1px dividers & hover highlight */}
      <div className="border border-[#27272a] bg-[#09090b] overflow-x-auto specular-top-edge">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#18181b] bg-[#0c0c0e] text-[#71717a] text-[10px] tracking-widest uppercase">
              <th className="p-3.5">BATCH ID // SKU</th>
              <th className="p-3.5">GARMENT & FABRIC ORIGIN</th>
              <th className="p-3.5 hidden md:table-cell">LOOM & APPARATUS</th>
              <th className="p-3.5">UNITS</th>
              <th className="p-3.5">STAGE STATUS</th>
              <th className="p-3.5 text-right">COMPLETION BAR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#18181b]">
            {filteredBatches.map((batch) => (
              <tr
                key={batch.batchId}
                className="group hover:bg-[#121214] transition-colors duration-0 cursor-default"
              >
                <td className="p-3.5 whitespace-nowrap">
                  <div className="font-bold text-[#e4e4e7] group-hover:text-white">
                    {batch.batchId}
                  </div>
                  <div className="text-[10px] text-[#71717a]">{batch.sku}</div>
                </td>

                <td className="p-3.5">
                  <div className="font-syne font-semibold text-sm text-white">
                    {batch.title}
                  </div>
                  <div className="text-[10px] text-[#a1a1aa]">{batch.millOrigin}</div>
                </td>

                <td className="p-3.5 text-[#a1a1aa] hidden md:table-cell">
                  <div>{batch.loomType}</div>
                  <div className="text-[10px] text-[#71717a]">{batch.artisanRef}</div>
                </td>

                <td className="p-3.5 font-space text-sm text-white font-medium whitespace-nowrap">
                  {batch.unitsProduced} PCS
                </td>

                <td className="p-3.5 whitespace-nowrap">
                  {getStageBadge(batch.stage)}
                </td>

                <td className="p-3.5 text-right whitespace-nowrap">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-mono text-white font-bold">
                      {batch.completionRate}%
                    </span>
                    {/* Brutalist segmented progress bar */}
                    <div className="w-24 h-2 bg-[#050505] border border-[#27272a] flex">
                      <div
                        className="bg-[#e4e4e7] h-full"
                        style={{ width: `${batch.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Production Note */}
      <div className="p-4 bg-[#09090b] border border-[#27272a] text-xs font-mono text-[#71717a] flex items-center justify-between">
        <div>ALL TEXTILES ARE RESTED 72 HOURS POST-TREATMENT PRIOR TO DISPATCH.</div>
        <div className="text-[#a1a1aa]">QA PROTOCOL // ISO-9001 COMPLIANT</div>
      </div>
    </div>
  );
};
