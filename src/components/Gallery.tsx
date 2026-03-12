import React, { useState } from 'react';
import { PRESETS } from '../constants';
import { GridLoader } from './GridLoader';
import { LoaderConfig } from '../types';
import { Copy, Code, Image as ImageIcon, Check } from 'lucide-react';
import { generateCSSCode, generateSVGCode } from '../utils/exportUtils';

interface GalleryProps {
  onSelect: (preset: Partial<LoaderConfig>) => void;
  currentId?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ onSelect, currentId }) => {
  const [copyStatus, setCopyStatus] = useState<{ id: string, type: 'css' | 'svg' } | null>(null);

  const handleCopy = async (e: React.MouseEvent, preset: Partial<LoaderConfig>, type: 'css' | 'svg') => {
    e.stopPropagation();
    const config: LoaderConfig = {
      id: preset.name || '',
      name: preset.name || '',
      gridSize: 4,
      activeCells: preset.activeCells || [],
      color: preset.color || '#fff',
      speed: preset.speed || 1,
      shape: preset.shape || 'rounded',
      animationStyle: preset.animationStyle || 'opacity',
      backgroundStyle: 'static',
      glow: preset.glow || 0,
      blur: 0,
    };

    const code = type === 'css' ? generateCSSCode(config) : generateSVGCode(config);
    
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus({ id: preset.name || '', type });
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {PRESETS.map((preset, idx) => (
        <div key={idx} className="relative group">
          <button
            onClick={() => onSelect(preset)}
            className={`
              w-full p-8 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-6
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
                  glow: preset.glow || 0,
                  blur: 0,
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

          {/* Hover Actions */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={(e) => handleCopy(e, preset, 'css')}
              className="p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-2 text-[10px] font-medium"
              title="Copy CSS"
            >
              {copyStatus?.id === preset.name && copyStatus?.type === 'css' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Code className="w-3 h-3" />
              )}
              {copyStatus?.id === preset.name && copyStatus?.type === 'css' ? 'Copied!' : 'CSS'}
            </button>
            <button
              onClick={(e) => handleCopy(e, preset, 'svg')}
              className="p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-2 text-[10px] font-medium"
              title="Copy SVG"
            >
              {copyStatus?.id === preset.name && copyStatus?.type === 'svg' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <ImageIcon className="w-3 h-3" />
              )}
              {copyStatus?.id === preset.name && copyStatus?.type === 'svg' ? 'Copied!' : 'SVG'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
