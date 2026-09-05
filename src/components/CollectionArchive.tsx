import React, { useState, useMemo } from 'react';
import { Garment, GarmentCategory } from '../types';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/soundEngine';
import { Search, SlidersHorizontal, Grid, Table as TableIcon, ArrowUpDown } from 'lucide-react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'weight';

interface CollectionArchiveProps {
  garments: Garment[];
  onSelectGarment: (garment: Garment) => void;
  onQuickRequisition: (garment: Garment) => void;
}

export const CollectionArchive: React.FC<CollectionArchiveProps> = ({
  garments,
  onSelectGarment,
  onQuickRequisition,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const categories: GarmentCategory[] = [
    'ALL',
    'DROP SHOULDER',
    'GRAPHIC TEES',
    'HOODIES & SWEATS',
    'ACID WASH',
  ];

  const seasons = [
    { id: 'ALL', label: 'ALL DROPS' },
    { id: 'KEEP FAITH', label: 'DROP 01 // KEEP FAITH' },
    { id: 'ACID & DRIFT', label: 'DROP 02 // ACID & DRIFT' },
    { id: 'WINTER CORE', label: 'SERIES 01 // WINTER CORE' },
  ];

  const filteredGarments = useMemo(() => {
    return garments
      .filter((item) => {
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }
        if (selectedSeason !== 'ALL' && !item.season.includes(selectedSeason)) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesSku = item.sku.toLowerCase().includes(q);
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesSpecs = item.specs.fabrication.toLowerCase().includes(q) || item.specs.hardware.toLowerCase().includes(q);
          const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesSku && !matchesTitle && !matchesSpecs && !matchesTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'weight') return b.specs.weightGsm - a.specs.weightGsm;
        return 0;
      });
  }, [garments, selectedCategory, selectedSeason, searchQuery, sortBy]);

  const handleCategoryChange = (cat: GarmentCategory) => {
    playTactileClick();
    setSelectedCategory(cat);
  };

  const handleSeasonChange = (season: string) => {
    playTactileClick();
    setSelectedSeason(season);
  };

  const handleViewModeToggle = (mode: 'grid' | 'table') => {
    playTactileClick();
    setViewMode(mode);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8 bg-[#000000]">
      {/* Editorial Monumental Header */}
      <div className="border-b border-[#18181b] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#71717a] uppercase mb-1">
              <span className="text-[#a1a1aa] font-semibold">@ABYSS.ATELIER_ CATALOG</span>
              <span>//</span>
              <span>DROPS ARCHIVED: {filteredGarments.length}</span>
              <span>//</span>
              <span className="text-[#e4e4e7] font-semibold bg-[#18181b] border border-[#27272a] px-1.5 py-0.5 tracking-wider">
                240–450 GSM HEAVYWEIGHT COTTON
              </span>
            </div>
            <h1 className="font-syne font-extrabold text-3xl md:text-5xl lg:text-6xl text-[#e4e4e7] tracking-tight uppercase">
              STREETWEAR DROPS
            </h1>
          </div>

          <p className="max-w-md text-xs md:text-sm font-space text-[#a1a1aa] leading-relaxed">
            Authentic drop-shoulder streetwear graphic tees and heavyweight fleece hoodies from @abyss.atelier_. Crafted with 240–450 GSM combed cotton, distressed cyber-sigilism prints, and vintage acid stone washes. Orders via Instagram DM @abyss.atelier_ or quick requisition.
          </p>
        </div>
      </div>

      {/* Control Matrix: Search & Filters */}
      <div className="bg-[#09090b] border border-[#27272a] divide-y divide-[#18181b] specular-top-edge">
        {/* Upper Search Bar with Monospace Counter */}
        <div className="p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md flex items-center bg-[#050505] border border-[#27272a] focus-within:border-[#e4e4e7] transition-colors duration-0">
            <Search size={14} className="ml-3 text-[#71717a]" />
            <input
              type="text"
              id="search-garments-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH TEE, DROP SHOULDER, HOODIE, OR GRAPHIC..."
              className="w-full bg-transparent px-3 py-2 text-xs font-mono text-[#e4e4e7] placeholder-[#52525b] focus:outline-hidden tracking-wider uppercase"
            />
            {searchQuery && (
              <span className="mr-3 text-[10px] font-mono text-[#71717a]">
                [{searchQuery.length} CH]
              </span>
            )}
          </div>

          {/* View Mode & Sort Controls */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown size={12} className="text-[#a1a1aa]" />
                <span>SORT:</span>
              </span>
              <select
                id="sort-garments-select"
                value={sortBy}
                onChange={(e) => {
                  playTactileClick();
                  setSortBy(e.target.value as SortOption);
                }}
                className="bg-[#0c0c0e] border border-[#3f3f46] text-[#e4e4e7] font-semibold px-2.5 py-1.5 text-xs font-mono tracking-wider focus:border-white focus:outline-hidden hover:border-[#71717a] cursor-pointer transition-colors duration-0"
              >
                <option value="default" className="bg-[#0c0c0e] text-white">DEFAULT // LATEST DROPS</option>
                <option value="price-asc" className="bg-[#0c0c0e] text-white">PRICE: LOW TO HIGH (৳ BDT)</option>
                <option value="price-desc" className="bg-[#0c0c0e] text-white">PRICE: HIGH TO LOW (৳ BDT)</option>
                <option value="weight" className="bg-[#0c0c0e] text-white">FABRIC WEIGHT (HEAVIEST GSM)</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex border border-[#27272a]">
              <button
                type="button"
                id="view-grid-btn"
                onClick={() => handleViewModeToggle('grid')}
                className={`p-1.5 text-xs font-mono transition-colors duration-0 ${
                  viewMode === 'grid'
                    ? 'bg-[#18181b] text-white border-r border-[#3f3f46]'
                    : 'bg-[#09090b] text-[#71717a] hover:text-white border-r border-[#27272a]'
                }`}
                title="12-Column Grid View"
              >
                <Grid size={14} />
              </button>
              <button
                type="button"
                id="view-table-btn"
                onClick={() => handleViewModeToggle('table')}
                className={`p-1.5 text-xs font-mono transition-colors duration-0 ${
                  viewMode === 'table'
                    ? 'bg-[#18181b] text-white'
                    : 'bg-[#09090b] text-[#71717a] hover:text-white'
                }`}
                title="Atelier Technical Table View"
              >
                <TableIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Season Navigation Chips */}
        <div className="px-3 md:px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar bg-[#0c0c0e]">
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest whitespace-nowrap mr-2">
            COLLECTION:
          </span>
          {seasons.map((season) => {
            const isSelected = selectedSeason === season.id;
            return (
              <button
                key={season.id}
                type="button"
                onClick={() => handleSeasonChange(season.id)}
                className={`px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase border whitespace-nowrap transition-colors duration-0 ${
                  isSelected
                    ? 'bg-[#e4e4e7] text-[#09090b] border-[#e4e4e7] font-semibold'
                    : 'bg-[#09090b] text-[#a1a1aa] border-[#27272a] hover:border-[#71717a] hover:text-white'
                }`}
              >
                {season.label}
              </button>
            );
          })}
        </div>

        {/* Category Filter Badges */}
        <div className="px-3 md:px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest whitespace-nowrap mr-2">
            CATEGORY:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border whitespace-nowrap transition-colors duration-0 ${
                  isSelected
                    ? 'bg-[#18181b] text-white border-[#e4e4e7] shadow-flash-subtle font-medium'
                    : 'bg-[#09090b] text-[#71717a] border-[#27272a] hover:border-[#71717a] hover:text-[#a1a1aa]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Grid vs Atelier Table */}
      {filteredGarments.length === 0 ? (
        <div className="p-12 text-center border border-[#27272a] bg-[#09090b]">
          <div className="text-sm font-mono text-[#71717a] uppercase tracking-widest">
            NO SPECIFICATIONS MATCH QUERY: "{searchQuery}"
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedSeason('ALL');
            }}
            className="mt-4 px-4 py-2 bg-[#18181b] border border-[#3f3f46] text-xs font-mono text-white hover:border-[#e4e4e7]"
          >
            RESET QUERY MATRIX
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredGarments.map((garment) => (
            <ProductCard
              key={garment.id}
              garment={garment}
              onSelect={onSelectGarment}
              onQuickRequisition={onQuickRequisition}
            />
          ))}
        </div>
      ) : (
        /* Atelier Table View: Split via 1px horizontal dividers. Hovering shifts to #121214 and expands sizing coordinates */
        <div className="border border-[#27272a] bg-[#09090b] overflow-x-auto specular-top-edge">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#18181b] bg-[#0c0c0e] text-[#71717a] text-[10px] tracking-widest uppercase">
                <th className="p-3">SKU // IDENTIFIER</th>
                <th className="p-3">PIECE TITLE</th>
                <th className="p-3 hidden md:table-cell">FABRICATION & GSM</th>
                <th className="p-3 hidden lg:table-cell">ORIGIN</th>
                <th 
                  className="p-3 cursor-pointer select-none hover:text-white group"
                  onClick={() => {
                    playTactileClick();
                    setSortBy((prev) => (prev === 'price-asc' ? 'price-desc' : 'price-asc'));
                  }}
                  title="Click to sort by price"
                >
                  <div className="flex items-center gap-1.5">
                    <span>PRICE</span>
                    <ArrowUpDown size={11} className={sortBy.startsWith('price') ? 'text-white' : 'text-[#52525b] group-hover:text-[#a1a1aa]'} />
                  </div>
                </th>
                <th className="p-3 text-right">SIZING COORDINATES & ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181b]">
              {filteredGarments.map((garment) => (
                <tr
                  key={garment.id}
                  onClick={() => {
                    playTactileClick();
                    onSelectGarment(garment);
                  }}
                  className="group hover:bg-[#121214] transition-colors duration-0 cursor-pointer"
                >
                  <td className="p-3 font-semibold text-[#e4e4e7] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#71717a] group-hover:bg-[#e4e4e7]"></span>
                      <span>{garment.sku}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[#ffffff] font-syne font-medium text-sm">
                    {garment.title}
                  </td>
                  <td className="p-3 text-[#a1a1aa] hidden md:table-cell max-w-xs truncate">
                    {garment.specs.fabrication}
                  </td>
                  <td className="p-3 text-[#71717a] hidden lg:table-cell whitespace-nowrap">
                    {garment.specs.origin.split('/')[0]}
                  </td>
                  <td className="p-3 text-white font-space font-semibold whitespace-nowrap">
                    ৳{garment.price.toLocaleString()} BDT
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Technical sizing coordinates that expand on hover */}
                      <div className="hidden sm:flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-0 text-[10px] text-[#71717a]">
                        <span>[</span>
                        {garment.sizes.map((s, idx) => (
                          <span
                            key={s.size}
                            className={s.stock > 0 ? 'text-[#a1a1aa]' : 'text-[#3f3f46] line-through'}
                          >
                            {s.size.split(' ')[0]}
                            {idx < garment.sizes.length - 1 ? ',' : ''}
                          </span>
                        ))}
                        <span>]</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTactileClick();
                          onSelectGarment(garment);
                        }}
                        className="px-2 py-1 bg-[#18181b] border border-[#27272a] text-[#a1a1aa] group-hover:border-[#e4e4e7] group-hover:text-white text-[10px] tracking-wider uppercase whitespace-nowrap"
                      >
                        INSPECT
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
