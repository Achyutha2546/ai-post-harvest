import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

const defaultIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const bestIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DISTRICT_COORDS = {
  "Alluri Sitharama Raju": [18.0667, 82.5333],
  "Anakapalli": [17.6896, 83.0035],
  "Ananthapuramu": [14.6819, 77.6006],
  "Annamayya": [13.9748, 78.7100],
  "Bapatla": [15.9045, 80.4674],
  "Chittoor": [13.2172, 79.1003],
  "Dr. B.R. Ambedkar Konaseema": [16.5796, 82.0120],
  "East Godavari": [17.0005, 81.8040],
  "Eluru": [16.7107, 81.1035],
  "Guntur": [16.3067, 80.4365],
  "Kakinada": [16.9891, 82.2475],
  "Krishna": [16.1901, 81.1336],
  "Kurnool": [15.8267, 78.0333],
  "Nandyal": [15.4847, 78.4812],
  "NTR": [16.5062, 80.6480],
  "Palnadu": [16.2366, 80.0535],
  "Parvathipuram Manyam": [18.7778, 83.4285],
  "Prakasam": [15.5057, 80.0499],
  "Sri Potti Sriramulu Nellore": [14.4426, 79.9865],
  "Sri Sathya Sai": [14.1671, 77.8105],
  "Srikakulam": [18.2949, 83.8938],
  "Tirupati": [13.6288, 79.4192],
  "Visakhapatnam": [17.6868, 83.2185],
  "Vizianagaram": [18.1067, 83.3950],
  "West Godavari": [16.5449, 81.5212],
  "YSR": [14.4673, 78.8242]
};

function MapBounds({ userCoords, mandis }) {
  const map = useMap();
  useEffect(() => {
    if (!userCoords || !userCoords.lat || !userCoords.lng || !mandis || mandis.length === 0) return;
    
    const bounds = L.latLngBounds([[userCoords.lat, userCoords.lng]]);
    mandis.forEach(mandi => {
      if (mandi.lat && mandi.lng) {
        bounds.extend([mandi.lat, mandi.lng]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, userCoords, mandis]);
  
  return null;
}

export default function MandiMap({ mandis, bestMandi, district, userCoords, userLocation }) {
  const center = userCoords && userCoords.lat && userCoords.lng 
    ? [userCoords.lat, userCoords.lng] 
    : (DISTRICT_COORDS[district] || [15.9129, 79.74]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-300">
      <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-slate-800/30">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg shadow-inner">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-white drop-shadow-sm">మార్గం మరియు దూరం</h3>
      </div>
      <div className="h-[300px] w-full z-0 relative">
        <MapContainer 
          key={center.join(',')}
          center={center} 
          zoom={8} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBounds userCoords={userCoords} mandis={mandis} />

          {/* User Location Marker */}
          {userCoords && userCoords.lat && userCoords.lng && (
            <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center p-1 bg-slate-900/90 rounded text-slate-200">
                  <strong className="block text-white text-lg mb-1">మీ స్థానం</strong>
                  <div className="text-sm text-slate-400">{userLocation || district}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {mandis?.map((mandi, idx) => {
            const lat = mandi.lat || (center[0] + (mandi.distance * 0.01 * (idx % 2 === 0 ? 1 : -1)));
            const lng = mandi.lng || (center[1] + (mandi.distance * 0.01 * (idx % 3 === 0 ? 1 : -1)));
            const isBest = bestMandi?.name === mandi.name;
            
            const hasUserCoords = userCoords && userCoords.lat && userCoords.lng;
            
            return (
              <React.Fragment key={idx}>
                {hasUserCoords && (
                  <Polyline 
                    positions={[
                      [userCoords.lat, userCoords.lng],
                      [lat, lng]
                    ]}
                    pathOptions={{
                      color: isBest ? '#10b981' : '#6366f1',
                      weight: isBest ? 4 : 2,
                      opacity: isBest ? 0.9 : 0.5,
                      dashArray: isBest ? 'none' : '6, 8',
                      lineCap: 'round'
                    }}
                  />
                )}
                <Marker 
                  position={[lat, lng]} 
                  icon={isBest ? bestIcon : defaultIcon}
                >
                  <Popup>
                    <div className="text-center p-1 bg-slate-900/90 rounded text-slate-200">
                      <strong className="block text-white text-lg mb-1">{mandi.name}</strong>
                      <div className="text-indigo-400 font-bold mb-1 drop-shadow-sm">₹{mandi.price} / క్వింటాల్</div>
                      <div className="text-sm text-slate-400">{mandi.distance} కి.మీ దూరంలో</div>
                      {isBest && <div className="mt-2 text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded font-semibold uppercase tracking-wider">సూచించబడినది</div>}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
