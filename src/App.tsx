/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ATELIER_GARMENTS, LOOKBOOK_FRAMES, PRODUCTION_BATCHES } from './data/atelierData';
import { Garment, RequisitionItem } from './types';
import { Navbar } from './components/Navbar';
import { CollectionArchive } from './components/CollectionArchive';
import { LookbookView } from './components/LookbookView';
import { ManifestoBespokeView } from './components/ManifestoBespokeView';
import { ProductionManifestView } from './components/ProductionManifestView';
import { GarmentModal } from './components/GarmentModal';
import { RequisitionDrawer } from './components/RequisitionDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'archive' | 'lookbook' | 'manifesto' | 'production'>('archive');
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>([
    {
      garment: ATELIER_GARMENTS[0],
      selectedSize: 'II (48)',
      quantity: 1,
    },
  ]);

  // Handler for adding to requisition
  const handleAddToRequisition = (garment: Garment, size: string, quantity: number = 1) => {
    setRequisitionItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.garment.sku === garment.sku && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { garment, selectedSize: size, quantity }];
    });
  };

  // Handler for quick requisition from product card
  const handleQuickRequisition = (garment: Garment) => {
    const availableSize = garment.sizes.find((s) => s.stock > 0)?.size || garment.sizes[0]?.size || 'ONE SIZE';
    handleAddToRequisition(garment, availableSize, 1);
    setIsCartOpen(true);
  };

  // Handler for updating quantity
  const handleUpdateQuantity = (sku: string, size: string, delta: number) => {
    setRequisitionItems((prev) =>
      prev
        .map((item) => {
          if (item.garment.sku === sku && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is RequisitionItem => item !== null)
    );
  };

  // Handler for removing an item
  const handleRemoveItem = (sku: string, size: string) => {
    setRequisitionItems((prev) =>
      prev.filter(
        (item) => !(item.garment.sku === sku && item.selectedSize === size)
      )
    );
  };

  // Handler for jumping from lookbook to a garment
  const handleSelectGarmentBySku = (sku: string) => {
    const target = ATELIER_GARMENTS.find((g) => g.sku === sku);
    if (target) {
      setSelectedGarment(target);
    }
  };

  const totalItemCount = requisitionItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e4e4e7] flex flex-col font-space relative grunge-noise">
      {/* Top Header & Navigation */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        cartCount={totalItemCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Dynamic Screen Views */}
      <main className="flex-1 w-full">
        {activeScreen === 'archive' && (
          <CollectionArchive
            garments={ATELIER_GARMENTS}
            onSelectGarment={setSelectedGarment}
            onQuickRequisition={handleQuickRequisition}
          />
        )}

        {activeScreen === 'lookbook' && (
          <LookbookView
            frames={LOOKBOOK_FRAMES}
            garments={ATELIER_GARMENTS}
            onSelectGarmentBySku={handleSelectGarmentBySku}
          />
        )}

        {activeScreen === 'manifesto' && <ManifestoBespokeView />}

        {activeScreen === 'production' && (
          <ProductionManifestView batches={PRODUCTION_BATCHES} />
        )}
      </main>

      {/* Product Inspection & Specification Modal */}
      <GarmentModal
        garment={selectedGarment}
        onClose={() => setSelectedGarment(null)}
        onAddToRequisition={handleAddToRequisition}
      />

      {/* Requisition Docket Drawer */}
      <RequisitionDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={requisitionItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearRequisition={() => setRequisitionItems([])}
      />

      {/* Persistent Brutalist Footer */}
      <Footer />
    </div>
  );
}
