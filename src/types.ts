export type CellShape = 'square' | 'circle' | 'rounded' | 'dot';
export type AnimationStyle = 'opacity' | 'scale' | 'pulse' | 'glow' | 'wave' | 'matrix' | 'float' | 'pixel';
export type BackgroundStyle = 'none' | 'breathe' | 'static' | 'grid';

export interface LoaderConfig {
  id: string;
  name: string;
  gridSize: number;
  activeCells: number[]; // indices of cells that are "on"
  color: string;
  speed: number;
  shape: CellShape;
  animationStyle: AnimationStyle;
  backgroundStyle: BackgroundStyle;
  glow: number;
  blur: number;
}

export interface PresetPattern {
  name: string;
  activeCells: number[];
}
