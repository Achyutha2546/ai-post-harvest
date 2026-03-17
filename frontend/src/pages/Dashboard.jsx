import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecommendationCard from '../components/RecommendationCard';
import TrendChart from '../components/TrendChart';
import ComparisonTable from '../components/ComparisonTable';
import { ArrowLeft, Download, Info } from 'lucide-react';

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showExplanation, setShowExplanation] = useState(false);

  // If no state, go back
  if (!state || !state.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <button onClick={() => navigate('/')} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold">
          వెనక్కి వెళ్ళండి
        </button>
      </div>
    );
  }

  const { data, query } = state;
  const { decision, currentPrice, predictedPrice, change, explanation, bestMandi, comparisons, chartData, userCoords } = data;

  const handleDownload = () => {
    // Mock download behavior
    alert('కొత్త నివేదికను డౌన్‌లోడ్ చేస్తోంది...');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-300">
      {/* Header */}
      <header className="bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-full transition-all group shadow-sm border border-white/5 hover:border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
            </button>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-sm">
              మార్కెట్ ఇంటెలిజెన్స్ <span className="text-xs tracking-widest font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full ml-2">PRO</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-semibold border border-indigo-500/20 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse relative z-10 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              <span className="relative z-10">Live డేటా</span>
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-full transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95 border border-indigo-400/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">రిపోర్ట్ డౌన్‌లోడ్</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

        {/* Context Bar */}
        <div className="bg-slate-900/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 shadow-2xl flex flex-wrap gap-8 items-center text-sm font-medium text-slate-400 transform transition-all hover:border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-white/5 shadow-inner">🌴</div>
            <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider font-bold">పంట</span> <span className="text-white font-bold text-base leading-none">{query.crop}</span></div>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-white/5 shadow-inner">📦</div>
            <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider font-bold">పరిమాణం</span> <span className="text-white font-bold text-base leading-none">{query.quantity} Qtl</span></div>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-white/5 shadow-inner">📍</div>
            <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider font-bold">ప్రాంతం</span> <span className="text-white font-bold text-base leading-none">{query.location}</span></div>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-white/5 shadow-inner">🗓️</div>
            <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider font-bold">తేదీ</span> <span className="text-white font-bold text-base leading-none">{query.date}</span></div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full">
          <RecommendationCard 
            decision={decision} 
            currentPrice={currentPrice}
            predictedPrice={predictedPrice}
            change={change}
            explanation={explanation}
            bestMandi={bestMandi}
          />
        </div>

        {/* Expandable Explanation */}
        <div>
          <button 
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
          >
            <Info className="w-4 h-4" /> ఈ నిర్ణయం ఎందుకు?
          </button>
          {showExplanation && (
            <div className="mt-4 p-5 bg-white border border-blue-100 rounded-xl shadow-inner text-gray-700 leading-relaxed text-sm animate-fade-in-down border-l-4 border-l-blue-500">
              మా AI ఇంజిన్ గతం నుండి సేకరించిన నమూనాలు, ప్రస్తుత పోకడలు మరియు ప్రాంతీయ ధరల వ్యత్యాసాలను విశ్లేషించింది. 
              {decision === 'అమ్మేయండి' ? ' ధరలు త్వరలో పడిపోవచ్చు' : decision === 'ఆగండి' ? ' ధరలు కోలుకునే అవకాశం ఉంది' : ` రవాణా ఖర్చుల కంటే లాభం ఎక్కువగా ఉంటుంది కాబట్టి ${bestMandi?.name} మార్కెట్ కి రవాణా చేయండి`} అని సూచిస్తున్నాము.
            </div>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          
          <div className="space-y-8">
            {/* Chart */}
            <TrendChart chartData={chartData} />
          </div>
          
          <div className="space-y-8 h-full">
            {/* Table */}
            <ComparisonTable mandis={comparisons} bestMandi={bestMandi} />
          </div>

        </div>
      </main>
    </div>
  );
}
