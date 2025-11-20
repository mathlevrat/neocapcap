import React from 'react';
import { CapColor } from '../types';

interface CapSVGProps {
  color: CapColor;
  overlayImage: string | null;
}

export const CapSVG: React.FC<CapSVGProps> = ({ color, overlayImage }) => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
      {/* Container for the SVG */}
      <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="fabric-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <mask id="cap-front-mask">
             <path d="M150,220 Q250,160 350,220 L340,320 Q250,340 160,320 Z" fill="white" />
          </mask>
        </defs>

        {/* Brim */}
        <path 
          d="M140,310 Q250,360 360,310 Q380,420 250,440 Q120,420 140,310 Z" 
          fill={color} 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="2"
        />
        
        {/* Back Panels */}
        <path d="M150,220 Q250,100 350,220" fill={color} stroke="none" opacity="0.8" />

        {/* Main Crown */}
        <path 
          d="M110,260 Q150,120 250,100 Q350,120 390,260 L360,310 Q250,360 140,310 Z" 
          fill={color}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        
        {/* Stitching details */}
        <path d="M250,100 L250,330" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
        <circle cx="250" cy="100" r="8" fill={color} stroke="rgba(255,255,255,0.2)" />

        {/* Overlay Area for AI Design (ForeignObject for complex image rendering) */}
        {overlayImage && (
          <foreignObject x="150" y="180" width="200" height="140" clipPath="url(#cap-front-mask-css)">
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
               <img 
                  src={overlayImage} 
                  alt="AI Design" 
                  className="w-full h-full object-contain mix-blend-hard-light"
                  style={{ filter: 'contrast(1.2) brightness(1.1)' }}
                />
            </div>
          </foreignObject>
        )}
      </svg>
      
      {/* Direct overlay approach for better browser compatibility than SVG foreignObject sometimes */}
      {overlayImage && (
        <div 
          className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35%] h-[25%] overflow-hidden pointer-events-none"
          style={{ 
             maskImage: 'radial-gradient(circle, white 60%, transparent 100%)',
             WebkitMaskImage: 'radial-gradient(circle, white 60%, transparent 100%)'
          }}
        >
          <img 
            src={overlayImage} 
            alt="Design Overlay" 
            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          />
        </div>
      )}
    </div>
  );
};