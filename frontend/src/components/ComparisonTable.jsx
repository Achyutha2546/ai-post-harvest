import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function ComparisonTable({ mandis, bestMandi }) {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <div className="flex items-center text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded w-max"><ArrowUp className="w-4 h-4 mr-1" /> Rising</div>;
      case 'down': return <div className="flex items-center text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-1 rounded w-max"><ArrowDown className="w-4 h-4 mr-1" /> Falling</div>;
      default: return <div className="flex items-center text-slate-400 bg-slate-400/10 border border-slate-400/20 px-2 py-1 rounded w-max"><Minus className="w-4 h-4 mr-1" /> Stable</div>;
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors duration-300">
      <div className="p-6 border-b border-white/5 bg-slate-800/30">
        <h3 className="text-xl font-bold text-white drop-shadow-sm">Mandi Price Comparison</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-white/5 text-sm font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Mandi Name</th>
              <th className="px-6 py-4">Distance</th>
              <th className="px-6 py-4 text-right">Price/Qtl</th>
              <th className="px-6 py-4">Current Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mandis?.map((mandi, idx) => {
              const isBest = bestMandi?.name === mandi.name;
              return (
                <tr 
                  key={idx} 
                  className={`group transition-colors duration-200 ${isBest ? 'bg-indigo-500/10 hover:bg-indigo-500/20' : 'hover:bg-slate-800/40'}`}
                >
                  <td className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border shadow-inner ${isBest ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-800/80 text-slate-400 border-white/5'}`}>
                        {mandi.name.charAt(0)}
                      </div>
                      <span className={`font-medium ${isBest ? 'text-white font-bold drop-shadow-sm' : 'text-slate-300'}`}>
                        {mandi.name}
                      </span>
                      {isBest && <span className="text-xs px-2 py-0.5 bg-indigo-500 text-white border border-indigo-400 rounded-full font-medium ml-2 shadow-[0_0_10px_rgba(99,102,241,0.5)]">Best Option</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium border-b border-white/5">
                    {mandi.distance} km
                  </td>
                  <td className="px-6 py-4 text-right text-base font-bold text-white font-mono border-b border-white/5">
                    ₹{mandi.price}
                  </td>
                  <td className="px-6 py-4 border-b border-white/5">
                    {getTrendIcon(mandi.trend)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
