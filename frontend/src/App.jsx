import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import MapDashboard from './pages/MapDashboard'
import AuthorityDashboard from './pages/AuthorityDashboard'
import CitizenDashboard from './pages/CitizenDashboard'
import NotificationSim from './components/NotificationSim'
import VoiceAssistant from './components/VoiceAssistant'
import FloodBot from './components/FloodBot'
import { Volume2, VolumeX, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const API_BASE = 'http://localhost:5000/api'

// --- SHARED COMPONENTS ---
const TopNav = ({ user, logout, switchRole }) => {
  const { t, i18n } = useTranslation();
  const [muted, setMuted] = useState(false);

  return (
    <div className="fixed top-0 w-full z-50 bg-white shadow-sm flex flex-col">
      {/* Top red/yellow progress-like bar */}
      <div className="h-1.5 w-full flex">
        <div className="w-[45%] bg-[#D32F2F]"></div>
        <div className="w-[55%] bg-[#F59E0B]"></div>
      </div>
      
      <nav className="px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-4">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Emblem_of_Karnataka.svg/800px-Emblem_of_Karnataka.svg.png" 
            referrerPolicy="no-referrer"
            alt="Emblem" 
            className="w-12 h-12 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-[#1e293b]">
              <span className="text-[#D32F2F]">{t("FLOOD")}</span><span className="text-[#F59E0B]">{t("SENSE")}</span>
            </h1>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {t("NAMMA BENGALURU DISASTER MANAGEMENT")}
            </div>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-6">
          {/* Language Toggle */}
          <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
            {['English', 'Hindi', 'Kannada'].map(lang => {
              const code = lang === 'English' ? 'EN' : lang === 'Hindi' ? 'HI' : 'KN';
              const isActive = (i18n.language || 'English') === lang;
              return (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${isActive ? 'bg-[#F59E0B] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {code}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-slate-700 tracking-wide">
            <button 
              onClick={() => user && switchRole('citizen')}
              className={`uppercase transition-colors ${user?.role === 'citizen' ? 'text-[#F59E0B] border-b-2 border-[#F59E0B] pb-1' : 'hover:text-[#F59E0B]'}`}
            >
              {t("Citizen View")}
            </button>
            <button 
              onClick={() => user && switchRole('authority')}
              className={`uppercase transition-colors ${user?.role === 'authority' ? 'text-[#F59E0B] border-b-2 border-[#F59E0B] pb-1' : 'hover:text-[#F59E0B]'}`}
            >
              {t("Authority View")}
            </button>
            {user && (
              <button onClick={logout} className="text-slate-400 hover:text-danger uppercase ml-4">{t("Logout")}</button>
            )}
          </div>

          <button 
            onClick={() => setMuted(!muted)}
            className="w-10 h-10 rounded-full bg-amber-50 text-[#F59E0B] flex items-center justify-center hover:bg-amber-100 transition-colors"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </nav>
    </div>
  );
}

// --- LAYOUTS ---
const CitizenLayout = ({ user, data }) => (
  <main className="pt-28 px-8 pb-12 max-w-[1600px] mx-auto space-y-6">
    <CitizenDashboard data={data} user={user} />
  </main>
)

const AuthorityLayout = ({ data }) => (
  <main className="pt-28 px-8 pb-12 max-w-[1600px] mx-auto">
    <AuthorityDashboard data={data} />
  </main>
)

// --- MAIN APP COMPONENT ---
function App() {
  const { user, login, logout, loading: authLoading } = useAuth()
  const { t, i18n } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isBotOpen, setIsBotOpen] = useState(false)

  const switchRole = (newRole) => {
    if (!user) return;
    // Update the user context by re-logging in with the new role
    login({ ...user, role: newRole });
  }

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status`)
      setData(res.data)
      setLoading(false)
    } catch (err) {
      console.error("API Error:", err)
    }
  }

  useEffect(() => {
    if (user && user.language) {
      i18n.changeLanguage(user.language)
    }
  }, [user, i18n])

  useEffect(() => {
    if (user) {
      fetchData()
      const interval = setInterval(fetchData, 5000)
      return () => clearInterval(interval)
    }
  }, [user])

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative overflow-hidden">
      <TopNav user={user} logout={logout} switchRole={switchRole} />

      {/* Global UI Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.02]">
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Emblem_of_Karnataka.svg/800px-Emblem_of_Karnataka.svg.png" referrerPolicy="no-referrer" alt="" className="w-[800px] h-[800px] object-contain grayscale" />
      </div>

      <div className="relative z-10">
        {!user ? (
          <LandingPage />
        ) : loading ? (
          <div className="h-screen w-screen flex flex-col items-center justify-center pt-20">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Emblem_of_Karnataka.svg/800px-Emblem_of_Karnataka.svg.png" 
              referrerPolicy="no-referrer"
              alt="Emblem" 
              className="w-20 h-20 mb-6 drop-shadow-md animate-pulse"
            />
            <div className="text-xl font-bold text-[#F59E0B] animate-pulse">{t("Initializing Data Stream...")}</div>
          </div>
        ) : (
          <>
            {user.role === 'citizen' ? (
              <CitizenLayout user={user} data={data} />
            ) : (
              <AuthorityLayout data={data} />
            )}

            {/* Voice Assistant Integration */}
            {user.role === 'citizen' && <VoiceAssistant data={data} language={user.language} />}

            {/* Chatbot Interface */}
            <FloodBot isOpen={isBotOpen} onClose={() => setIsBotOpen(false)} />

            {/* Chatbot Toggle */}
            {!isBotOpen && (
              <button 
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group z-50"
              >
                <MessageSquare className="text-[#10b981] group-hover:scale-110 transition-transform" size={24} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
