import React, { useState } from 'react';
import { playTactileClick } from '../utils/soundEngine';
import { BespokeCommission } from '../types';
import { Terminal, Shield, Check, Copy, Sparkles, FileText } from 'lucide-react';

export const ManifestoBespokeView: React.FC = () => {
  const [formData, setFormData] = useState<BespokeCommission>({
    fullName: '',
    email: '',
    measurementProfile: 'CHEST 102cm / WAIST 84cm / HEIGHT 185cm',
    categoryPreference: 'OUTERWEAR',
    fabricChoice: '680GSM Okayama Waxed Selvedge',
    hardwareFinish: 'Cast Solid Zinc Alloy (Acid Pitted)',
    vaultDelivery: true,
    notes: 'Require extended anatomical spine darting and extra interior harness anchors.',
  });

  const [spineDartingChecked, setSpineDartingChecked] = useState(true);
  const [serializedPlateChecked, setSerializedPlateChecked] = useState(true);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fabricOptions = [
    { id: '680GSM Okayama Waxed Selvedge', label: '680GSM JAPANESE WAXED SELVEDGE (OKAYAMA)', gsm: '680' },
    { id: '1.4mm Italian Culatta Horsehide', label: '1.4MM FULL GRAIN CULATTA HORSEHIDE (TUSCANY)', gsm: '1450' },
    { id: '420GSM British Fresco Wool', label: '420GSM HIGH-TWIST FRESCO WOOL (HUDDERSFIELD)', gsm: '420' },
    { id: '520GSM Carbon Ripstop', label: '520GSM CARBON-WASHED COTTON RIPSTOP (VENTILE)', gsm: '520' },
  ];

  const hardwareOptions = [
    { id: 'Cast Solid Zinc Alloy (Acid Pitted)', label: 'CAST SOLID ZINC ALLOY // ACID PITTED' },
    { id: 'Raccagni Titanium Oxidized', label: 'RACCAGNI HEAVY TITANIUM OXIDIZED' },
    { id: '.925 Sterling Silver Sulfur Patina', label: '.925 STERLING SILVER // SULFUR BURNISHED' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    const ticketId = `ATLR-BESPOKE-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
    setSubmittedTicket(ticketId);
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      playTactileClick();
      navigator.clipboard?.writeText(submittedTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-12">
      {/* Manifesto Section */}
      <div className="border-b border-[#18181b] pb-10">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#71717a] uppercase mb-2">
          <span className="text-[#a1a1aa] font-semibold">ATELIER PHILOSOPHY</span>
          <span>//</span>
          <span>DISCIPLINE OVER EXCESS</span>
          <span>//</span>
          <span>SUBTERRANEAN PRODUCTION</span>
        </div>

        <h1 className="font-syne font-extrabold text-3xl md:text-5xl lg:text-6xl text-[#e4e4e7] tracking-tight uppercase max-w-4xl">
          SUBVERSIVE INDUSTRIALISM & ZERO-COMPROMISE CRAFT
        </h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="p-5 bg-[#09090b] border border-[#27272a] specular-top-edge">
            <div className="text-xs font-mono text-[#e4e4e7] font-semibold uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e4e4e7]"></span>
              01 // MONOLITHIC WEIGHT
            </div>
            <p className="text-xs md:text-sm font-space text-[#a1a1aa] leading-relaxed">
              We reject gossamer mass production. Every textile is selected for tactile inertia: 680GSM paraffin twill, pit-tanned culatta hides, and shuttle-loomed selvage capable of weathering urban decay.
            </p>
          </div>

          <div className="p-5 bg-[#09090b] border border-[#27272a] specular-top-edge">
            <div className="text-xs font-mono text-[#e4e4e7] font-semibold uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e4e4e7]"></span>
              02 // METALS & FORGING
            </div>
            <p className="text-xs md:text-sm font-space text-[#a1a1aa] leading-relaxed">
              Hardware is not an afterthought. Solid sand-cast zinc alloy poured in Solingen foundries and sulfurized .925 sterling silver cast from anatomical vertebrae form our structural clasps.
            </p>
          </div>

          <div className="p-5 bg-[#09090b] border border-[#27272a] specular-top-edge">
            <div className="text-xs font-mono text-[#e4e4e7] font-semibold uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e4e4e7]"></span>
              03 // ANATOMICAL PATTERNING
            </div>
            <p className="text-xs md:text-sm font-space text-[#a1a1aa] leading-relaxed">
              Pattern cutting engineered around biomechanical articulation. Curved elbow darts, spiraled knee conduits, and segmented vertebra gussets that move with absolute kinetic freedom.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Bespoke Commissioning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Description */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-[#09090b] border border-[#27272a] specular-top-edge">
            <div className="text-xs font-mono text-[#e4e4e7] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Terminal size={14} />
              <span>BESPOKE REQUISITION DOCKET</span>
            </div>
            <p className="text-xs font-space text-[#a1a1aa] leading-relaxed">
              Commission an individual garment cut precisely to your anatomical dimensions. Built by our head pattern cutters in the Berlin Vault, requiring 4–6 weeks of hand curing and tailoring.
            </p>

            <div className="mt-4 pt-4 border-t border-[#18181b] space-y-2 text-[11px] font-mono text-[#71717a]">
              <div className="flex justify-between">
                <span>LEAD TIME:</span>
                <span className="text-[#e4e4e7]">4-6 WEEKS</span>
              </div>
              <div className="flex justify-between">
                <span>ALLOTMENT:</span>
                <span className="text-[#e4e4e7]">8 PIECES / MONTH</span>
              </div>
              <div className="flex justify-between">
                <span>SERIALIZATION:</span>
                <span className="text-[#e4e4e7]">INDIVIDUAL ZINC INGOT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Bespoke Form */}
        <div className="lg:col-span-8 bg-[#09090b] border border-[#27272a] p-6 md:p-8 specular-top-edge">
          {submittedTicket ? (
            <div className="p-6 bg-[#0c0c0e] border border-[#e4e4e7] space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#e4e4e7] font-bold">
                  <Check size={16} className="text-white" />
                  <span>COMMISSION LOGGED // ATELIER BERLIN</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[#3f3f46] text-xs font-mono text-white hover:border-white"
                >
                  <Copy size={12} />
                  <span>{copied ? 'COPIED' : 'COPY DOCKET'}</span>
                </button>
              </div>

              <div className="font-mono text-sm space-y-2 text-[#a1a1aa]">
                <div>
                  <span className="text-[#71717a]">SERIAL DOCKET:</span>{' '}
                  <span className="text-white font-bold tracking-wider">{submittedTicket}</span>
                </div>
                <div>
                  <span className="text-[#71717a]">CLIENT:</span>{' '}
                  <span className="text-[#e4e4e7]">{formData.fullName}</span> ({formData.email})
                </div>
                <div>
                  <span className="text-[#71717a]">FABRICATION:</span>{' '}
                  <span className="text-[#e4e4e7]">{formData.fabricChoice}</span>
                </div>
                <div>
                  <span className="text-[#71717a]">HARDWARE:</span>{' '}
                  <span className="text-[#e4e4e7]">{formData.hardwareFinish}</span>
                </div>
                <div>
                  <span className="text-[#71717a]">ANATOMICAL SPECS:</span>{' '}
                  <span className="text-[#e4e4e7]">{formData.measurementProfile}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#18181b] text-[11px] font-mono text-[#71717a]">
                An encrypted confirmation manifest has been transmitted. Our pattern cutter will contact you for millimeter coordinate verification.
              </div>

              <button
                type="button"
                onClick={() => setSubmittedTicket(null)}
                className="mt-2 px-4 py-2 bg-[#18181b] border border-[#3f3f46] text-xs font-mono text-white hover:border-white"
              >
                LOG ANOTHER REQUISITION
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-[#18181b] pb-2 flex items-center justify-between text-xs font-mono text-[#71717a]">
                <span className="uppercase text-[#e4e4e7]">1.0 IDENTIFICATION & CONTACT</span>
                <span>SECURE PROTOCOL</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#71717a] mb-1">
                    <label htmlFor="full-name-input">FULL NAME // CITIZEN ID</label>
                    <span>REQUIRED</span>
                  </div>
                  <input
                    type="text"
                    id="full-name-input"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="E.G. ALDRICH VANCE"
                    className="w-full bg-[#050505] border border-[#27272a] focus:border-[#e4e4e7] px-3 py-2.5 text-xs font-mono text-white placeholder-[#52525b] focus:outline-hidden tracking-wider"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#71717a] mb-1">
                    <label htmlFor="email-input">COMMUNICATION VECTOR (EMAIL)</label>
                    <span>ENCRYPTED</span>
                  </div>
                  <input
                    type="email"
                    id="email-input"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="E.G. VANCE@ARCHIVE.VAULT"
                    className="w-full bg-[#050505] border border-[#27272a] focus:border-[#e4e4e7] px-3 py-2.5 text-xs font-mono text-white placeholder-[#52525b] focus:outline-hidden tracking-wider"
                  />
                </div>
              </div>

              {/* Anatomical Dimensions */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-[#71717a] mb-1">
                  <label htmlFor="dimensions-input">ANATOMICAL SPECIFICATIONS / MEASUREMENT PROFILE</label>
                  <span>METRIC (CM)</span>
                </div>
                <input
                  type="text"
                  id="dimensions-input"
                  value={formData.measurementProfile}
                  onChange={(e) => setFormData({ ...formData, measurementProfile: e.target.value })}
                  placeholder="CHEST, WAIST, HEIGHT, INSEAM..."
                  className="w-full bg-[#050505] border border-[#27272a] focus:border-[#e4e4e7] px-3 py-2.5 text-xs font-mono text-white placeholder-[#52525b] focus:outline-hidden tracking-wider"
                />
              </div>

              {/* Diamond-Oriented Square Radio Controls for Fabric Choice */}
              <div className="pt-2">
                <div className="text-xs font-mono text-[#71717a] uppercase mb-3 flex items-center gap-2">
                  <span className="text-[#e4e4e7]">2.0 FABRICATION MEDIUM</span>
                  <span>//</span>
                  <span>SELECT ARCHIVAL YARN</span>
                </div>

                <div className="space-y-2">
                  {fabricOptions.map((opt) => {
                    const isSelected = formData.fabricChoice === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          playTactileClick();
                          setFormData({ ...formData, fabricChoice: opt.id });
                        }}
                        className={`p-3 border flex items-center justify-between cursor-pointer transition-colors duration-0 ${
                          isSelected
                            ? 'bg-[#18181b] border-[#e4e4e7]'
                            : 'bg-[#050505] border-[#27272a] hover:border-[#71717a]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Diamond-oriented square radio button (45deg rotation) */}
                          <div className="w-3.5 h-3.5 border border-[#71717a] rotate-45 flex items-center justify-center shrink-0">
                            {isSelected && (
                              <div className="w-2 h-2 bg-[#e4e4e7]"></div>
                            )}
                          </div>
                          <span className={`text-xs font-mono tracking-wider ${isSelected ? 'text-white font-medium' : 'text-[#a1a1aa]'}`}>
                            {opt.label}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-[#71717a]">
                          {opt.gsm} GSM
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hardware Selection Diamond Radios */}
              <div className="pt-2">
                <div className="text-xs font-mono text-[#71717a] uppercase mb-3 flex items-center gap-2">
                  <span className="text-[#e4e4e7]">3.0 FOUNDRY HARDWARE FINISH</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {hardwareOptions.map((opt) => {
                    const isSelected = formData.hardwareFinish === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          playTactileClick();
                          setFormData({ ...formData, hardwareFinish: opt.id });
                        }}
                        className={`p-3 border flex items-center gap-3 cursor-pointer transition-colors duration-0 ${
                          isSelected
                            ? 'bg-[#18181b] border-[#e4e4e7]'
                            : 'bg-[#050505] border-[#27272a] hover:border-[#71717a]'
                        }`}
                      >
                        <div className="w-3.5 h-3.5 border border-[#71717a] rotate-45 flex items-center justify-center shrink-0">
                          {isSelected && (
                            <div className="w-2 h-2 bg-[#e4e4e7]"></div>
                          )}
                        </div>
                        <span className={`text-[11px] font-mono tracking-wider leading-tight ${isSelected ? 'text-white font-medium' : 'text-[#a1a1aa]'}`}>
                          {opt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 14px x 14px Square Checkboxes with stark black square interior dot */}
              <div className="pt-2 space-y-3">
                <div className="text-xs font-mono text-[#71717a] uppercase mb-2">
                  <span className="text-[#e4e4e7]">4.0 ATELIER HARDWARE & FINISHING TAGS</span>
                </div>

                {/* Checkbox 1 */}
                <div
                  onClick={() => {
                    playTactileClick();
                    setSpineDartingChecked(!spineDartingChecked);
                  }}
                  className="flex items-start gap-3 cursor-pointer select-none group"
                >
                  <div
                    className={`w-[14px] h-[14px] border mt-0.5 shrink-0 flex items-center justify-center transition-colors duration-0 ${
                      spineDartingChecked
                        ? 'bg-[#e4e4e7] border-[#e4e4e7]'
                        : 'bg-[#050505] border-[#71717a] group-hover:border-[#e4e4e7]'
                    }`}
                  >
                    {spineDartingChecked && <div className="w-1.5 h-1.5 bg-[#09090b]"></div>}
                  </div>
                  <div className="text-xs font-mono text-[#a1a1aa] group-hover:text-white leading-tight">
                    ANATOMIC BIOMECHANICAL SPINE DARTING (INCREASED KINETIC RANGE)
                  </div>
                </div>

                {/* Checkbox 2 */}
                <div
                  onClick={() => {
                    playTactileClick();
                    setSerializedPlateChecked(!serializedPlateChecked);
                  }}
                  className="flex items-start gap-3 cursor-pointer select-none group"
                >
                  <div
                    className={`w-[14px] h-[14px] border mt-0.5 shrink-0 flex items-center justify-center transition-colors duration-0 ${
                      serializedPlateChecked
                        ? 'bg-[#e4e4e7] border-[#e4e4e7]'
                        : 'bg-[#050505] border-[#71717a] group-hover:border-[#e4e4e7]'
                    }`}
                  >
                    {serializedPlateChecked && <div className="w-1.5 h-1.5 bg-[#09090b]"></div>}
                  </div>
                  <div className="text-xs font-mono text-[#a1a1aa] group-hover:text-white leading-tight">
                    SERIALIZED ZINC ARCHIVE INGOT STAMPED WITH COMMISSION NUMBER
                  </div>
                </div>

                {/* Checkbox 3 */}
                <div
                  onClick={() => {
                    playTactileClick();
                    setFormData({ ...formData, vaultDelivery: !formData.vaultDelivery });
                  }}
                  className="flex items-start gap-3 cursor-pointer select-none group"
                >
                  <div
                    className={`w-[14px] h-[14px] border mt-0.5 shrink-0 flex items-center justify-center transition-colors duration-0 ${
                      formData.vaultDelivery
                        ? 'bg-[#e4e4e7] border-[#e4e4e7]'
                        : 'bg-[#050505] border-[#71717a] group-hover:border-[#e4e4e7]'
                    }`}
                  >
                    {formData.vaultDelivery && <div className="w-1.5 h-1.5 bg-[#09090b]"></div>}
                  </div>
                  <div className="text-xs font-mono text-[#a1a1aa] group-hover:text-white leading-tight">
                    SECURE VAULT DISPATCH // SEALED BLACK WATERPROOF CONTAINER
                  </div>
                </div>
              </div>

              {/* Additional notes textarea with monospace counter */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-[#71717a] mb-1">
                  <label htmlFor="bespoke-notes">COMMISSION INSTRUCTIONS & FIT REQUESTS</label>
                  <span>[{formData.notes.length} CHARACTERS]</span>
                </div>
                <textarea
                  id="bespoke-notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="SPECIFY ARTICULATION, POCKET ORIENTATION, OR CUSTOM HARDWARE REQUIREMENTS..."
                  className="w-full bg-[#050505] border border-[#27272a] focus:border-[#e4e4e7] p-3 text-xs font-mono text-white placeholder-[#52525b] focus:outline-hidden tracking-wider"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-4 border-t border-[#18181b]">
                <button
                  type="submit"
                  id="submit-bespoke-commission-btn"
                  className="w-full py-3.5 bg-[#e4e4e7] text-[#09090b] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-[#e4e4e7] font-syne font-bold text-xs md:text-sm tracking-widest uppercase transition-colors duration-0 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>TRANSMIT BESPOKE REQUISITION PROTOCOL</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
