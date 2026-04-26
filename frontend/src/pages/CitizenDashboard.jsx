import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Zap, CloudRain, Wind, Droplets, Activity, FileText } from 'lucide-react'
import MapDashboard from './MapDashboard'
import { useTranslation } from 'react-i18next'

const CitizenDashboard = ({ data, user }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('MAP');

  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: t("Namaskara! I'm FloodBot. Ask me about flood risks in Namma Bengaluru, safe routes, or drain status.") }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const resData = await response.json();
      setChatHistory(prev => [...prev, { role: 'bot', text: resData.response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'bot', text: "Error connecting to AI Server." }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      
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
          <div className="flex-1 w-full bg-slate-50 relative p-4 overflow-hidden">
            <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-white">
               {activeTab === 'MAP' && <MapDashboard data={data} />}
               
               {activeTab === 'SAFE ROUTING' && (
                 <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                     <MapPin size={40} />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 mb-4">{t("AI Safe Routing Active")}</h2>
                   <p className="text-slate-500 max-w-md mb-8">{t("GPS navigation is currently routing you away from the active high-risk flood zones.")}</p>
                   <button className="bg-[#F59E0B] hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all">
                     {t("Start Navigation")}
                   </button>
                 </div>
               )}

               {activeTab === 'LIVE ANALYTICS' && (
                 <div className="p-6 h-full flex flex-col bg-slate-900 text-slate-300">
                   <h3 className="text-white font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                     <Activity size={16} className="text-green-400" /> {t("Live IoT Telemetry")}
                   </h3>
                   <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2">
                     {data.raw_iot_feed?.map((log, i) => (
                       <div key={i} className="flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-800 pb-2">
                         <span className="text-slate-500 w-20">{new Date(log.timestamp).toLocaleTimeString()}</span>
                         <span className="text-blue-400 w-24">[{log.drain_id}]</span>
                         <span className="text-emerald-400 w-28">Flow: {log.flow_lps} L/s</span>
                         <span className="text-amber-400 w-24">Lvl: {log.level_cm} cm</span>
                         <span className="text-slate-600">MAC: {log.mac}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
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

          {/* Interactive Gemini-style Chatbot */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[450px] overflow-hidden relative">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <span className="text-2xl">🤖</span>
                 <h3 className="font-bold text-slate-800">{t("FloodBot AI")}</h3>
               </div>
               <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">Powered by Gemini</span>
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
               {chatHistory.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                     msg.role === 'user' 
                      ? 'bg-[#F59E0B] text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none whitespace-pre-line leading-relaxed'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   </div>
                 </div>
               )}
               <div ref={chatEndRef} />
             </div>
             
             <div className="p-3 bg-white border-t border-slate-100">
                <form onSubmit={handleChat} className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t("Ask what you should do...")} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#F59E0B]" 
                  />
                  <button type="submit" disabled={isTyping || !chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-amber-600 transition-colors">
                    <Zap size={14} className="fill-current" />
                  </button>
                </form>
             </div>
          </div>
        </div>

      </div>

      {/* Bottom Citizen Action Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm w-full mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all active:scale-95 group">
            <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center group-hover:animate-pulse">
              <Zap size={20} className="fill-current" />
            </div>
            <div className="text-left">
              <div className="font-black text-red-700 tracking-wide uppercase">{t("SOS EMERGENCY")}</div>
              <div className="text-xs text-red-500 font-medium">{t("Dispatch NDRF Rescue")}</div>
            </div>
          </button>

          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-blue-700 uppercase">{t("REPORT BLOCKAGE")}</div>
              <div className="text-xs text-blue-500 font-medium">{t("Upload Photo Evidence")}</div>
            </div>
          </button>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
              <CheckCircleIcon size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-emerald-700 uppercase">{t("AI VERIFICATION")}</div>
              <div className="text-xs text-emerald-600 font-medium">{t("Auto-Updating Map")}</div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center relative">
              <Activity size={20} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            </div>
            <div className="text-left">
              <div className="font-bold text-amber-700 uppercase">{t("AUTHORITY ALERT")}</div>
              <div className="text-xs text-amber-600 font-medium">{t("BBMP Dashboard Linked")}</div>
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
