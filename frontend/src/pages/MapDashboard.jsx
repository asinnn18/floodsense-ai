import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Zap, Activity } from 'lucide-react'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const priorityIconHtml = `<div style="background-color: white; border: 2px solid #ef4444; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: #ef4444;">H</div>`
const PriorityIcon = L.divIcon({ html: priorityIconHtml, className: 'dummy' });

const MapDashboard = ({ data }) => {
  const center = [12.9716, 77.5946] 
  const [activeRoute, setActiveRoute] = useState(null)
  const [showAntiGravity, setShowAntiGravity] = useState(false)
  const [antiGravityTarget, setAntiGravityTarget] = useState('')

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return '#ef4444' // Danger Red
      case 'Medium': return '#f59e0b' // Warning Orange
      default: return '#10b981' // Success Green
    }
  }

  // Simulate routing by drawing a simple polyline away from the danger zone
  const calculateSafeRoute = (locCoords) => {
    const route = [
      locCoords, // start at the danger zone (or user location near it)
      [locCoords[0] + 0.02, locCoords[1] + 0.02], // Safe waypoint 1
      [locCoords[0] + 0.03, locCoords[1] + 0.01], // Safe waypoint 2
    ]
    setActiveRoute(route)
  }

  const triggerAntiGravity = (locName) => {
    setAntiGravityTarget(locName);
    setShowAntiGravity(true);
    setTimeout(() => {
      setShowAntiGravity(false);
      setAntiGravityTarget('');
      alert(`Anti-Gravity Simulation Complete for ${locName}. Drain blockages successfully reversed and extracted!`);
    }, 4500); // 4.5 second simulation
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 left-4 z-[400] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg pointer-events-auto border border-slate-200">
          <h2 className="text-lg font-black text-slate-800">Live Bengaluru Network</h2>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">IoT Sensor Data • Priority Routing</div>
        </div>
      </div>
      
      {/* FULL SCREEN ANTI-GRAVITY SIMULATION OVERLAY */}
      {showAntiGravity && (
        <div className="absolute inset-0 z-[999] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden rounded-2xl">
          {/* Animated extraction beams */}
          <div className="absolute inset-0 opacity-30 flex justify-center items-end">
            <div className="w-1/3 h-full bg-gradient-to-t from-cyan-500 to-transparent animate-pulse" style={{ animationDuration: '0.5s' }}></div>
            <div className="w-1/4 h-full bg-gradient-to-t from-blue-500 to-transparent animate-pulse delay-75" style={{ animationDuration: '0.4s' }}></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-4 border-cyan-400 flex items-center justify-center animate-spin mb-6" style={{ animationDuration: '3s' }}>
              <Zap size={48} className="text-cyan-400 animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2 animate-pulse">
              ANTI-GRAVITY EXTRACTION
            </h2>
            <div className="text-cyan-300 font-mono text-sm mb-8 tracking-widest bg-cyan-900/50 px-4 py-2 rounded border border-cyan-500/30">
              TARGET: {antiGravityTarget.toUpperCase()} | FORCE: MAXIMUM
            </div>
            
            {/* Simulation text log */}
            <div className="w-96 bg-black/50 border border-slate-700 rounded-lg p-4 font-mono text-[10px] text-green-400 h-32 flex flex-col justify-end overflow-hidden">
              <div className="animate-pulse">&gt; Initializing Graviton Emitters...</div>
              <div className="animate-pulse delay-75">&gt; Reversing Local Gravity Well...</div>
              <div className="animate-pulse delay-150">&gt; Extracting 4,500kg of Dense Blockage...</div>
              <div className="text-cyan-400 font-bold animate-pulse delay-300 mt-2">&gt; EXTRACTION SUCCESSFUL. CHANNELS CLEAR.</div>
            </div>
          </div>
        </div>
      )}

      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="w-full h-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Draw Safe Route if active */}
        {activeRoute && (
          <Polyline 
            positions={activeRoute} 
            color="#10b981" 
            weight={6} 
            opacity={0.8} 
            dashArray="10, 10" 
            className="animate-pulse"
          />
        )}

        {Object.entries(data.locations).map(([id, loc]) => {
          const risk = data.flood_risk[id]
          const drain = data.drains[id]
          const color = getRiskColor(risk.risk_level)

          return (
            <React.Fragment key={id}>
              {/* Main Zone Marker */}
              <Marker position={loc.coords}>
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[220px]">
                    <h3 className="font-black text-lg text-slate-800 border-b border-slate-100 pb-2 mb-3">{loc.name}</h3>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                        <span className="font-bold text-xs uppercase text-slate-400">Flood Risk</span>
                        <span className="font-black" style={{ color }}>{risk.risk_level} ({risk.score}/100)</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                        <span className="font-bold text-xs uppercase text-slate-400">Drainage Status</span>
                        <span className="font-bold">{drain.status}</span>
                      </div>

                      {risk.time_to_flood !== 'None' && (
                        <div className="mt-3 p-2 bg-danger/10 border border-danger/20 rounded-lg text-center font-bold text-danger animate-pulse">
                          Flood expected in {risk.time_to_flood}
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 mt-4">
                        <button 
                          onClick={() => calculateSafeRoute(loc.coords)}
                          className="w-full bg-[#10b981] text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                          CALCULATE SAFE ROUTE
                        </button>
                        
                        {drain.status === 'Critical' && (
                          <button 
                            onClick={() => triggerAntiGravity(loc.name)}
                            className="w-full bg-[#F59E0B] text-white py-2 rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm flex items-center justify-center gap-1"
                          >
                            <Zap size={14} /> TRIGGER ANTI-GRAVITY
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Risk Radius Circle */}
              <Circle 
                center={loc.coords}
                radius={risk.score * 20} 
                pathOptions={{ 
                  fillColor: color, 
                  color: color, 
                  fillOpacity: 0.15,
                  weight: 2
                }}
              />

              {/* Priority Infrastructure Markers */}
              {loc.priority_infra.map((infra, idx) => (
                <Marker 
                  key={`${id}-infra-${idx}`} 
                  position={[loc.coords[0] + (idx+1)*0.005, loc.coords[1] + (idx+1)*0.005]} 
                  icon={PriorityIcon}
                >
                  <Popup>
                     <div className="font-bold text-sm text-danger">{infra}</div>
                     <div className="text-xs text-slate-500">Priority Evacuation Zone</div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default MapDashboard
