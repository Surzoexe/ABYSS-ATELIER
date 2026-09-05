import React, { useState } from 'react';
import { LookbookFrame, Garment } from '../types';
import { playTactileClick } from '../utils/soundEngine';
import { Camera, MapPin, Eye, ArrowRight } from 'lucide-react';

interface LookbookViewProps {
  frames: LookbookFrame[];
  garments: Garment[];
  onSelectGarmentBySku: (sku: string) => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  frames,
  garments,
  onSelectGarmentBySku,
}) => {
  const [selectedFrame, setSelectedFrame] = useState<LookbookFrame>(frames[0]);

  const handleFrameClick = (frame: LookbookFrame) => {
    playTactileClick();
    setSelectedFrame(frame);
  };

  const getGarmentBySku = (sku: string) => {
    return garments.find((g) => g.sku === sku);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
      {/* Contact Sheet Header */}
      <div className="border-b border-[#18181b] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#71717a] uppercase mb-1">
            <span className="text-[#a1a1aa] font-semibold">EDITORIAL DOCUMENTATION</span>
            <span>//</span>
            <span>ILFORD DELTA 3200 // CONTACT PROOF SHEET</span>
          </div>
          <h1 className="font-syne font-extrabold text-3xl md:text-5xl lg:text-6xl text-[#e4e4e7] tracking-tight uppercase">
            CONTACT SHEETS
          </h1>
        </div>

        <div className="p-3 bg-[#09090b] border border-[#27272a] text-xs font-mono text-[#a1a1aa] max-w-md">
          <div className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1">
            LOCATION ARCHIVE:
          </div>
          <div>BERLIN SUB-STATIONS, SOLINGEN FOUNDRY & SHIBUYA DOCKS</div>
        </div>
      </div>

      {/* Main Contact Sheet Grid with Exposed Hairline Dividers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Sheet Frame Grid (Variable Height) */}
        <div className="lg:col-span-7 bg-[#09090b] border border-[#27272a] p-3 md:p-6 specular-top-edge">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#18181b] text-[11px] font-mono text-[#71717a]">
            <span>PROOF SHEET #04 // RECTILINEAR FRAMES</span>
            <span className="text-[#e4e4e7]">KODAK TRI-X / DELTA 3200</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {frames.map((frame, index) => {
              const isSelected = selectedFrame.id === frame.id;
              return (
                <div
                  key={frame.id}
                  onClick={() => handleFrameClick(frame)}
                  className={`group relative flex flex-col bg-[#050505] border cursor-pointer transition-all duration-0 ${
                    isSelected
                      ? 'border-[#e4e4e7] shadow-flash'
                      : 'border-[#27272a] hover:border-[#71717a]'
                  }`}
                >
                  {/* Film Frame Counter Bar */}
                  <div className="flex items-center justify-between px-2 py-1 bg-[#0c0c0e] border-b border-[#18181b] text-[9px] font-mono text-[#71717a]">
                    <span className={isSelected ? 'text-white font-bold' : ''}>
                      {frame.frameNumber}
                    </span>
                    <span className="text-[8px] text-[#52525b]">36mm</span>
                  </div>

                  {/* Image with Red Chinagraph Corner Indicator */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#121215]">
                    <img
                      src={frame.image}
                      alt={frame.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-150"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = 'true';
                          const filename = frame.image.split('/').pop();
                          if (filename) target.src = `/images/${filename}`;
                        }
                      }}
                    />

                    {/* Red chinagraph proof mark for vintage darkroom contact sheet vibe */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-[#7f1d1d] border border-[#fca5a5] text-[#fca5a5] text-[8px] font-mono font-bold px-1 uppercase tracking-tighter">
                        SELECTED
                      </div>
                    )}
                  </div>

                  {/* Micro caption */}
                  <div className="p-2 text-[10px] font-mono text-[#a1a1aa] truncate border-t border-[#18181b]">
                    {frame.title.replace('ACT ', '')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Look Inspector & Linked Garment Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="bg-[#09090b] border border-[#27272a] p-5 md:p-6 specular-top-edge">
            {/* Frame metadata */}
            <div className="flex items-center justify-between text-xs font-mono text-[#71717a] pb-3 border-b border-[#18181b]">
              <span className="text-[#e4e4e7] font-semibold">{selectedFrame.frameNumber}</span>
              <div className="flex items-center gap-1.5">
                <Camera size={12} />
                <span>{selectedFrame.iso} // {selectedFrame.shutter}</span>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="font-syne font-bold text-xl md:text-2xl text-[#e4e4e7] uppercase">
                {selectedFrame.title}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#71717a]">
                <MapPin size={12} className="text-[#a1a1aa]" />
                <span>{selectedFrame.coordinates}</span>
              </div>

              <p className="mt-4 text-sm font-space text-[#c5c6ca] leading-relaxed">
                {selectedFrame.caption}
              </p>

              <div className="mt-4 p-3 bg-[#0c0c0e] border border-[#18181b] text-xs font-mono text-[#71717a]">
                <span className="text-[#a1a1aa] block mb-1">DARKROOM APERTURE NOTES:</span>
                {selectedFrame.notes}
              </div>
            </div>

            {/* Linked Garments Requisition Bridge */}
            <div className="mt-6 pt-4 border-t border-[#18181b]">
              <div className="text-[11px] font-mono uppercase text-[#a1a1aa] tracking-wider mb-3">
                GARMENTS FEATURED IN FRAME:
              </div>

              <div className="space-y-2">
                {selectedFrame.linkedGarmentSkus.map((sku) => {
                  const garment = getGarmentBySku(sku);
                  if (!garment) return null;
                  return (
                    <div
                      key={sku}
                      onClick={() => {
                        playTactileClick();
                        onSelectGarmentBySku(sku);
                      }}
                      className="p-3 bg-[#050505] border border-[#27272a] hover:border-[#e4e4e7] flex items-center justify-between cursor-pointer group transition-colors duration-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={garment.images[0]}
                          alt={garment.title}
                          className="w-10 h-12 object-cover border border-[#18181b]"
                        />
                        <div>
                          <div className="text-[10px] font-mono text-[#71717a]">{garment.sku}</div>
                          <div className="font-syne font-bold text-xs md:text-sm text-white group-hover:text-[#e4e4e7]">
                            {garment.title}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-space text-xs text-[#ffffff]">
                          ${garment.price.toLocaleString()}
                        </span>
                        <ArrowRight size={14} className="text-[#71717a] group-hover:text-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
