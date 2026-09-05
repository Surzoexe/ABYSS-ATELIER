import React, { useState } from 'react';
import { RequisitionItem } from '../types';
import { playTactileClick } from '../utils/soundEngine';
import { X, Trash2, ArrowRight, Check, Printer, Copy, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface RequisitionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RequisitionItem[];
  onUpdateQuantity: (sku: string, size: string, delta: number) => void;
  onRemoveItem: (sku: string, size: string) => void;
  onClearRequisition: () => void;
}

export const RequisitionDrawer: React.FC<RequisitionDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearRequisition,
}) => {
  if (!isOpen) return null;

  const [shippingMethod, setShippingMethod] = useState<'dhaka' | 'nationwide'>('dhaka');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'confirming' | 'receipt'>('cart');
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.garment.price * item.quantity,
    0
  );

  const shippingCost = subtotal >= 2400 ? 0 : shippingMethod === 'dhaka' ? 70 : 130;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    playTactileClick();
    setCheckoutStep('confirming');
    setTimeout(() => {
      const receipt = `ABYSS-DHAKA-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptNumber(receipt);
      setCheckoutStep('receipt');
    }, 1200);
  };

  const handleCopyReceipt = () => {
    playTactileClick();
    navigator.clipboard?.writeText(
      `@ABYSS.ATELIER_ ORDER DOCKET // SERIAL: ${receiptNumber}\nTOTAL: ৳${total.toLocaleString()} BDT\nITEMS: ${items.map(i => `${i.garment.title} [${i.selectedSize}] x${i.quantity}`).join(', ')}\nDELIVERY: ${shippingMethod === 'dhaka' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳130)'}`
    );
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const handleDone = () => {
    playTactileClick();
    onClearRequisition();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl h-full bg-[#09090b] border-l border-[#3f3f46] flex flex-col justify-between specular-top-edge shadow-flash"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0c0c0e] border-b border-[#27272a] text-xs font-mono tracking-widest text-[#71717a]">
          <div className="flex items-center gap-2">
            <span className="text-[#e4e4e7] font-bold">SHOPPING CART</span>
            <span>//</span>
            <span>[{items.reduce((s, i) => s + i.quantity, 0)} UNITS]</span>
          </div>

          <button
            id="close-requisition-drawer"
            type="button"
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1 hover:bg-[#18181b] text-[#a1a1aa] hover:text-white border border-transparent hover:border-[#71717a] transition-colors duration-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {checkoutStep === 'receipt' ? (
            /* Thermal Receipt Docket View */
            <div className="space-y-6">
              <div className="p-6 bg-[#050505] border border-[#e4e4e7] font-mono text-xs space-y-4">
                <div className="text-center border-b border-[#27272a] pb-4 space-y-1">
                  <div className="font-syne font-extrabold text-lg text-white">
                    @ABYSS.ATELIER_
                  </div>
                  <div className="text-[10px] text-[#71717a]">
                    DHAKA STUDIO // CUT & SEW STREETWEAR
                  </div>
                  <div className="text-[10px] text-[#a1a1aa]">
                    ORDER TRANSACTION DOCKET // STAMPED {new Date().toISOString().slice(0, 10)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">DOCKET SERIAL:</span>
                    <span className="text-white font-bold">{receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">ORDER STATUS:</span>
                    <span className="text-[#e4e4e7]">READY TO DISPATCH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">DELIVERY DESTINATION:</span>
                    <span className="text-[#e4e4e7]">
                      {shippingMethod === 'dhaka' ? 'INSIDE DHAKA (EXPRESS)' : 'OUTSIDE DHAKA / NATIONWIDE'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b border-[#18181b] py-3 divide-y divide-[#18181b]">
                  {items.map((item) => (
                    <div key={`${item.garment.sku}-${item.selectedSize}`} className="py-2 flex justify-between">
                      <div>
                        <div className="text-white font-medium">{item.garment.title}</div>
                        <div className="text-[10px] text-[#71717a]">
                          {item.garment.sku} // SIZE: {item.selectedSize} // QTY: {item.quantity}
                        </div>
                      </div>
                      <div className="text-white text-right">
                        ৳{(item.garment.price * item.quantity).toLocaleString()} BDT
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[#71717a]">
                    <span>SUBTOTAL</span>
                    <span>৳{subtotal.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex justify-between text-[#71717a]">
                    <span>DELIVERY CHARGE</span>
                    <span>৳{shippingCost} BDT</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-[#27272a]">
                    <span>TOTAL PAYABLE</span>
                    <span>৳{total.toLocaleString()} BDT</span>
                  </div>
                </div>

                <div className="pt-4 text-center text-[10px] text-[#a1a1aa] border-t border-[#18181b] mt-3">
                  Please message your Docket Serial to Instagram <span className="text-white font-bold">@abyss.atelier_</span> to confirm delivery address & payment.
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="flex-1 py-3 bg-[#18181b] border border-[#3f3f46] text-xs font-mono text-white hover:border-white flex items-center justify-center gap-2"
                >
                  <Copy size={13} />
                  <span>{copiedReceipt ? 'COPIED TO CLIPBOARD' : 'COPY RECEIPT DATA'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDone}
                  className="flex-1 py-3 bg-[#e4e4e7] text-[#09090b] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-white font-syne font-bold text-xs uppercase"
                >
                  CONFIRM & CLOSE
                </button>
              </div>
            </div>
          ) : checkoutStep === 'confirming' ? (
            /* Loading confirmation state */
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 font-mono text-xs">
              <div className="w-8 h-8 border-2 border-[#e4e4e7] border-t-transparent animate-spin"></div>
              <div className="text-[#e4e4e7] tracking-widest uppercase">
                COMMUNICATING WITH ATELIER FOUNDRY...
              </div>
              <div className="text-[10px] text-[#71717a]">
                CHECKING FOUNDRY ALLOCATION & TITANIUM HALLMARK SERIALS
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 font-mono">
              <div className="text-xs text-[#71717a] uppercase tracking-widest">
                REQUISITION DOCKET IS EMPTY
              </div>
              <p className="text-xs text-[#52525b] max-w-xs">
                Inspect the collection archive and requisition pieces to populate your order.
              </p>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-6">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.garment.sku}-${item.selectedSize}`}
                    className="p-3 bg-[#050505] border border-[#27272a] flex items-start gap-4"
                  >
                    <img
                      src={item.garment.images[0]}
                      alt={item.garment.title}
                      className="w-16 h-20 object-cover border border-[#18181b]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-syne font-bold text-sm text-white truncate">
                          {item.garment.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            playTactileClick();
                            onRemoveItem(item.garment.sku, item.selectedSize);
                          }}
                          className="text-[#71717a] hover:text-[#fca5a5] transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-[#71717a] mt-0.5">
                        {item.garment.sku} // EDITION: {item.selectedSize}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity adjust */}
                        <div className="flex items-center border border-[#27272a] bg-[#09090b]">
                          <button
                            type="button"
                            onClick={() => {
                              playTactileClick();
                              onUpdateQuantity(item.garment.sku, item.selectedSize, -1);
                            }}
                            className="px-2 py-0.5 text-xs font-mono text-[#a1a1aa] hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              playTactileClick();
                              onUpdateQuantity(item.garment.sku, item.selectedSize, 1);
                            }}
                            className="px-2 py-0.5 text-xs font-mono text-[#a1a1aa] hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-space font-bold text-sm text-white">
                          ৳{(item.garment.price * item.quantity).toLocaleString()} BDT
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Logistics Selector with Diamond Radio Controls */}
              <div className="pt-4 border-t border-[#18181b] space-y-3">
                <div className="text-xs font-mono text-[#71717a] uppercase tracking-wider">
                  DELIVERY DESTINATION:
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => {
                      playTactileClick();
                      setShippingMethod('dhaka');
                    }}
                    className={`p-3 border flex items-center justify-between cursor-pointer transition-colors duration-0 ${
                      shippingMethod === 'dhaka'
                        ? 'bg-[#18181b] border-[#e4e4e7]'
                        : 'bg-[#050505] border-[#27272a] hover:border-[#71717a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 border border-[#71717a] rotate-45 flex items-center justify-center shrink-0">
                        {shippingMethod === 'dhaka' && (
                          <div className="w-2 h-2 bg-[#e4e4e7]"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-white font-medium">
                          INSIDE DHAKA (EXPRESS COURIER)
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                          Direct doorstep hand-to-hand delivery (1-2 Days)
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-white font-semibold">
                      {subtotal >= 2400 ? 'FREE' : '৳70 BDT'}
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      playTactileClick();
                      setShippingMethod('nationwide');
                    }}
                    className={`p-3 border flex items-center justify-between cursor-pointer transition-colors duration-0 ${
                      shippingMethod === 'nationwide'
                        ? 'bg-[#18181b] border-[#e4e4e7]'
                        : 'bg-[#050505] border-[#27272a] hover:border-[#71717a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 border border-[#71717a] rotate-45 flex items-center justify-center shrink-0">
                        {shippingMethod === 'nationwide' && (
                          <div className="w-2 h-2 bg-[#e4e4e7]"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-white font-medium">
                          OUTSIDE DHAKA / ALL BANGLADESH
                        </div>
                        <div className="text-[10px] font-mono text-[#71717a]">
                          Steadfast / SA Paribahan tracked parcel (2-4 Days)
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-white font-semibold">
                      {subtotal >= 2400 ? 'FREE' : '৳130 BDT'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {checkoutStep === 'cart' && items.length > 0 && (
          <div className="p-6 bg-[#0c0c0e] border-t border-[#18181b] space-y-4">
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#71717a]">
                <span>SUBTOTAL</span>
                <span className="text-[#a1a1aa]">৳{subtotal.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between text-[#71717a]">
                <span>DELIVERY CHARGE</span>
                <span className="text-[#a1a1aa]">৳{shippingCost} BDT</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#27272a]">
                <span>TOTAL ESTIMATE</span>
                <span>৳{total.toLocaleString()} BDT</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                id="confirm-requisition-btn"
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#e4e4e7] text-[#09090b] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-[#e4e4e7] font-syne font-bold text-xs tracking-widest uppercase transition-colors duration-0 flex items-center justify-center gap-2"
              >
                <span>GENERATE ORDER DOCKET</span>
                <ArrowRight size={14} />
              </button>

              <a
                href="https://www.instagram.com/abyss.atelier_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#18181b] border border-[#3f3f46] text-[#e4e4e7] hover:border-white hover:text-white font-mono text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors duration-0"
              >
                <span>DIRECT INBOX @ABYSS.ATELIER_</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
