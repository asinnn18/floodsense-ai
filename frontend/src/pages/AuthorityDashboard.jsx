import React, { useState } from 'react'
import { Activity, Database, Server, Cpu, Map as MapIcon, ShieldAlert, Users, Clock, CheckCircle, Navigation, MapPin, Zap } from 'lucide-react'

const AuthorityDashboard = ({ data }) => {
  const [simulating, setSimulating] = useState(null);

  if (!data || !data.raw_iot_feed) return null;

  const handleAntiGravitySim = (loc_id) => {
    setSimulating(loc_id);
    setTimeout(() => {
      setSimulating(null);
      alert(`Anti-Gravity Vacuum Simulation Complete for ${loc_id}. Drain is now clear.`);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-2"><Server size={12}/> Global Sensor Status</div>
          <div className="text-2xl font-black text-success flex items-baseline gap-2">
            ONLINE <span className="text-xs text-slate-400 font-bold">100% Uptime</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-2"><Activity size={12}/> Network Load</div>
          <div className="text-2xl font-black text-primary">
            2.4 <span className="text-xs text-slate-400 font-bold">MB/s</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-2"><Cpu size={12}/> Processing Latency</div>
          <div className="text-2xl font-black text-warning">
            14 <span className="text-xs text-slate-400 font-bold">ms</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm border-l-4 border-l-danger hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-2"><ShieldAlert size={12}/> Critical Anomalies</div>
          <div className="text-2xl font-black text-danger">
            {Object.values(data.drains).filter(d => d.status === 'Critical').length}
          </div>
        </div>
      </div>

      {/* Detailed Drainage Directory (BBMP Custom Request) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2">
            <MapPin className="text-primary" size={16} /> BBMP DETAILED DRAINAGE DIRECTORY & ACTION PLAN
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200">Drain ID / Location</th>
                <th className="px-4 py-3 border-b border-slate-200">Coordinates</th>
                <th className="px-4 py-3 border-b border-slate-200">Status</th>
                <th className="px-4 py-3 border-b border-slate-200">Cleaning Strategy</th>
                <th className="px-4 py-3 border-b border-slate-200 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(data.drains).map(([loc_id, drain]) => (
                <tr key={loc_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{drain.id}</div>
                    <div className="text-xs text-slate-500">Access via Main Road Manhole</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                    12.9279° N, 77.6271° E
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${drain.status === 'Critical' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                      {simulating === loc_id ? 'CLEARING...' : drain.status === 'Critical' ? 'High Risk' : 'Safe'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {drain.status === 'Critical' ? 'Requires High-Pressure Jetting & Vacuum' : 'Routine Desilting Scheduled'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {drain.status === 'Critical' && (
                      <button 
                        onClick={() => handleAntiGravitySim(loc_id)}
                        disabled={simulating === loc_id}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 ml-auto transition-all ${simulating === loc_id ? 'bg-primary/20 text-primary animate-pulse' : 'bg-primary text-white hover:bg-primary-dark shadow-sm'}`}
                      >
                        <Zap size={12} /> {simulating === loc_id ? 'Extracting...' : 'Anti-Gravity Pump'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authority Management Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Available Teams */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[350px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2">
              <Users className="text-primary" size={16} /> ACTIVE RESPONSE TEAMS
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
              3 ON DUTY
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            <div className="space-y-3">
              {[
                { id: 'Team Alpha', status: 'Available', members: 5, equipment: ['Vacuum Truck', 'High-Pressure Jet'] },
                { id: 'Team Bravo', status: 'Deployed - Koramangala', members: 4, equipment: ['Portable Pumps'] },
                { id: 'Team Charlie', status: 'Available', members: 6, equipment: ['Excavator', 'Sludge Pumps'] },
              ].map((team, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800 font-bold">{team.id}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${team.status.includes('Available') ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {team.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500"><strong>Members:</strong> {team.members}</div>
                  <div className="text-xs text-slate-500"><strong>Equipment:</strong> {team.equipment.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[350px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2">
              <Clock className="text-success" size={16} /> DRAINAGE CLEARANCE HISTORY
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
              7 DAYS
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            <div className="space-y-3">
              {[
                { id: 'DRN-Madiwala-01', date: '2026-04-25', action: 'Cleared severe plastic blockage', team: 'Team Alpha', status: 'Completed' },
                { id: 'DRN-Indiranagar-03', date: '2026-04-24', action: 'Routine desilting & pump check', team: 'Team Charlie', status: 'Completed' },
                { id: 'DRN-Whitefield-02', date: '2026-04-22', action: 'Replaced broken stormwater grate', team: 'Team Bravo', status: 'Completed' },
                { id: 'DRN-HSR-05', date: '2026-04-21', action: 'Emergency water pumping (3 hours)', team: 'Team Alpha', status: 'Completed' },
              ].map((log, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 hover:border-success/30 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800 font-bold text-sm flex items-center gap-2">
                      <CheckCircle className="text-success" size={14} /> {log.id}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">{log.date}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{log.action}</div>
                  <div className="text-[10px] text-primary font-bold mt-1 uppercase">Executed by: {log.team}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Raw Live Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2">
              <Database className="text-primary" size={16} /> RAW IOT TELEMETRY FEED
            </h3>
            <span className="flex items-center gap-2 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> LIVE
            </span>
          </div>
          
          <div className="flex-1 overflow-auto p-0 custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 sticky top-0 bg-white shadow-sm font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 border-b border-slate-100">Timestamp (UTC)</th>
                  <th className="py-3 px-4 border-b border-slate-100">Node ID</th>
                  <th className="py-3 px-4 border-b border-slate-100 text-right">Flow (L/s)</th>
                  <th className="py-3 px-4 border-b border-slate-100 text-right">Level (cm)</th>
                  <th className="py-3 px-4 border-b border-slate-100 text-right">Batt</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 divide-y divide-slate-50">
                {data.raw_iot_feed.map((pkt, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono">{pkt.timestamp}</td>
                    <td className="py-3 px-4 font-bold">{pkt.drain_id}</td>
                    <td className={`py-3 px-4 text-right font-bold ${pkt.flow_lps < 30 ? 'text-danger' : ''}`}>{pkt.flow_lps.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right font-bold ${pkt.level_cm > 100 ? 'text-danger' : ''}`}>{pkt.level_cm.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right ${pkt.batt < 50 ? 'text-warning' : 'text-success'}`}>{pkt.batt}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Node Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[500px] overflow-auto custom-scrollbar">
          <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <MapIcon className="text-warning" size={16} /> SPATIAL NODE ANALYSIS
          </h3>
          
          <div className="space-y-4">
            {Object.entries(data.drains).map(([loc_id, drain]) => {
               const risk = data.flood_risk[loc_id];
               return (
                <div key={loc_id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold text-slate-800">{drain.id}</div>
                    <div className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${drain.status === 'Critical' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                      {drain.status === 'Critical' ? 'High Risk' : 'Safe'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Garbage Density</div>
                      <div className="text-sm text-slate-700 font-mono">{drain.garbage_density} kg/m³</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Blockage Risk</div>
                      <div className="text-sm text-slate-700 font-mono">{drain.blockage_risk.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                     <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">AI Recommendation</div>
                     <div className="text-xs text-primary font-bold">
                       Deploy Pumps: {risk.resource_needs.pumps} units, {risk.resource_needs.workers} workers
                     </div>
                  </div>
                </div>
               )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AuthorityDashboard
