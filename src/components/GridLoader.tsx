import React from 'react';
import { motion } from 'motion/react';
import { LoaderConfig } from '../types';

interface GridLoaderProps {
  config: LoaderConfig;
  className?: string;
  isEditing?: boolean;
  onToggleCell?: (index: number) => void;
}

export const GridLoader: React.FC<GridLoaderProps> = ({ 
  config, 
  className = "", 
  isEditing = false,
  onToggleCell 
}) => {
  const { gridSize, activeCells, color, speed, shape, animationStyle, glow, blur } = config;
  const totalCells = gridSize * gridSize;

  const getShapeClass = () => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'rounded': return 'rounded-md';
      case 'dot': return 'rounded-full scale-50';
      default: return 'rounded-none';
    }
  };

  const getAnimationProps = (isActive: boolean, index: number) => {
    if (!isActive) return {};

    const baseTransition = {
      duration: 1 / speed,
      repeat: Infinity,
      ease: "easeInOut",
      delay: (index % gridSize + Math.floor(index / gridSize)) * 0.1,
    };

    switch (animationStyle) {
      case 'wave':
        return {
          animate: { 
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1, 0.8]
          },
          transition: {
            ...baseTransition,
            delay: (index % gridSize + Math.floor(index / gridSize)) * 0.15,
          }
        };
      case 'matrix':
        return {
          animate: { 
            opacity: [0, 1, 0],
            backgroundColor: [color, '#003b00', color]
          },
          transition: {
            duration: 2 / speed,
            repeat: Infinity,
            delay: (index % gridSize) * 0.5 + (Math.floor(index / gridSize)) * 0.1,
          }
        };
      case 'float':
        return {
          animate: {
            scale: [1, 1.3, 1],
            y: [0, -2, 0],
            opacity: [1, 0, 1]
          },
          transition: baseTransition
        };
      case 'scale':
        return {
          animate: { scale: [1, 1.2, 1] },
          transition: baseTransition
        };
      case 'pulse':
        return {
          animate: { opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] },
          transition: baseTransition
        };
      case 'glow':
        return {
          animate: { 
            boxShadow: [
              `0 0 0px ${color}`,
              `0 0 ${glow * 15}px ${color}`,
              `0 0 0px ${color}`
            ]
          },
          transition: baseTransition
        };
      case 'pixel':
        return {
          animate: { 
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.6, 1, 0.6]
          },
          transition: {
            ...baseTransition,
            ease: (v: number) => Math.floor(v * 4) / 4,
            duration: 1.2 / speed
          }
        };
      case 'opacity':
      default:
        return {
          animate: { opacity: [0.2, 1, 0.2] },
          transition: baseTransition
        };
    }
  };

  return (
    <div 
      className={`grid gap-2 ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        width: 'fit-content'
      }}
    >
      {Array.from({ length: totalCells }).map((_, i) => {
        const isActive = activeCells.includes(i);
        const animation = getAnimationProps(isActive, i);

        return (
          <motion.div
            key={i}
            onClick={() => isEditing && onToggleCell?.(i)}
            className={`
              w-8 h-8 cursor-pointer transition-colors duration-200
              ${getShapeClass()}
              ${isActive ? '' : 'bg-white/5'}
            `}
            style={{
              backgroundColor: isActive ? color : undefined,
              filter: isActive && blur > 0 ? `blur(${blur}px)` : 'none',
              boxShadow: isActive && glow > 0 ? `0 0 ${glow * 10}px ${color}` : 'none',
              imageRendering: isActive ? 'pixelated' : 'auto',
              ...(isActive ? {} : { opacity: 0.1 })
            }}
            {...animation}
          />
        );
      })}
    </div>
  );
};
