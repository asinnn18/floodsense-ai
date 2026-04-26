import React from 'react'
import { MessageSquare, MessageCircle, Phone } from 'lucide-react'

const NotificationSim = ({ data }) => {
  const highRisks = Object.entries(data.flood_risk).filter(([_, r]) => r.risk_level === 'High')

  return (
    <div className="glass-panel space-y-6">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <MessageSquare size={20} className="text-primary" /> Notification Simulation
      </h3>

      {/* WhatsApp Mock */}
      <div className="bg-[#075e54] rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#075e54] p-3 flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle size={24} />
          </div>
          <div>
            <div className="font-bold text-sm">FloodSense AI Alert</div>
            <div className="text-[10px] opacity-80">Official Update</div>
          </div>
        </div>
        <div className="bg-[#e5ddd5] p-4 space-y-3 h-64 overflow-y-auto">
          {highRisks.length > 0 ? (
            highRisks.map(([id, risk]) => (
              <div key={id} className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-xs text-slate-800">
                <p className="font-bold text-[#128c7e] mb-1">⚠️ FLOOD ALERT</p>
                <p><strong>Location:</strong> {data.locations[id].name}</p>
                <p><strong>Risk:</strong> High (Score: {risk.score})</p>
                <p><strong>Action:</strong> Avoid route. Take Hosur Road instead.</p>
                <p className="text-[10px] text-slate-400 mt-2 text-right">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            ))
          ) : (
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-xs text-slate-800 italic">
              Monitoring Bengaluru weather... No alerts for now.
            </div>
          )}
        </div>
        <div className="bg-white p-2 flex gap-2">
          <input disabled placeholder="Type a message..." className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs" />
          <div className="bg-[#128c7e] w-8 h-8 rounded-full flex items-center justify-center text-white">
            <Send size={14} />
          </div>
        </div>
      </div>

      {/* SMS Mock */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-white/5 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest">
          <span>SMS Alert</span>
          <span>Just Now</span>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-xl border border-white/5 text-sm">
          <p className="font-bold text-warning">⚠️ BBMP ADVISORY</p>
          <p className="mt-1">
            Drain blockage predicted at {Object.values(data.locations)[0].name}. Emergency crew deployed. Stay alert.
          </p>
        </div>
      </div>
    </div>
  )
}

const Send = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
)

export default NotificationSim
