import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ShoppingBag, SkipForward, Instagram, ArrowUpRight } from 'lucide-react';
import {
  playTactileClick,
  toggleAmbientSoundscape,
  nextAudioTrack,
  getCurrentTrack,
  MusicTrack,
} from '../utils/soundEngine';

interface NavbarProps {
  activeScreen?: 'archive' | 'lookbook' | 'manifesto' | 'production';
  setActiveScreen?: (screen: 'archive' | 'lookbook' | 'manifesto' | 'production') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  setActiveScreen,
  cartCount,
  onOpenCart,
}) => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(getCurrentTrack());
  const [isCountBumped, setIsCountBumped] = useState<boolean>(false);
  const [bumpKey, setBumpKey] = useState<number>(0);
  const prevCountRef = useRef<number>(cartCount);

  // Trigger visual feedback scale-up animation whenever an item is added to the requisition list
  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setIsCountBumped(true);
      setBumpKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        setIsCountBumped(false);
      }, 450);
      prevCountRef.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (screen: 'archive' | 'lookbook' | 'manifesto' | 'production') => {
    playTactileClick();
    if (setActiveScreen) {
      setActiveScreen(screen);
    }
  };

  const handleSoundToggle = () => {
    playTactileClick();
    const result = toggleAmbientSoundscape();
    setSoundActive(result.isPlaying);
    setCurrentTrack(result.track);
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = nextAudioTrack();
    setSoundActive(result.isPlaying);
    setCurrentTrack(result.track);
  };

  const handleCartClick = () => {
    playTactileClick();
    onOpenCart();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505] border-b border-[#18181b] specular-top-edge">
      {/* Upper Monospaced Technical Ticker */}
      <div className="w-full bg-[#09090b] border-b border-[#18181b] px-4 md:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono tracking-widest text-[#71717a]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#e4e4e7]">
            <span className="inline-block w-1.5 h-1.5 bg-[#e4e4e7] animate-pulse"></span>
            @ABYSS.ATELIER_ // STREETWEAR & DROP-SHOULDER ARCHIVE
          </span>
          <a
            href="https://www.instagram.com/abyss.atelier_/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[#e4e4e7] hover:text-white bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider transition-colors duration-0"
          >
            INBOX @ABYSS.ATELIER_ (ONLY 800 BDT DROPS)
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#a1a1aa] mr-2">{timestamp}</span>
          <button
            id="audio-soundscape-toggle"
            onClick={handleSoundToggle}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 border text-[10px] tracking-wider transition-colors duration-0 ${
              soundActive
                ? 'bg-[#e4e4e7] text-[#09090b] border-[#e4e4e7] font-semibold'
                : 'bg-[#09090b] text-[#71717a] border-[#27272a] hover:border-[#e4e4e7] hover:text-[#e4e4e7]'
            }`}
            title="Toggle music track playback"
          >
            {soundActive ? <Volume2 size={11} className="animate-pulse" /> : <VolumeX size={11} />}
            <span>{soundActive ? `TRACK: ${currentTrack.title} [${currentTrack.bpm} BPM]` : 'SOUNDTRACK: MUTED'}</span>
          </button>

          <button
            id="audio-change-track-btn"
            onClick={handleNextTrack}
            className="flex items-center gap-1.5 px-2 py-0.5 border border-[#27272a] bg-[#09090b] text-[#a1a1aa] hover:border-[#e4e4e7] hover:text-white text-[10px] tracking-wider transition-colors duration-0"
            title="Change track / গান পরিবর্তন করো"
          >
            <SkipForward size={10} />
            <span>CHANGE TRACK</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo / Title */}
        <div 
          onClick={() => handleNavClick('archive')}
          className="cursor-pointer group flex flex-col select-none"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-syne font-extrabold text-lg md:text-xl tracking-tighter text-[#e4e4e7] group-hover:text-white transition-colors duration-0">
              ABYSS ATELIER
            </span>
            <span className="text-[10px] font-mono text-[#a1a1aa] tracking-widest uppercase">
              // DHAKA
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#71717a] tracking-widest uppercase">
            DROP-SHOULDER & HEAVYWEIGHT CUT-AND-SEW
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            id="open-instagram-page"
            href="https://www.instagram.com/abyss.atelier_/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              playTactileClick();
              try {
                window.open('https://www.instagram.com/abyss.atelier_/', '_blank');
              } catch {
                // native anchor fallback
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121215] border border-[#3f3f46] text-xs font-mono tracking-wider text-[#e4e4e7] hover:border-white hover:text-white hover:bg-[#18181b] transition-colors duration-0 cursor-pointer"
            title="Open Instagram @abyss.atelier_ page"
          >
            <Instagram size={14} className="text-[#e4e4e7]" />
            <span className="font-semibold text-white">@ABYSS.ATELIER_</span>
            <ArrowUpRight size={12} className="text-[#a1a1aa]" />
          </a>

          <button
            id="open-requisition-drawer"
            onClick={handleCartClick}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#121215] border border-[#3f3f46] text-xs font-mono tracking-wider text-white hover:border-white hover:bg-[#1a1a1f] transition-colors duration-0 active:translate-x-0.5 active:translate-y-0.5 shadow-xs cursor-pointer"
            title="Open Shopping Cart"
          >
            <ShoppingBag size={14} className="text-[#e4e4e7]" />
            <span className="font-bold text-white tracking-widest">CART</span>
            <span
              key={bumpKey}
              id="cart-count-badge"
              className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold border transition-colors duration-150 origin-center ${
                isCountBumped
                  ? 'animate-cart-bump bg-white text-[#09090b] border-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                  : 'bg-[#18181b] text-white border-[#3f3f46]'
              }`}
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
