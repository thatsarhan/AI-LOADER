import { LoaderConfig } from '../types';

export const generateSVGCode = (config: LoaderConfig) => {
  const size = config.gridSize * 40;
  const cells = Array.from({ length: config.gridSize * config.gridSize }).map((_, i) => {
    const isActive = config.activeCells.includes(i);
    if (!isActive) return '';
    const x = (i % config.gridSize) * 40;
    const y = Math.floor(i / config.gridSize) * 40;
    const rx = config.shape === 'circle' ? 20 : config.shape === 'rounded' ? 8 : 0;
    
    return `<rect x="${x}" y="${y}" width="32" height="32" rx="${rx}" fill="${config.color}">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="${1/config.speed}s" repeatCount="indefinite" />
    </rect>`;
  }).join('\n');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(0.95); }
      50% { opacity: 1; transform: scale(1.05); }
    }
  </style>
  ${cells}
</svg>`;
};

export const generateCSSCode = (config: LoaderConfig) => {
  return `.loader-grid {
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
};
