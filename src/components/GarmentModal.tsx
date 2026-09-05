import React, { useState } from 'react';
import { Garment } from '../types';
import { playTactileClick } from '../utils/soundEngine';
import { X, Check, ShieldCheck, Ruler, Scissors, Cpu, ArrowUpRight } from 'lucide-react';

interface GarmentModalProps {
  garment: Garment | null;
  onClose: () => void;
  onAddToRequisition: (garment: Garment, size: string, quantity: number) => void;
}

export const GarmentModal: React.FC<GarmentModalProps> = ({
  garment,
  onClose,
  onAddToRequisition,
}) => {
  if (!garment) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    garment.sizes.find((s) => s.stock > 0)?.size || garment.sizes[0]?.size || 'ONE SIZE'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const currentSizeObj = garment.sizes.find((s) => s.size === selectedSize);
  const isAvailable = currentSizeObj ? currentSizeObj.stock > 0 : garment.status === 'AVAILABLE';

  const handleSizeSelect = (size: string) => {
    playTactileClick();
    setSelectedSize(size);
  };

  const handleAdd = () => {
    playTactileClick();
    onAddToRequisition(garment, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleModalClose = () => {
    playTactileClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#09090b] border border-[#3f3f46] shadow-flash my-auto specular-top-edge"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Diagnostic Title Bar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#0c0c0e] border-b border-[#27272a] text-xs font-mono tracking-widest text-[#71717a]">
          <div className="flex items-center gap-3">
            <span className="text-[#e4e4e7] font-semibold">{garment.sku}</span>
            <span>//</span>
            <span className="text-[#a1a1aa]">{garment.season}</span>
            <span className="hidden sm:inline text-[#3f3f46]">|</span>
            <span className="hidden sm:inline text-[#71717a]">{garment.patternCutterCode}</span>
          </div>

          <button
            id="close-garment-modal"
            onClick={handleModalClose}
            className="p-1 hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#ffffff] border border-transparent hover:border-[#71717a] transition-colors duration-0"
            aria-label="Close specification modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Viewer */}
          <div className="lg:col-span-6 p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-[#18181b] flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full bg-[#121215] border border-[#27272a] overflow-hidden">
              <img
                src={garment.images[activeImageIndex] || garment.images[0]}
                alt={garment.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    const activeImg = garment.images[activeImageIndex] || garment.images[0];
                    const filename = activeImg.split('/').pop();
                    if (filename) target.src = `/images/${filename}`;
                  }
                }}
              />
              <div className="absolute bottom-2 left-2 bg-[#09090b]/90 border border-[#3f3f46] px-2 py-1 text-[10px] font-mono text-[#a1a1aa]">
                SPEC VIEW // {activeImageIndex + 1} OF {garment.images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            {garment.images.length > 1 && (
              <div className="flex gap-2">
                {garment.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playTactileClick();
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-16 h-20 border overflow-hidden transition-colors duration-0 ${
                      activeImageIndex === idx
                        ? 'border-[#e4e4e7] ring-1 ring-[#e4e4e7]'
                        : 'border-[#27272a] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Atelier Authenticity Note */}
            <div className="p-3 bg-[#0c0c0e] border border-[#18181b] text-[11px] font-mono text-[#71717a] flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[#a1a1aa] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#e4e4e7] block font-medium">AUTHENTIC @ABYSS.ATELIER_ DROP</span>
                Crafted with premium high-density combed cotton. For immediate inquiries or custom orders, direct message on Instagram{' '}
                <a
                  href="https://www.instagram.com/abyss.atelier_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:text-[#a1a1aa]"
                >
                  @abyss.atelier_
                </a>.
              </div>
            </div>
          </div>

          {/* Right Column: Garment Specs & Ordering */}
          <div className="lg:col-span-6 p-4 md:p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-[#e4e4e7] tracking-tight">
                  {garment.title}
                </h2>
                <div className="text-xl md:text-2xl font-space font-bold text-white whitespace-nowrap">
                  ৳{garment.price.toLocaleString()} <span className="text-xs font-mono text-[#71717a]">BDT</span>
                </div>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs font-mono text-[#71717a]">
                <span className="text-[#a1a1aa]">{garment.dropCode}</span>
                <span>//</span>
                <span>STATUS: {garment.status}</span>
              </div>

              <p className="mt-4 text-sm font-space text-[#c5c6ca] leading-relaxed">
                {garment.description}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="mt-6 border border-[#27272a] bg-[#0c0c0e]">
                <div className="px-3 py-2 border-b border-[#18181b] text-[11px] font-mono tracking-wider text-[#a1a1aa] uppercase flex items-center gap-2">
                  <Cpu size={13} className="text-[#e4e4e7]" />
                  <span>MATERIAL & CONSTRUCTION MATRIX</span>
                </div>
                <div className="divide-y divide-[#18181b] text-xs font-mono">
                  <div className="p-2.5 flex justify-between gap-4">
                    <span className="text-[#71717a]">FABRICATION</span>
                    <span className="text-[#e4e4e7] text-right font-medium">{garment.specs.fabrication}</span>
                  </div>
                  <div className="p-2.5 flex justify-between gap-4">
                    <span className="text-[#71717a]">FABRIC WEIGHT</span>
                    <span className="text-[#e4e4e7] text-right font-medium">{garment.specs.weightGsm} GSM Heavyweight</span>
                  </div>
                  <div className="p-2.5 flex justify-between gap-4">
                    <span className="text-[#71717a]">COLLAR & TRIMS</span>
                    <span className="text-[#e4e4e7] text-right font-medium">{garment.specs.hardware}</span>
                  </div>
                  <div className="p-2.5 flex justify-between gap-4">
                    <span className="text-[#71717a]">PRINT DENSITY</span>
                    <span className="text-[#e4e4e7] text-right font-medium">{garment.specs.stitchDensity}</span>
                  </div>
                  <div className="p-2.5 flex justify-between gap-4">
                    <span className="text-[#71717a]">DYE & WASH TREATMENT</span>
                    <span className="text-[#e4e4e7] text-right font-medium">{garment.specs.treatment}</span>
                  </div>
                  <div className="p-2.5 flex justify-between gap-4">
                    <span className="text-[#71717a]">STUDIO / ORIGIN</span>
                    <span className="text-[#e4e4e7] text-right font-medium">{garment.specs.origin}</span>
                  </div>
                </div>
              </div>

              {/* Sizing & Measurement Table */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono text-[#a1a1aa] mb-2">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Ruler size={13} />
                    <span>SELECT SIZE / SPEC DIMENSIONS</span>
                  </span>
                  <span className="text-[10px] text-[#71717a]">MEASUREMENTS IN CM</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {garment.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    const inStock = s.stock > 0;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={!inStock}
                        onClick={() => handleSizeSelect(s.size)}
                        className={`p-2.5 border text-left flex flex-col justify-between transition-colors duration-0 ${
                          isSelected
                            ? 'bg-[#18181b] border-[#e4e4e7] shadow-flash-subtle'
                            : inStock
                            ? 'bg-[#09090b] border-[#27272a] hover:border-[#71717a]'
                            : 'bg-[#050505] border-[#18181b] opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-[#e4e4e7]'}`}>
                            {s.size}
                          </span>
                          <span className="text-[9px] font-mono text-[#71717a]">
                            {inStock ? `QTY: ${s.stock}` : '0'}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] font-mono text-[#71717a] space-y-0.5">
                          <div>P2P: {s.pitToPit}</div>
                          <div>LEN: {s.backLength}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Requisition Bar */}
            <div className="pt-4 border-t border-[#18181b] flex flex-col gap-3">
              {addedToast && (
                <div className="p-2.5 bg-[#18181b] border border-[#e4e4e7] text-white text-xs font-mono flex items-center gap-2">
                  <Check size={14} className="text-[#e4e4e7]" />
                  <span>ITEM ADDED TO REQUISITION DOCKET // [{selectedSize}]</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Quantity input */}
                <div className="flex items-center border border-[#27272a] bg-[#050505]">
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setQuantity((q) => Math.max(1, q - 1));
                    }}
                    className="px-3 py-2 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] font-mono text-sm border-r border-[#27272a]"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-mono text-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setQuantity((q) => Math.min(currentSizeObj?.stock || 5, q + 1));
                    }}
                    className="px-3 py-2 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] font-mono text-sm border-l border-[#27272a]"
                  >
                    +
                  </button>
                </div>

                {/* Primary Button */}
                <button
                  type="button"
                  id="modal-add-to-requisition"
                  disabled={!isAvailable}
                  onClick={handleAdd}
                  className={`flex-1 py-3 text-xs md:text-sm font-syne font-bold tracking-widest uppercase transition-colors duration-0 border ${
                    isAvailable
                      ? 'bg-[#e4e4e7] text-[#09090b] border-[#e4e4e7] hover:bg-[#09090b] hover:text-[#e4e4e7] hover:border-[#e4e4e7]'
                      : 'bg-[#18181b] text-[#71717a] border-[#27272a] cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? 'ADD TO REQUISITION' : 'OUT OF STOCK // ARCHIVE'}
                </button>

                <a
                  href="https://www.instagram.com/abyss.atelier_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-[#09090b] border border-[#3f3f46] text-[#e4e4e7] hover:border-white hover:text-white text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors duration-0"
                >
                  <span>INBOX @ABYSS.ATELIER_</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
