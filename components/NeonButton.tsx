import React from 'react';

interface NeonButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  disabled = false,
  className = '' 
}) => {
  const baseStyles = "relative px-8 py-3 font-display font-bold text-sm tracking-widest uppercase transition-all duration-300 clip-path-polygon disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-500 text-black hover:bg-cyan-400 neon-glow hover:scale-105",
    secondary: "bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)"
      }}
    >
      {children}
    </button>
  );
};