import React, { useState } from 'react'
import { MapPin, Zap, CloudRain, Wind, Droplets, Activity, FileText } from 'lucide-react'
import MapDashboard from './MapDashboard'
import { useTranslation } from 'react-i18next'

const CitizenDashboard = ({ data, user }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('MAP');

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-blue-500" /> {t("BBMP WARDS")}
          </div>
          <div className="text-2xl font-black text-blue-600">198</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{t("COVERED")}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-[#F59E0B]" /> {t("ZONES MONITORED")}
          </div>
          <div className="text-2xl font-black text-[#F59E0B]">08</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{t("ACTIVE")}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircleIcon size={12} className="text-green-500" /> {t("MODEL ACCURACY")}
          </div>
          <div className="text-2xl font-black text-green-600">94.2%</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{t("VALIDATED")}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Zap size={12} className="text-red-500" /> {t("FLOOD PREDICTION")}
          </div>
          <div className="text-2xl font-black text-red-600">{t("Real-time")}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{t("24/7 AI")}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Activity size={12} className="text-slate-500" /> {t("LOAD TIME")}
          </div>
          <div className="text-2xl font-black text-slate-700">0.42s</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{t("HIGH SPEED")}</div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Briefing & Weather */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="text-blue-500" size={20} />
              <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide">{t("AI SITUATIONAL BRIEFING")}</h3>
            </div>
            <div className="text-lg font-bold italic text-slate-800 leading-snug mb-8">
              "{t("Analyzing Namma Bengaluru Drainage Network...")}"
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wide cursor-pointer hover:underline">
              <Activity size={14} /> {t("TAP FOR DETECTION DETAILS")}
            </div>
            <FileText className="absolute -right-4 -bottom-4 text-slate-50 opacity-50" size={120} />
          </div>

          <div className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] rounded-3xl p-6 shadow-lg text-white">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">{t("BENGALURU WEATHER")}</div>
            <div className="flex justify-between items-start mb-6">
              <div className="text-5xl font-black">24°C</div>
              <CloudRain size={48} className="text-white opacity-80" />
            </div>
            <div className="font-medium text-sm mb-6">{t("Heavy Rainfall Expected")}</div>
            
            <div className="flex justify-between bg-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
              <div className="text-center">
                <CloudRain size={16} className="mx-auto mb-1 text-blue-200" />
                <div className="text-[10px] text-blue-200 uppercase">{t("Rain")}</div>
                <div className="font-bold text-sm">85%</div>
              </div>
              <div className="text-center">
                <Wind size={16} className="mx-auto mb-1 text-blue-200" />
                <div className="text-[10px] text-blue-200 uppercase">{t("Wind")}</div>
                <div className="font-bold text-sm">12km/h</div>
              </div>
              <div className="text-center">
                <Droplets size={16} className="mx-auto mb-1 text-blue-200" />
                <div className="text-[10px] text-blue-200 uppercase">{t("Humid")}</div>
                <div className="font-bold text-sm">92%</div>
              </div>
            </div>

            <div className="text-xs text-blue-100 font-medium">{t("Alert: Heavy rain in 45 mins")}</div>
          </div>
        </div>

        {/* Center Column: Map */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-slate-100 flex gap-2">
            {['MAP', 'SAFE ROUTING', 'LIVE ANALYTICS'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-[#F59E0B] text-white shadow-md' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
          <div className="flex-1 w-full bg-slate-50 relative p-4">
            {/* The MapDashboard component handles Leaflet rendering inside this container */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
               <MapDashboard data={data} />
            </div>
          </div>
        </div>

        {/* Right Column: Wards & Chatbot */}
        <div className="lg:col-span-1 space-y-6 h-[700px] flex flex-col">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex-1">
            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Activity className="text-[#F59E0B]" size={16} /> {t("ACTIVE RISK WARDS")}
            </h3>
            <div className="space-y-3">
              {Object.entries(data.flood_risk).filter(([_, r]) => r.risk_level === 'High').map(([id, risk]) => (
                <div key={id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="font-bold text-red-700 text-sm">{data.locations[id].name}</span>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-1 rounded font-bold uppercase">{risk.time_to_flood}</span>
                </div>
              ))}
              {Object.entries(data.flood_risk).filter(([_, r]) => r.risk_level === 'Medium').map(([id, risk]) => (
                <div key={id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <span className="font-bold text-yellow-700 text-sm">{data.locations[id].name}</span>
                  <span className="text-[10px] bg-yellow-500 text-white px-2 py-1 rounded font-bold uppercase">{t("Monitor")}</span>
                </div>
              ))}
              {Object.entries(data.flood_risk).filter(([_, r]) => r.risk_level !== 'High' && r.risk_level !== 'Medium').length === 0 && (
                <div className="text-xs text-slate-400 italic">{t("No other active risks detected.")}</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[400px] overflow-hidden relative">
             <div className="p-4 border-b border-slate-100 flex items-center gap-2">
               <span className="text-2xl">🤖</span>
               <h3 className="font-bold text-slate-800">{t("FloodBot AI")}</h3>
             </div>
             <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-600">
                  <span className="text-xl mr-2">🙏</span> {t("Namaskara! I'm FloodBot. Ask me about flood risks in Namma Bengaluru, safe routes, or drain status.")}
                </div>
             </div>
             <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                  <input type="text" placeholder={t("Ask about Bengaluru floods...")} className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 px-4 text-sm focus:outline-none focus:border-[#F59E0B]" />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center text-white">
                    <Zap size={14} />
                  </button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// Custom simple CheckCircle Icon to avoid missing import
const CheckCircleIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default CitizenDashboard
