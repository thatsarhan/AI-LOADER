import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_CONFIG } from './constants';
import { LoaderConfig } from './types';
import { GridLoader } from './components/GridLoader';
import { Editor } from './components/Editor';
import { Gallery } from './components/Gallery';
import { 
  LayoutGrid, 
  Sparkles, 
  RotateCcw, 
  Grid3X3
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<LoaderConfig>(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState<'builder' | 'gallery'>('builder');

  const handleToggleCell = useCallback((index: number) => {
    setConfig(prev => {
      const activeCells = prev.activeCells.includes(index)
        ? prev.activeCells.filter(i => i !== index)
        : [...prev.activeCells, index];
      return { ...prev, activeCells };
    });
  }, []);

  const handleSelectPreset = (preset: Partial<LoaderConfig>) => {
    setConfig(prev => ({ ...prev, ...preset }));
    setActiveTab('builder');
  };

  const handleReset = () => {
    setConfig({ ...INITIAL_CONFIG, activeCells: [] });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-blue-500/30 flex overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Loader Studio</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">v1.0.0 • Beta</p>
            </div>
          </div>

          <nav className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('builder')}
              className={`
                flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === 'builder' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}
              `}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Builder
            </button>
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`
                flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === 'gallery' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}
              `}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              Gallery
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5">
              Editor Mode
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 relative">
          {/* Background Grid Decoration */}
          <div className={`
            absolute inset-0 pointer-events-none transition-all duration-500
            ${config.backgroundStyle === 'grid' 
              ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] [background-size:40px_40px]' 
              : 'bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px]'}
          `} />
          
          <AnimatePresence mode="wait">
            {activeTab === 'builder' ? (
              <motion.div 
                key="builder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto flex flex-col items-center gap-12 relative z-10"
              >
                {/* Canvas Container */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[40px] opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-zinc-950 border border-white/10 rounded-[40px] p-24 shadow-2xl">
                    <GridLoader 
                      config={config} 
                      isEditing={true}
                      onToggleCell={handleToggleCell}
                      className="scale-150"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-medium transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear Canvas
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="gallery"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-6xl mx-auto relative z-10"
              >
                <div className="mb-12">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Preset Library</h2>
                  <p className="text-zinc-500 text-sm">Choose a starting point or explore common loader patterns.</p>
                </div>
                <Gallery onSelect={handleSelectPreset} currentId={config.name} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
          <div className="flex gap-6">
            <span>© 2026 Loader Studio</span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Ready
            </span>
          </div>
        </footer>
      </main>

      {/* Sidebar Editor */}
      <Editor config={config} onChange={setConfig} onReset={handleReset} />
    </div>
  );
}
