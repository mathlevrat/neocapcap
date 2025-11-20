import React, { useState, useCallback } from 'react';
import { generateCapDesign } from './services/geminiService';
import { AppState, CapColor, DesignSession } from './types';
import { NeonButton } from './components/NeonButton';
import { CapSVG } from './components/CapSVG';
import { LucideSparkles, LucidePalette, LucideShare2, LucideRotateCcw, LucideArrowRight } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<AppState>('HOME');
  const [session, setSession] = useState<DesignSession>({
    selectedColor: CapColor.BLACK,
    prompt: '',
    generatedImage: null,
    isLoading: false,
    error: null,
  });

  const handleGenerate = useCallback(async () => {
    if (!session.prompt.trim()) return;

    setSession(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const imageUrl = await generateCapDesign(session.prompt);
      setSession(prev => ({
        ...prev,
        generatedImage: { url: imageUrl, prompt: prev.prompt },
        isLoading: false
      }));
    } catch (err) {
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: "La génération a échoué. Veuillez réessayer."
      }));
    }
  }, [session.prompt]);

  const handleColorChange = (color: CapColor) => {
    setSession(prev => ({ ...prev, selectedColor: color }));
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full grid-bg -z-10 opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -z-10"></div>

      <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
        NEOCAP
      </h1>
      <p className="text-cyan-100 text-xl md:text-2xl mb-12 max-w-2xl font-light">
        L'avenir du streetwear est ici. Concevez votre casquette unique grâce à la puissance de l'IA générative.
      </p>
      <NeonButton onClick={() => setView('DESIGN')}>
        <span className="flex items-center gap-2">
          COMMENCER LA CRÉATION <LucideArrowRight className="w-5 h-5" />
        </span>
      </NeonButton>

      {/* Footer Stats */}
      <div className="absolute bottom-10 flex gap-8 text-cyan-500/60 font-mono text-xs">
        <div>SYS.VER.2.5.FLASH</div>
        <div>LATENCY: LOW</div>
        <div>STATUS: ONLINE</div>
      </div>
    </div>
  );

  const renderDesign = () => (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-1/3 p-8 border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col gap-8 z-10">
        <div className="flex items-center gap-4 mb-4 cursor-pointer group" onClick={() => setView('HOME')}>
          <div className="w-10 h-10 bg-cyan-950 rounded flex items-center justify-center group-hover:bg-cyan-900 transition-colors">
            <span className="font-bold text-cyan-400">NC</span>
          </div>
          <h2 className="text-xl font-display font-bold text-white">STUDIO</h2>
        </div>

        {/* Color Selector */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest">1. Base Materielle</label>
          <div className="flex gap-4">
            {Object.entries(CapColor).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleColorChange(value)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  session.selectedColor === value 
                    ? 'border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] scale-110' 
                    : 'border-white/20 hover:border-white/50'
                }`}
                style={{ backgroundColor: value }}
                aria-label={`Select color ${key}`}
              />
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3 flex-1">
          <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest">2. Injection IA</label>
          <div className="relative h-full max-h-64">
            <textarea
              value={session.prompt}
              onChange={(e) => setSession(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Décrivez votre design futuriste (ex: Cyberpunk skull, Neon geometric shapes, Retro wave palm tree)..."
              className="w-full h-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all resize-none font-mono text-sm"
            />
            <LucideSparkles className="absolute bottom-4 right-4 text-cyan-500/50 w-5 h-5" />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-6 border-t border-white/10">
          {session.error && (
            <p className="text-red-400 text-sm mb-4 font-mono bg-red-900/20 p-2 border border-red-900 rounded">
              Error: {session.error}
            </p>
          )}
          <NeonButton 
            onClick={handleGenerate} 
            disabled={session.isLoading || !session.prompt}
            className="w-full flex justify-center"
          >
             {session.isLoading ? (
               <span className="animate-pulse">GÉNÉRATION EN COURS...</span>
             ) : (
               <span className="flex items-center gap-2">GÉNÉRER DESIGN <LucideSparkles className="w-4 h-4" /></span>
             )}
          </NeonButton>
        </div>
      </div>

      {/* Right Panel: Visualization */}
      <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        
        {/* Background Glow based on color */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 transition-colors duration-700"
          style={{ backgroundColor: session.selectedColor === CapColor.BLACK ? '#0ea5e9' : session.selectedColor }}
        ></div>

        <div className="relative z-10 w-full max-w-2xl">
           <CapSVG 
              color={session.selectedColor} 
              overlayImage={session.generatedImage?.url || null} 
           />
        </div>

        {session.generatedImage && (
            <div className="absolute bottom-8 right-8 flex gap-4">
                <NeonButton variant="secondary" onClick={() => setView('PREVIEW')}>
                    FINALISER
                </NeonButton>
            </div>
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <div className="absolute inset-0 grid-bg opacity-20 -z-10"></div>
      
      <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl max-w-4xl w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
                <CapSVG 
                    color={session.selectedColor} 
                    overlayImage={session.generatedImage?.url || null} 
                />
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">MODÈLE NC-X1</h2>
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
                        <span className="px-2 py-1 bg-cyan-900/30 rounded border border-cyan-500/30">LIMITED EDITION</span>
                        <span className="px-2 py-1 bg-purple-900/30 rounded border border-purple-500/30">AI GENERATED</span>
                    </div>
                </div>

                <div className="space-y-2 text-slate-400 font-light text-sm">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span>Base Color</span>
                        <span className="text-white font-mono uppercase">{Object.keys(CapColor).find(key => CapColor[key as keyof typeof CapColor] === session.selectedColor)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span>Prompt ID</span>
                        <span className="text-white font-mono truncate max-w-[200px]">{session.prompt}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span>Price Estimate</span>
                        <span className="text-cyan-400 font-mono text-lg">45.00 €</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                    <NeonButton onClick={() => alert("Commande simulée envoyée à la fabrication !")}>
                        COMMANDER MAINTENANT
                    </NeonButton>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setView('DESIGN')}
                            className="flex-1 py-3 border border-white/20 rounded hover:bg-white/5 text-white font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <LucideRotateCcw className="w-4 h-4" /> EDITER
                        </button>
                        <button className="flex-1 py-3 border border-white/20 rounded hover:bg-white/5 text-white font-mono text-sm flex items-center justify-center gap-2 transition-colors">
                            <LucideShare2 className="w-4 h-4" /> PARTAGER
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="antialiased text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-100">
        {view === 'HOME' && renderHome()}
        {view === 'DESIGN' && renderDesign()}
        {view === 'PREVIEW' && renderPreview()}
    </main>
  );
}