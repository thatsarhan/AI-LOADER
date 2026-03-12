import React, { useState } from 'react';
import { LoaderConfig, CellShape, AnimationStyle } from '../types';
import { Settings, Play, Square, Circle, Box, Zap, Sun, Wind, Trash2, Copy, Download, RotateCcw, Grid3X3, Dot, Sparkles, LayoutGrid, X } from 'lucide-react';
import { CodeModal } from './CodeModal';
import { motion, AnimatePresence } from 'motion/react';

interface EditorProps {
  config: LoaderConfig;
  onChange: (config: LoaderConfig) => void;
  onReset: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Editor: React.FC<EditorProps> = ({ config, onChange, onReset, isOpen, onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', code: '' });

  const updateConfig = (updates: Partial<LoaderConfig>) => {
    onChange({ ...config, ...updates });
  };

  const generateReactCode = () => {
    const code = `import React from 'react';
import { motion } from 'framer-motion';

export const CustomLoader = () => {
  const gridSize = ${config.gridSize};
  const activeCells = [${config.activeCells.join(', ')}];
  const color = "${config.color}";
  const speed = ${config.speed};
  const animationStyle = "${config.animationStyle}";
  const glow = ${config.glow};
  const blur = ${config.blur};
  
  return (
    <div 
      className="grid gap-2" 
      style={{ gridTemplateColumns: \`repeat(\${gridSize}, minmax(0, 1fr))\` }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, i) => {
        const isActive = activeCells.includes(i);
        return (
          <motion.div
            key={i}
            className={\`w-8 h-8 \${isActive ? '' : 'opacity-10'} ${config.shape === 'circle' ? 'rounded-full' : config.shape === 'rounded' ? 'rounded-md' : ''}\`}
            style={{ 
              backgroundColor: isActive ? color : 'rgba(255,255,255,0.1)',
              filter: isActive && blur > 0 ? \`blur(\${blur}px)\` : 'none',
              boxShadow: isActive && glow > 0 ? \`0 0 \${glow * 10}px \${color}\` : 'none'
            }}
            animate={isActive ? {
              ${config.animationStyle === 'scale' ? 'scale: [1, 1.2, 1],' : ''}
              ${config.animationStyle === 'pulse' ? 'opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95],' : ''}
              ${config.animationStyle === 'opacity' ? 'opacity: [0.2, 1, 0.2],' : ''}
              ${config.animationStyle === 'wave' ? 'opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8],' : ''}
              ${config.animationStyle === 'matrix' ? 'opacity: [0, 1, 0], backgroundColor: [color, "#003b00", color],' : ''}
              ${config.animationStyle === 'float' ? 'scale: [1, 1.3, 1], y: [0, -2, 0], opacity: [1, 0, 1],' : ''}
              ${config.animationStyle === 'pixel' ? 'rotate: [0, 90, 180, 270, 360], opacity: [0.6, 1, 0.6],' : ''}
              ${config.animationStyle === 'glow' ? `boxShadow: ["0 0 0px ${config.color}", "0 0 ${config.glow * 15}px ${config.color}", "0 0 0px ${config.color}"],` : ''}
            } : {}}
            transition={{
              duration: 1 / speed,
              repeat: Infinity,
              ease: "linear",
              delay: ${config.animationStyle === 'wave' ? '(i % gridSize + Math.floor(i / gridSize)) * 0.15' : config.animationStyle === 'matrix' ? '(i % gridSize) * 0.5 + (Math.floor(i / gridSize)) * 0.1' : '(i % gridSize) * 0.1'}
            }}
          />
        );
      })}
    </div>
  );
};`;
    setModalContent({ title: 'React Component', code });
    setModalOpen(true);
  };

  const generateCSSCode = () => {
    const code = `.loader-grid {
  display: grid;
  grid-template-columns: repeat(${config.gridSize}, 1fr);
  gap: 8px;
}

.loader-cell {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  ${config.shape === 'circle' ? 'border-radius: 50%;' : config.shape === 'rounded' ? 'border-radius: 6px;' : ''}
}

.loader-cell.active {
  background: ${config.color};
  animation: loader-anim ${1 / config.speed}s ${config.animationStyle === 'pixel' ? 'steps(4)' : 'ease-in-out'} infinite;
  ${config.glow > 0 ? `box-shadow: 0 0 ${config.glow * 10}px ${config.color};` : ''}
  ${config.blur > 0 ? `filter: blur(${config.blur}px);` : ''}
  image-rendering: pixelated;
}

@keyframes loader-anim {
  0%, 100% { opacity: 0.4; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}`;
    setModalContent({ title: 'CSS Styles', code });
    setModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {/* Mobile Backdrop */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          />
        )}

        <motion.div 
          className={`
            fixed md:relative right-0 top-0 h-full w-80 bg-zinc-900/50 border-l border-white/10 
            overflow-y-auto p-6 flex flex-col gap-8 z-[101] md:z-auto
            ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            transition-transform duration-300 ease-in-out
          `}
          initial={false}
          animate={isOpen ? { x: 0 } : {}}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Settings
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={onReset}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                title="Reset Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {onClose && (
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white md:hidden"
                  title="Close Settings"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</label>
          <input 
            type="text"
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Cell Shape */}
        <div className="space-y-4">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Cell Shape</label>
          <div className="grid grid-cols-4 gap-2">
            {(['square', 'circle', 'rounded', 'dot'] as CellShape[]).map((shape) => (
              <button
                key={shape}
                onClick={() => updateConfig({ shape })}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                  ${config.shape === shape 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10'}
                `}
              >
                {shape === 'square' && <Square className="w-5 h-5" />}
                {shape === 'circle' && <Circle className="w-5 h-5" />}
                {shape === 'rounded' && <Box className="w-5 h-5" />}
                {shape === 'dot' && <Dot className="w-5 h-5" />}
                <span className="text-[10px] capitalize">{shape}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Style */}
        <div className="space-y-4">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Animation Style</label>
          <div className="grid grid-cols-2 gap-2">
            {(['opacity', 'scale', 'pulse', 'glow', 'wave', 'matrix', 'float', 'pixel'] as AnimationStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => updateConfig({ animationStyle: style })}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${config.animationStyle === style 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10'}
                `}
              >
                {style === 'opacity' && <Wind className="w-4 h-4" />}
                {style === 'scale' && <Play className="w-4 h-4" />}
                {style === 'pulse' && <Zap className="w-4 h-4" />}
                {style === 'glow' && <Sun className="w-4 h-4" />}
                {style === 'wave' && <RotateCcw className="w-4 h-4" />}
                {style === 'matrix' && <Grid3X3 className="w-4 h-4" />}
                {style === 'float' && <Sparkles className="w-4 h-4" />}
                {style === 'pixel' && <LayoutGrid className="w-4 h-4" />}
                <span className="text-xs capitalize">{style}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Speed</label>
              <span className="text-xs text-blue-400 font-mono">{config.speed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" min="0.1" max="5" step="0.1"
              value={config.speed}
              onChange={(e) => updateConfig({ speed: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Blur</label>
              <span className="text-xs text-blue-400 font-mono">{config.blur}px</span>
            </div>
            <input 
              type="range" min="0" max="10" step="1"
              value={config.blur}
              onChange={(e) => updateConfig({ blur: parseInt(e.target.value) })}
              className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Glow Intensity</label>
              <span className="text-xs text-blue-400 font-mono">{config.glow.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0" max="3" step="0.1"
              value={config.glow}
              onChange={(e) => updateConfig({ glow: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-4">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Color</label>
          <div className="flex gap-3 items-center">
            <input 
              type="color"
              value={config.color}
              onChange={(e) => updateConfig({ color: e.target.value })}
              className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden"
            />
            <input 
              type="text"
              value={config.color}
              onChange={(e) => updateConfig({ color: e.target.value })}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Effects */}
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">Grid Background</span>
            <div 
              onClick={() => updateConfig({ backgroundStyle: config.backgroundStyle === 'grid' ? 'static' : 'grid' })}
              className={`
                w-10 h-5 rounded-full relative transition-all
                ${config.backgroundStyle === 'grid' ? 'bg-blue-500' : 'bg-white/10'}
              `}
            >
              <div className={`
                absolute top-1 w-3 h-3 rounded-full bg-white transition-all
                ${config.backgroundStyle === 'grid' ? 'left-6' : 'left-1'}
              `} />
            </div>
          </label>
        </div>

        {/* Export Actions */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
          <button 
            onClick={generateReactCode}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export React Component
          </button>
          <button 
            onClick={generateCSSCode}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-colors text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy CSS
          </button>
        </div>
      </motion.div>
      </AnimatePresence>

      <CodeModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalContent.title} 
        code={modalContent.code} 
      />
    </>
  );
};
