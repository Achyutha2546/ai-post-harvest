import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Sprout, Loader2 } from 'lucide-react';

const DISTRICT_PLACES = {
  "Alluri Sitharama Raju": ["Paderu", "Rampachodvaram", "Yetapaka", "Chinturu", "Ananthagiri"],
  "Anakapalli": ["Anakapalli", "Chodavaram", "Narsipatnam", "Madugula", "Yalamanchili", "Payakaraopeta"],
  "Ananthapuramu": ["Ananthapuramu", "Gooty", "Tadipatri", "Rayadurg", "Kalyandurg", "Singanamala"],
  "Annamayya": ["Rayachoti", "Madanapalle", "Rajampet", "Railway Kodur", "Thamballapalle"],
  "Bapatla": ["Bapatla", "Chirala", "Repalle", "Addanki", "Parchur", "Vemuru"],
  "Chittoor": ["Chittoor", "Palamaner", "Punganur", "Nagari", "Gangadhara Nellore"],
  "Dr. B.R. Ambedkar Konaseema": ["Amalapuram", "Ravulapalem", "Kothapeta", "Mandapeta", "Mummidivaram", "Ramachandrapuram"],
  "East Godavari": ["Rajahmundry", "Kovvur", "Jaggampeta", "Anaparthy", "Nidadavole"],
  "Eluru": ["Eluru", "Jangareddygudem", "Nuzvid", "Denduluru", "Polavaram", "Chintalapudi"],
  "Guntur": ["Guntur", "Tenali", "Mangalagiri", "Ponnur", "Tadikonda", "Prathipadu"],
  "Kakinada": ["Kakinada", "Tuni", "Pithapuram", "Peddapuram", "Prathipadu", "Jaggampeta"],
  "Krishna": ["Machilipatnam", "Gudivada", "Pamarru", "Avanigadda", "Penamaluru"],
  "Kurnool": ["Kurnool", "Adoni", "Yemmiganur", "Alur", "Pattikonda", "Kodumur"],
  "Nandyal": ["Nandyal", "Banaganapalli", "Allagadda", "Nandikotkur", "Dhone", "Srisailam"],
  "NTR": ["Vijayawada", "Jaggayyapeta", "Tiruvuru", "Nandigama", "Mylavaram"],
  "Palnadu": ["Narasaraopet", "Piduguralla", "Sattenapalli", "Chilakaluripet", "Vinukonda", "Gurazala"],
  "Parvathipuram Manyam": ["Parvathipuram", "Salur", "Palakonda", "Kurupam"],
  "Prakasam": ["Ongole", "Markapur", "Kandukur", "Giddalur", "Kanigiri", "Darsi"],
  "Sri Potti Sriramulu Nellore": ["Nellore", "Gudur", "Kavali", "Atmakur", "Rapur", "Venkatagiri"],
  "Sri Sathya Sai": ["Puttaparthi", "Dharmavaram", "Kadiri", "Hindupur", "Penukonda", "Madakasira"],
  "Srikakulam": ["Srikakulam", "Rajam", "Ichapuram", "Palasa", "Tekkali", "Pathapatnam"],
  "Tirupati": ["Tirupati", "Srikalahasti", "Gudur", "Sullurpeta", "Venkatagiri", "Chandragiri"],
  "Visakhapatnam": ["Visakhapatnam", "Bheemunipatnam", "Gajuwaka", "Anandapuram", "Pendurthi"],
  "Vizianagaram": ["Vizianagaram", "Bobbili", "Cheepurupalli", "Gajapathinagaram", "Nellimarla"],
  "West Godavari": ["Bhimavaram", "Tanuku", "Narasapur", "Palakollu", "Tadepalligudem"],
  "YSR": ["Cuddapah", "Proddatur", "Pulivendula", "Jammalamadugu", "Badvel", "Mydukur", "Kamalapuram"]
};

export default function Home() {
  const [formData, setFormData] = useState({
    crop: '',
    quantity: '',
    district: '',
    place: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [placeSearch, setPlaceSearch] = useState('');
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [showPlaceList, setShowPlaceList] = useState(false);
  const navigate = useNavigate();

  const districts = Object.keys(DISTRICT_PLACES).sort();
  const filteredDistricts = districts.filter(d => 
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const places = formData.district ? DISTRICT_PLACES[formData.district].sort() : [];
  const filteredPlaces = places.filter(p => 
    p.toLowerCase().includes(placeSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      // Mock API call since it's an assessment
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          location: `${formData.place}, ${formData.district}`
        })
      });
      const data = await res.json();
      // Simulate delay for smooth UI experience
      setTimeout(() => {
        navigate('/dashboard', { state: { data, query: formData } });
      }, 800);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 font-sans overflow-hidden relative">
      {/* Decorative background blur elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-20 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

      <div className="max-w-lg w-full relative z-10 glass bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] p-10 border border-slate-700/50 transform transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.2)] ring-1 ring-white/5 animate-[float_6s_ease-in-out_infinite]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-2xl mb-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-indigo-500/30 backdrop-blur-md transform transition duration-500 hover:rotate-12 hover:scale-110">
            <Sprout className="w-12 h-12 text-indigo-400 drop-shadow-sm" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">Market Intelligence</h1>
          <p className="text-indigo-200 font-medium mt-3 opacity-80 text-lg">Predict, Plan, and Profit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2 tracking-wide uppercase">
              <Sprout className="w-4 h-4 text-indigo-400" /> Crop Strategy
            </label>
            <div className="relative">
              <select
                required
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="w-full bg-slate-800/80 focus:bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl px-5 py-4 outline-none transition-all duration-300 shadow-inner font-medium appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your harvest</option>
                <option value="Paddy">Paddy</option>
                <option value="Cotton">Cotton</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Chilli">Chilli</option>
                <option value="Onion">Onion</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2 tracking-wide uppercase">
                <span className="text-indigo-400 font-bold bg-slate-800 px-1.5 rounded text-xs py-0.5 border border-slate-700">Q</span> Volume (Qtl)
              </label>
              <input
                required
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="50"
                className="w-full bg-slate-800/80 focus:bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl px-5 py-4 outline-none transition-all duration-300 shadow-inner font-medium placeholder-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2 tracking-wide uppercase">
                <Calendar className="w-4 h-4 text-indigo-400" /> Date
              </label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-800/80 focus:bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl px-5 py-4 outline-none transition-all duration-300 shadow-inner font-medium text-sm color-scheme-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* District Searchable Select */}
            <div className="space-y-2 relative">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2 tracking-wide uppercase">
                <MapPin className="w-4 h-4 text-indigo-400" /> District
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="Search District..."
                  value={districtSearch || formData.district}
                  onFocus={() => { setShowDistrictList(true); }}
                  onChange={(e) => { setDistrictSearch(e.target.value); setShowDistrictList(true); }}
                  className="w-full bg-slate-800/80 focus:bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl px-5 py-4 outline-none transition-all duration-300 shadow-inner font-medium"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                
                {showDistrictList && (
                  <div className="absolute z-[60] mt-2 w-full max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-xl">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map(d => (
                        <div
                          key={d}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, district: d, place: '' }));
                            setDistrictSearch(d);
                            setPlaceSearch('');
                            setShowDistrictList(false);
                          }}
                          className="px-5 py-3 hover:bg-indigo-600 cursor-pointer text-white transition-colors"
                        >
                          {d}
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-slate-500">No districts found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Place Searchable Select */}
            <div className={`space-y-2 relative ${!formData.district ? 'opacity-50' : ''}`}>
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2 tracking-wide uppercase">
                <MapPin className="w-4 h-4 text-indigo-400" /> Place / APMC
              </label>
              <div className="relative">
                <input
                  required
                  disabled={!formData.district}
                  type="text"
                  placeholder={formData.district ? "Search Place..." : "Select District first"}
                  value={placeSearch || formData.place}
                  onFocus={() => { if(formData.district) setShowPlaceList(true); }}
                  onChange={(e) => { setPlaceSearch(e.target.value); setShowPlaceList(true); }}
                  className="w-full bg-slate-800/80 focus:bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl px-5 py-4 outline-none transition-all duration-300 shadow-inner font-medium"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />

                {showPlaceList && formData.district && (
                  <div className="absolute z-[60] mt-2 w-full max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-xl">
                    {filteredPlaces.length > 0 ? (
                      filteredPlaces.map(p => (
                        <div
                          key={p}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, place: p }));
                            setPlaceSearch(p);
                            setShowPlaceList(false);
                          }}
                          className="px-5 py-3 hover:bg-indigo-600 cursor-pointer text-white transition-colors"
                        >
                          {p}
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-slate-500">No places found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full group mt-8 relative overflow-hidden flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide py-5 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] disabled:opacity-70 disabled:hover:scale-100 border border-indigo-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="relative z-10">Running AI Model...</span>
              </>
            ) : (
              <>
                <span className="relative z-10 text-lg">Generate Insights</span>
                <Search className="w-6 h-6 text-indigo-200 group-hover:translate-x-1.5 transition-transform relative z-10" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
