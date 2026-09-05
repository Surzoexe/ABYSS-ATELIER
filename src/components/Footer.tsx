import React, { useState } from 'react';
import { playTactileClick } from '../utils/soundEngine';

export const Footer: React.FC = () => {
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    if (dispatchEmail) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setDispatchEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-[#18181b] mt-20 text-xs font-mono text-[#71717a] specular-top-edge">
      {/* Top Dispatch Notification Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 border-b border-[#18181b] flex items-center justify-center">
        <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative">
            <input
              type="email"
              required
              id="footer-email-input"
              value={dispatchEmail}
              onChange={(e) => setDispatchEmail(e.target.value)}
              placeholder="YOUR.NODE@DOMAIN.NET"
              className="w-full sm:w-72 bg-[#09090b] border border-[#27272a] focus:border-[#e4e4e7] px-3 py-2 text-xs font-mono text-white placeholder-[#52525b] focus:outline-hidden tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#e4e4e7] text-[#09090b] border border-[#e4e4e7] hover:bg-[#09090b] hover:text-[#e4e4e7] font-syne font-bold text-xs uppercase tracking-widest transition-colors duration-0"
          >
            {isSubscribed ? 'LOGGED' : 'SUBSCRIBE'}
          </button>
        </form>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#52525b]">
          <div>
            © {new Date().getFullYear()} @ABYSS.ATELIER_. ALL RIGHTS RESERVED. DHAKA CUT & SEW STREETWEAR ARCHIVE.
          </div>
          <div className="flex items-center gap-4 text-[#71717a]">
            <a
              href="https://www.instagram.com/abyss.atelier_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a1a1aa] hover:text-white underline font-mono"
            >
              INSTAGRAM: @ABYSS.ATELIER_
            </a>
            <span>//</span>
            <span>ONLY 800 BDT DROPS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
