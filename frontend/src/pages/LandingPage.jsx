import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Phone, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LandingPage = () => {
  const { login } = useAuth()
  const { t, i18n } = useTranslation()
  const [role, setRole] = useState('citizen')
  const [phone, setPhone] = useState('+91 ')
  const [language, setLanguage] = useState('English')
  const [isLoading, setIsLoading] = useState(false)

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone || phone === '+91 ') return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        name: role === 'citizen' ? 'Bengaluru Resident' : 'BBMP Official',
        role: role,
        phone: phone,
        language: language,
        location: 'Bengaluru (Auto-detected)'
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden pt-16">
      {/* Background large card to match the subtle grey area in mockup behind the main card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-slate-200/50 rounded-3xl z-0"></div>

      {/* Global UI Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.02]">
        <img src="/emblem_of_karnataka_stylized_1777159710606.png" alt="" className="w-[800px] h-[800px] object-contain grayscale" />
      </div>

      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 flex flex-col items-center relative z-10 mx-4 border border-slate-100 overflow-hidden">
        
        {/* Exact Watermark inside the card as seen in the mockup */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.04] pointer-events-none z-0">
          <img src="/emblem_of_karnataka_stylized_1777159710606.png" alt="watermark" className="w-full h-full object-contain" />
        </div>

        {/* Emblem */}
        <img 
          src="/emblem_of_karnataka_stylized_1777159710606.png" 
          alt="Government of Karnataka Emblem" 
          className="w-24 h-24 mb-6 object-contain relative z-10"
        />

        {/* Title */}
        <h1 className="text-2xl font-black text-center text-[#1e293b] leading-tight mb-2 uppercase relative z-10">
          {t("FLOOD SENSE AND DRAIN IQ") || "FLOOD SENSE AND DRAIN IQ"}
        </h1>
        <h2 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] mb-2 uppercase relative z-10">
          {t("NAMMA BENGALURU") || "NAMMA BENGALURU"}
        </h2>
        <p className="text-xs text-[#F59E0B] font-bold tracking-wide uppercase text-center mb-6 relative z-10">
          Predict • Prevent • Protect
        </p>

        {/* Language Selector */}
        <div className="w-full mb-6 relative z-10">
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl">
            <Globe className="absolute left-4 text-slate-400" size={18} />
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="w-full bg-transparent py-3 pl-12 pr-4 text-slate-700 font-medium focus:outline-none appearance-none"
            >
              <option value="English">English</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Role Toggle Pill */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1.5 flex w-full mb-8 shadow-inner relative z-10">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
              role === 'citizen' 
                ? 'bg-[#F59E0B] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t("CITIZEN VIEW") || "CITIZEN VIEW"}
          </button>
          <button
            type="button"
            onClick={() => setRole('authority')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
              role === 'authority' 
                ? 'bg-[#F59E0B] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t("AUTHORITY VIEW") || "AUTHORITY VIEW"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              {t("AUTHORIZED MOBILE (+91)") || "AUTHORIZED MOBILE (+91)"}
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-4 text-slate-400" size={18} />
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/30 flex justify-center items-center gap-2 mt-4"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              t("SEND VERIFICATION CODE") || "SEND VERIFICATION CODE"
            )}
          </button>
        </form>

      </div>
    </div>
  )
}

export default LandingPage
