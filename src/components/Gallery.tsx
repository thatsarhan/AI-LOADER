import React from 'react';
import { PRESETS } from '../constants';
import { GridLoader } from './GridLoader';
import { LoaderConfig } from '../types';

interface GalleryProps {
  onSelect: (preset: Partial<LoaderConfig>) => void;
  currentId?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ onSelect, currentId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {PRESETS.map((preset, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(preset)}
          className={`
            relative group p-8 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-6
            ${currentId === preset.name 
              ? 'bg-blue-500/5 border-blue-500/50' 
              : 'bg-zinc-900/50 border-white/5 hover:border-white/20 hover:bg-zinc-900'}
          `}
        >
          <div className="transform group-hover:scale-110 transition-transform duration-300">
            <GridLoader 
              config={{
                id: preset.name || '',
                name: preset.name || '',
                gridSize: 4,
                activeCells: preset.activeCells || [],
                color: preset.color || '#fff',
                speed: preset.speed || 1,
                shape: preset.shape || 'rounded',
                animationStyle: preset.animationStyle || 'opacity',
                backgroundStyle: 'static',
                glow: preset.glow || false,
                blur: 4,
              }} 
            />
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-white">{preset.name}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Preset {idx + 1}</span>
          </div>

          {currentId === preset.name && (
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
        </button>
      ))}
    </div>
  );
};
