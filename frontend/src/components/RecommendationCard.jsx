import React from 'react';
import { ArrowUpRight, ArrowDownRight, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RecommendationCard({ decision, currentPrice, predictedPrice, change, explanation, bestMandi }) {
  const { t } = useTranslation();
  const getGradient = () => {
    switch (decision) {
      case 'SELL': return 'from-emerald-500/40 to-emerald-950/40';
      case 'WAIT': return 'from-amber-500/40 to-amber-950/40';
      case 'TRAVEL': return 'from-indigo-500/40 to-indigo-950/40';
      default: return 'from-slate-700/40 to-slate-900/40';
    }
  };

  const getIcon = () => {
    switch (decision) {
      case 'SELL': return <TrendingUp className="w-12 h-12 text-white opacity-80" />;
      case 'WAIT': return <Minus className="w-12 h-12 text-white opacity-80" />;
      case 'TRAVEL': return <MapPin className="w-12 h-12 text-white opacity-80" />;
      default: return null;
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-8 text-white transition-all hover:scale-[1.01] duration-300 border border-white/5 backdrop-blur-md group`}>
      {/* Dynamic Background Gradient Layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
      
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-start z-10 relative">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl shadow-inner border border-white/5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">AI నైపుణ్యంతో విశ్లేషణ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,1)]"></span>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">మార్కెట్ సూచన</span>
            <h2 className="text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
              {t(decision)}
            </h2>
          </div>
          
          <div className="flex items-center gap-10 mt-6">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">ప్రస్తుత ధర</span>
              <span className="text-4xl font-black text-white font-mono leading-none tracking-tighter">₹{currentPrice}</span>
            </div>
            
            <div className="h-12 w-px bg-slate-800"></div>
            
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">అంచనా ధర</span>
              <span className="text-4xl font-black text-white font-mono leading-none tracking-tighter">₹{predictedPrice}</span>
            </div>

            <div className="h-12 w-px bg-slate-800"></div>

            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">మారిన శాతం</span>
              <span className={`text-4xl font-black font-mono leading-none tracking-tighter ${parseFloat(change) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {change}%
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex bg-slate-800/80 p-6 rounded-[2rem] backdrop-blur-xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transform transition-transform group-hover:rotate-6 duration-500 ring-1 ring-white/5">
           {getIcon()}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-800 relative z-10">
        <p className="text-xl font-medium leading-relaxed text-slate-300 max-w-2xl group-hover:text-white transition-colors duration-300">
          {explanation}
        </p>
        {decision === 'రవాణా చేయండి' && bestMandi && (
          <div className="mt-6 flex items-center gap-3 text-sm bg-indigo-500/10 w-max px-5 py-3 rounded-2xl border border-indigo-500/20 shadow-inner group-hover:bg-indigo-500/20 transition-all duration-300">
             <div className="p-1.5 bg-indigo-500 rounded-lg shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
             </div>
             <span className="text-slate-200">సూచించిన మార్కెట్: <strong className="text-white ml-1 font-bold">{bestMandi.name}</strong> <span className="text-indigo-400 ml-2">({bestMandi.distance}కి.మీ)</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
