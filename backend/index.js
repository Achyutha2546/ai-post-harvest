const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agri-advisor')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Models
const mandiSchema = new mongoose.Schema({
  name: String,
  crop: String,
  price: Number,
  location: { type: String, default: 'Local' },
  date: { type: Date, default: Date.now },
  distance: Number,
  trend: String,
});

const Mandi = mongoose.model('Mandi', mandiSchema);

// --- Haversine Distance Formula (returns km) ---
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// --- GPS Coordinates for Andhra Pradesh Places/Towns ---
const PLACE_COORDS = {
  // Alluri Sitharama Raju
  "Paderu": { lat: 17.9913, lng: 82.6681 },
  "Rampachodvaram": { lat: 17.4415, lng: 81.7764 },
  "Yetapaka": { lat: 17.6167, lng: 81.3667 },
  "Chinturu": { lat: 17.4833, lng: 81.2167 },
  "Ananthagiri": { lat: 17.9167, lng: 82.6167 },
  // Anakapalli
  "Anakapalli": { lat: 17.6862, lng: 83.0049 },
  "Chodavaram": { lat: 17.8333, lng: 82.9383 },
  "Narsipatnam": { lat: 17.6691, lng: 82.6129 },
  "Madugula": { lat: 17.9167, lng: 82.8167 },
  "Yalamanchili": { lat: 17.5423, lng: 82.8573 },
  "Payakaraopeta": { lat: 17.3667, lng: 82.7667 },
  // Ananthapuramu
  "Ananthapuramu": { lat: 14.6819, lng: 77.5930 },
  "Gooty": { lat: 15.1195, lng: 77.6366 },
  "Tadipatri": { lat: 14.9042, lng: 78.0114 },
  "Rayadurg": { lat: 14.6928, lng: 76.8534 },
  "Kalyandurg": { lat: 14.5430, lng: 77.1049 },
  "Singanamala": { lat: 14.7667, lng: 77.9167 },
  // Annamayya
  "Rayachoti": { lat: 14.0525, lng: 78.7524 },
  "Madanapalle": { lat: 13.5510, lng: 78.5019 },
  "Rajampet": { lat: 14.1940, lng: 79.1611 },
  "Railway Kodur": { lat: 14.7167, lng: 79.9667 },
  "Thamballapalle": { lat: 13.9167, lng: 78.3667 },
  // Bapatla
  "Bapatla": { lat: 15.9047, lng: 80.4673 },
  "Chirala": { lat: 15.8290, lng: 80.3527 },
  "Repalle": { lat: 16.0217, lng: 80.8326 },
  "Addanki": { lat: 15.8097, lng: 79.9759 },
  "Parchur": { lat: 15.8833, lng: 80.1500 },
  "Vemuru": { lat: 16.3833, lng: 80.6833 },
  // Chittoor
  "Chittoor": { lat: 13.2172, lng: 79.1003 },
  "Palamaner": { lat: 13.2027, lng: 78.7457 },
  "Punganur": { lat: 13.3627, lng: 78.5755 },
  "Nagari": { lat: 13.3224, lng: 79.5867 },
  "Gangadhara Nellore": { lat: 13.6667, lng: 79.6667 },
  // Dr. B.R. Ambedkar Konaseema
  "Amalapuram": { lat: 16.5774, lng: 82.0054 },
  "Ravulapalem": { lat: 16.7667, lng: 81.8333 },
  "Kothapeta": { lat: 17.0118, lng: 81.9942 },
  "Mandapeta": { lat: 16.8642, lng: 81.9278 },
  "Mummidivaram": { lat: 16.6431, lng: 82.1136 },
  "Ramachandrapuram": { lat: 16.8394, lng: 82.0553 },
  // East Godavari
  "Rajahmundry": { lat: 17.0005, lng: 81.8040 },
  "Kovvur": { lat: 17.0167, lng: 81.7333 },
  "Jaggampeta": { lat: 17.2000, lng: 82.0167 },
  "Anaparthy": { lat: 17.1341, lng: 82.1076 },
  "Nidadavole": { lat: 16.9074, lng: 81.6716 },
  // Eluru
  "Eluru": { lat: 16.7107, lng: 81.0952 },
  "Jangareddygudem": { lat: 17.1834, lng: 81.2996 },
  "Nuzvid": { lat: 16.7842, lng: 80.8483 },
  "Denduluru": { lat: 16.8167, lng: 81.2167 },
  "Polavaram": { lat: 17.2558, lng: 81.6410 },
  "Chintalapudi": { lat: 17.0667, lng: 80.9833 },
  // Guntur
  "Guntur": { lat: 16.3067, lng: 80.4365 },
  "Tenali": { lat: 16.2432, lng: 80.6404 },
  "Mangalagiri": { lat: 16.4300, lng: 80.5600 },
  "Ponnur": { lat: 16.0667, lng: 80.5500 },
  "Tadikonda": { lat: 16.5500, lng: 80.3333 },
  "Prathipadu": { lat: 17.2167, lng: 82.1667 },
  // Kakinada
  "Kakinada": { lat: 16.9891, lng: 82.2475 },
  "Tuni": { lat: 17.3556, lng: 82.5479 },
  "Pithapuram": { lat: 17.1136, lng: 82.2525 },
  "Peddapuram": { lat: 17.0796, lng: 82.1341 },
  // Krishna
  "Machilipatnam": { lat: 16.1875, lng: 81.1389 },
  "Gudivada": { lat: 16.4342, lng: 80.9942 },
  "Pamarru": { lat: 16.3271, lng: 80.9540 },
  "Avanigadda": { lat: 16.0192, lng: 80.9211 },
  "Penamaluru": { lat: 16.4667, lng: 80.6333 },
  // Kurnool
  "Kurnool": { lat: 15.8281, lng: 78.0373 },
  "Adoni": { lat: 15.6274, lng: 77.2739 },
  "Yemmiganur": { lat: 15.7667, lng: 77.4833 },
  "Alur": { lat: 15.3833, lng: 78.1333 },
  "Pattikonda": { lat: 15.3833, lng: 77.5833 },
  "Kodumur": { lat: 15.6833, lng: 77.7667 },
  // Nandyal
  "Nandyal": { lat: 15.4786, lng: 78.4836 },
  "Banaganapalli": { lat: 15.3167, lng: 78.2333 },
  "Allagadda": { lat: 15.1333, lng: 78.5167 },
  "Nandikotkur": { lat: 15.8667, lng: 78.2667 },
  "Dhone": { lat: 15.3965, lng: 77.8752 },
  "Srisailam": { lat: 16.0833, lng: 78.8833 },
  // NTR
  "Vijayawada": { lat: 16.5062, lng: 80.6480 },
  "Jaggayyapeta": { lat: 16.8956, lng: 80.0975 },
  "Tiruvuru": { lat: 16.9833, lng: 80.6000 },
  "Nandigama": { lat: 16.7810, lng: 80.2856 },
  "Mylavaram": { lat: 16.7400, lng: 80.6400 },
  // Palnadu
  "Narasaraopet": { lat: 16.2321, lng: 79.7018 },
  "Piduguralla": { lat: 16.4833, lng: 79.8833 },
  "Sattenapalle": { lat: 16.3930, lng: 80.1524 },
  "Chilakaluripet": { lat: 16.0896, lng: 80.1671 },
  "Vinukonda": { lat: 16.0500, lng: 79.7333 },
  "Gurazala": { lat: 16.5667, lng: 79.6500 },
  // Parvathipuram Manyam
  "Parvathipuram": { lat: 18.7833, lng: 83.4167 },
  "Salur": { lat: 18.5167, lng: 83.2000 },
  "Palakonda": { lat: 18.6167, lng: 83.7333 },
  "Kurupam": { lat: 18.7500, lng: 83.5500 },
  // Prakasam
  "Ongole": { lat: 15.5057, lng: 80.0499 },
  "Markapur": { lat: 15.7363, lng: 79.2627 },
  "Kandukur": { lat: 15.2167, lng: 79.9000 },
  "Giddalur": { lat: 15.3694, lng: 78.9295 },
  "Kanigiri": { lat: 15.4000, lng: 79.5167 },
  "Darsi": { lat: 15.7667, lng: 79.6833 },
  // Nellore
  "Nellore": { lat: 14.4426, lng: 79.9865 },
  "Gudur": { lat: 14.1500, lng: 79.8500 },
  "Kavali": { lat: 14.9167, lng: 79.9833 },
  "Atmakur": { lat: 14.6167, lng: 79.6000 },
  "Rapur": { lat: 13.9667, lng: 79.4667 },
  "Venkatagiri": { lat: 13.9667, lng: 79.5833 },
  // Sri Sathya Sai
  "Puttaparthi": { lat: 14.1667, lng: 77.8167 },
  "Dharmavaram": { lat: 14.4144, lng: 77.7248 },
  "Kadiri": { lat: 14.1167, lng: 78.1667 },
  "Hindupur": { lat: 13.8290, lng: 77.4920 },
  "Penukonda": { lat: 14.0833, lng: 77.5833 },
  "Madakasira": { lat: 13.9333, lng: 77.2500 },
  // Srikakulam
  "Srikakulam": { lat: 18.2986, lng: 83.8978 },
  "Rajam": { lat: 18.4667, lng: 83.6500 },
  "Ichapuram": { lat: 19.1167, lng: 84.7000 },
  "Palasa": { lat: 18.7667, lng: 84.4167 },
  "Tekkali": { lat: 18.6167, lng: 84.2333 },
  "Pathapatnam": { lat: 18.7667, lng: 84.1000 },
  // Tirupati
  "Tirupati": { lat: 13.6288, lng: 79.4192 },
  "Srikalahasti": { lat: 13.7500, lng: 79.6981 },
  "Sullurpeta": { lat: 13.6579, lng: 80.0218 },
  "Chandragiri": { lat: 13.5833, lng: 79.3167 },
  // Visakhapatnam
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "Bheemunipatnam": { lat: 17.8908, lng: 83.4468 },
  "Gajuwaka": { lat: 17.6833, lng: 83.2167 },
  "Anandapuram": { lat: 17.8500, lng: 83.0667 },
  "Pendurthi": { lat: 17.8167, lng: 83.1833 },
  // Vizianagaram
  "Vizianagaram": { lat: 18.1066, lng: 83.3956 },
  "Bobbili": { lat: 18.5726, lng: 83.3590 },
  "Cheepurupalli": { lat: 18.3167, lng: 83.5667 },
  "Gajapathinagaram": { lat: 18.3167, lng: 83.2667 },
  "Nellimarla": { lat: 18.1167, lng: 83.4833 },
  // West Godavari
  "Bhimavaram": { lat: 16.5440, lng: 81.5217 },
  "Tanuku": { lat: 16.7551, lng: 81.6816 },
  "Narasapur": { lat: 16.4333, lng: 81.7000 },
  "Palakollu": { lat: 16.5167, lng: 81.7333 },
  "Tadepalligudem": { lat: 16.8140, lng: 81.5261 },
  // YSR
  "Cuddapah": { lat: 14.4673, lng: 78.8242 },
  "Proddatur": { lat: 14.7502, lng: 78.5481 },
  "Pulivendula": { lat: 14.4241, lng: 78.2262 },
  "Jammalamadugu": { lat: 14.8500, lng: 78.3833 },
  "Badvel": { lat: 14.7500, lng: 79.0667 },
  "Mydukur": { lat: 14.6833, lng: 78.9833 },
  "Kamalapuram": { lat: 14.5977, lng: 78.6680 },
};

// --- Mandi coordinates (fixed GPS for each APMC) ---
const MANDI_COORDS = {
  'Tiruvuru APMC (Krishna)':      { lat: 16.9833, lng: 80.6000 },
  'Rapur APMC (Nellore)':         { lat: 13.9667, lng: 79.4667 },
  'Jaggampet APMC (E.Godavari)':  { lat: 17.2000, lng: 82.0167 },
  'Nandyal APMC (Kurnool)':       { lat: 15.4786, lng: 78.4836 },
  'Kurnool APMC':                  { lat: 15.8281, lng: 78.0373 },
  'Adoni APMC (Kurnool)':          { lat: 15.6274, lng: 77.2739 },
  'Yemmiganur APMC':               { lat: 15.7667, lng: 77.4833 },
  'Cuddapah APMC':                 { lat: 14.4673, lng: 78.8242 },
  'Palnadu Market (Palnadu)':      { lat: 16.2321, lng: 79.7018 },
};

const MARKET_DATA = {
  Paddy: {
    current: 2430,
    trend: 'స్థిరంగా ఉంది (+1.31%)',
    signal: 'అమ్మేయండి',
    confidence: 88,
    r2: 0.97,
    mandis: [
      { name: 'Tiruvuru APMC (Krishna)', price: 2500, trend: 'up' },
      { name: 'Rapur APMC (Nellore)', price: 2430, trend: 'stable' },
      { name: 'Jaggampet APMC (E.Godavari)', price: 2379, trend: 'stable' },
      { name: 'Nandyal APMC (Kurnool)', price: 2200, trend: 'stable' }
    ],
    prices14d: [2390, 2390, 2400, 2373, 2390, 2390, 2390, 2390, 2385, 2382, 2385, 2385, 2369, 2375],
    insight: "కనీస మద్దతు ధరకు అండగా మద్దతు ఉంది (రూ. 2,000 కనిష్టం). తిరువూరు ₹70–130 ప్రీమియం ఇస్తుంది."
  },
  Onion: {
    current: 1059,
    trend: 'పెరుగుతోంది (+10.03%)',
    signal: 'ఆగండి',
    confidence: 61,
    r2: -0.43,
    mandis: [
      { name: 'Kurnool APMC', price: 1059, trend: 'up' }
    ],
    prices14d: [985, 737, 889, 767, 849, 755, 795, 1131, 845, 969, 885, 889, 959, 1059],
    insight: "⚠️ అస్థిరంగా ఉంది. ధరలు వారంలో 26% మారుతాయి. వేచి ఉండటం మంచిది."
  },
  Groundnut: {
    current: 7454,
    trend: 'పెరుగుతోంది (+5.43%)',
    signal: 'ఆగండి',
    confidence: 78,
    r2: 0.90,
    mandis: [
      { name: 'Kurnool APMC', price: 7816, trend: 'up' },
      { name: 'Adoni APMC (Kurnool)', price: 7719, trend: 'up' },
      { name: 'Yemmiganur APMC', price: 7120, trend: 'stable' },
      { name: 'Cuddapah APMC', price: 6826, trend: 'stable' }
    ],
    prices14d: [8696, 8437, 8184, 7713, 7432, 7900, 7436, 7021, 7233, 6381, 6655, 7409, 7120, 7454],
    insight: "కర్నూలు కడప కంటే ₹600–₹990 ఎక్కువ ఇస్తుంది. ధరలు కోలుకుంటున్నాయి, గరిష్ట స్థాయికి ఆగుదాం."
  },
  Cotton: {
    current: 7680,
    trend: 'స్థిరంగా ఉంది (+0.65%)',
    signal: 'రవాణా చేయండి',
    confidence: 76,
    r2: 0.74,
    mandis: [
      { name: 'Tiruvuru APMC (Krishna)', price: 7700, trend: 'up' },
      { name: 'Adoni APMC (Kurnool)', price: 7680, trend: 'stable' }
    ],
    prices14d: [7679, 7739, 7559, 7680, 7525, 7580, 7579, 7599, 7600, 7549, 7679, 7739, 7569, 7680],
    insight: "తిరువూరు (కృష్ణా జిల్లా) గరిష్ట ధరను ఇస్తోంది. రవాణా చేసి అమ్మడం లాభదాయకం."
  },
  Chilli: {
    current: 20000,
    trend: 'పెరుగుతోంది (+5.66%)',
    signal: 'ఆగండి',
    confidence: 84,
    r2: 0.93,
    mandis: [
      { name: 'Palnadu Market (Palnadu)', price: 20000, trend: 'up' }
    ],
    prices14d: [16750, 16500, 16000, 16750, 17400, 16750, 18000, 17250, 18500, 19300, 19250, 18250, 19000, 20000],
    insight: "🚀 భారీ పెరుగుదల — 14 రోజుల్లో 19.4% పైకి. నిల్వ ప్రమాదం ఉంటే తప్ప వేచి ఉండండి."
  }
};

// Routes
app.post('/analyze', async (req, res) => {
  try {
    const { crop, quantity, place, district, location } = req.body;
    const data = MARKET_DATA[crop] || MARKET_DATA['Paddy'];
    const qty = parseFloat(quantity) || 1;
    const currentPrice = data.current;

    // --- Resolve user's coordinates ---
    // Try 'place' first, then fall back to 'district', then default to Vijayawada
    const userCoords =
      PLACE_COORDS[place] ||
      PLACE_COORDS[district] ||
      { lat: 16.5062, lng: 80.6480 }; // default: Vijayawada

    // --- Calculate real distances for each mandi ---
    const mandisWithDistance = data.mandis.map(mandi => {
      const mandiCoords = MANDI_COORDS[mandi.name];
      let distance = null;
      if (mandiCoords) {
        distance = haversineDistance(
          userCoords.lat, userCoords.lng,
          mandiCoords.lat, mandiCoords.lng
        );
      }
      return { ...mandi, distance, lat: mandiCoords?.lat, lng: mandiCoords?.lng };
    });

    // --- Regression Simulation Logic ---
    const recentPrices = data.prices14d.slice(-3);
    const avgRecent = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;

    const trendMatch = data.trend.match(/[+-]?\d+\.\d+/);
    const trendValue = trendMatch ? parseFloat(trendMatch[0]) / 100 : 0;

    const predictedPrice = Math.round(avgRecent * (1 + trendValue * 1.5));
    const priceChangePct = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2);

    // --- Decision Engine ---
    let decision = 'SELL';
    let bestMandi = [...mandisWithDistance].sort((a, b) => b.price - a.price)[0];

    if (predictedPrice > currentPrice + (currentPrice * 0.02)) {
      decision = 'WAIT';
    } else if (bestMandi.price > currentPrice + 100) {
      decision = 'TRAVEL';
    }

    // --- AI Explanation Generation ---
    const direction = predictedPrice > currentPrice ? "పెరుగుదలను" : "తగ్గుదలను";
    const action = decision === 'WAIT'
      ? "పంటను నిల్వ ఉంచండి"
      : (decision === 'TRAVEL'
        ? `స్టాక్‌ను ${bestMandi.name} మార్కెట్‌కు రవాణా చేయండి`
        : "వెంటనే అమ్మేయండి");

    let explanation = `${crop} ధరలు ${data.trend.includes('పెరుగుతోంది') ? 'సానుకూల వృద్ధిని చూపుతున్నాయి' : 'స్థిరంగా ఉన్నాయి'}. `;
    explanation += `ప్రస్తుత ధర ₹${currentPrice} మరియు మా మోడల్ భవిష్యత్తులో ₹${predictedPrice} కు (${priceChangePct}%) ${direction} అంచనా వేస్తోంది. `;
    explanation += `గరిష్ట లాభం కోసం మీరు ${action}. `;

    if (decision === 'రవాణా చేయండి') {
      const extra = (bestMandi.price - currentPrice) * qty;
      explanation += `${bestMandi.name} కు మారడం ద్వారా, మీరు మొత్తం అదనంగా ₹${extra} లాభాన్ని పొందుతారు. `;
    }

    explanation += `\n\nగమనిక: ${data.insight}`;

    const userLocation = place && district
      ? `${place}, ${district}`
      : (location || 'Andhra Pradesh');

    res.json({
      currentPrice,
      predictedPrice,
      change: priceChangePct,
      decision,
      explanation,
      bestMandi,
      comparisons: mandisWithDistance,
      userLocation,
      userCoords,
      chartData: {
        labels: ['-14d', '-10d', '-7d', '-4d', '-2d', 'Today', 'Predicted'],
        prices: [...data.prices14d.slice(-6), predictedPrice],
        ma: data.prices14d.slice(-7).map(p => Math.round(p * 0.99))
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/mandis', async (req, res) => {
  try {
    const mandis = await Mandi.find();
    res.json(mandis);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Seed data route
app.post('/seed', async (req, res) => {
  try {
    await Mandi.deleteMany({});
    const seedMandis = [
      { name: 'Kurnool APMC', crop: 'Cotton', price: 7200, location: 'Kurnool', distance: 12, trend: 'up' },
      { name: 'Adoni Market', crop: 'Cotton', price: 7500, location: 'Adoni', distance: 68, trend: 'up' },
      { name: 'Guntur Chilli Yard', crop: 'Chilli', price: 18000, location: 'Guntur', distance: 5, trend: 'stable' },
      { name: 'Khammam Market', crop: 'Chilli', price: 17500, location: 'Khammam', distance: 120, trend: 'down' }
    ];
    await Mandi.insertMany(seedMandis);
    res.json({ message: 'Seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
