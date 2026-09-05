import React from 'react';
import { Garment } from '../types';
import { playTactileClick } from '../utils/soundEngine';
import { Layers, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  garment: Garment;
  onSelect: (garment: Garment) => void;
  onQuickRequisition: (garment: Garment) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  garment,
  onSelect,
  onQuickRequisition,
}) => {
  const handleInspect = () => {
    playTactileClick();
    onSelect(garment);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick();
    onQuickRequisition(garment);
  };

  const isSoldOut = garment.status === 'SOLD_OUT';
  const isArchive = garment.status === 'ARCHIVE_ONLY';
  const isBespoke = garment.status === 'BESPOKE';

  return (
    <div
      id={`garment-card-${garment.id}`}
      onClick={handleInspect}
      className="group relative flex flex-col bg-[#09090b] border border-[#27272a] hover:border-[#e4e4e7] transition-all duration-75 cursor-pointer specular-top-edge"
    >
      {/* Top Spec Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#18181b] bg-[#0c0c0e] text-[10px] font-mono tracking-widest text-[#71717a]">
        <div className="flex items-center gap-2">
          <span className="text-[#a1a1aa] font-medium">{garment.sku}</span>
          <span className="text-[#3f3f46]">|</span>
          <span className="truncate max-w-[140px]">{garment.category}</span>
        </div>

        <div>
          {isSoldOut ? (
            <span className="bg-[#e4e4e7] text-[#09090b] px-1.5 py-0.5 font-bold uppercase tracking-wider">
              SOLD OUT
            </span>
          ) : isArchive ? (
            <span className="bg-[#e4e4e7] text-[#09090b] px-1.5 py-0.5 font-bold uppercase tracking-wider">
              ARCHIVE ONLY
            </span>
          ) : isBespoke ? (
            <span className="bg-[#27272a] text-[#e4e4e7] border border-[#71717a] px-1.5 py-0.5 font-medium uppercase tracking-wider">
              BESPOKE
            </span>
          ) : (
            <span className="text-[#a1a1aa]">{garment.dropCode.split('//')[0].trim()}</span>
          )}
        </div>
      </div>

      {/* Image Container with Full Natural Color & 1.02x zoom on hover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#121215] border-b border-[#18181b]">
        <img
          src={garment.images[0]}
          alt={garment.title}
          className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-all duration-200 ease-out"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              const filename = garment.images[0].split('/').pop();
              if (filename) target.src = `/images/${filename}`;
            }
          }}
        />

        {/* Tactical Corner Cut Spec Overlay */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <span className="bg-[#09090b]/90 border border-[#3f3f46] text-[#e4e4e7] text-[9px] font-mono px-1.5 py-0.5 tracking-widest uppercase backdrop-blur-xs">
            {garment.specs.weightGsm} GSM // {garment.category}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          <span className="flex items-center gap-1 bg-[#09090b]/95 border border-[#e4e4e7] text-[#ffffff] text-[9px] font-mono px-2 py-0.5 tracking-widest uppercase">
            <span>INSPECT</span>
            <ArrowUpRight size={10} />
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-syne font-bold text-base md:text-lg text-[#e4e4e7] group-hover:text-white transition-colors duration-0 leading-snug">
              {garment.title}
            </h3>
            <div className="text-right whitespace-nowrap ml-2">
              <span className="font-space font-bold text-base text-[#ffffff]">
                ৳{garment.price.toLocaleString()}
              </span>
              <span className="block text-[9px] font-mono text-[#71717a] uppercase tracking-wider">
                BDT
              </span>
            </div>
          </div>

          <p className="mt-1.5 text-xs text-[#a1a1aa] font-space line-clamp-2 leading-relaxed">
            {garment.description}
          </p>
        </div>

        {/* Technical Specification Summary Tags */}
        <div className="pt-2 border-t border-[#18181b] flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase text-[#71717a] tracking-wider px-1.5 py-0.5 bg-[#121214] border border-[#27272a]">
            {garment.specs.origin.split('/')[0].trim()}
          </span>
          <span className="text-[9px] font-mono uppercase text-[#71717a] tracking-wider px-1.5 py-0.5 bg-[#121214] border border-[#27272a]">
            {garment.specs.stitchDensity.split('//')[0].trim()}
          </span>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleInspect();
            }}
            className="w-full py-2 bg-[#09090b] border border-[#27272a] text-[#a1a1aa] hover:border-[#e4e4e7] hover:text-[#ffffff] text-[11px] font-mono tracking-widest uppercase transition-colors duration-0 flex items-center justify-center gap-1.5"
          >
            <Layers size={12} />
            <span>SPECS</span>
          </button>

          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleQuickAdd}
            className={`w-full py-2 text-[11px] font-syne font-bold tracking-wider uppercase transition-colors duration-0 ${
              isSoldOut
                ? 'bg-[#18181b] text-[#71717a] border border-[#27272a] cursor-not-allowed'
                : 'bg-[#e4e4e7] text-[#09090b] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-[#e4e4e7]'
            }`}
          >
            {isSoldOut ? 'ARCHIVED' : isBespoke ? 'BESPOKE' : 'REQUISITION'}
          </button>
        </div>
      </div>
    </div>
  );
};
