import React, { useState } from 'react'
import { Mic, Volume2 } from 'lucide-react'

const VoiceAssistant = ({ data, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (text, langCode) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() 
      const utterance = new SpeechSynthesisUtterance(text)
      
      const voices = window.speechSynthesis.getVoices()
      // Try to find a voice that matches the requested language
      let voice = voices.find(v => v.lang.includes(langCode))
      if (!voice) {
          // Fallback to Indian English if specific regional language isn't available
          voice = voices.find(v => v.lang.includes('en-IN')) || voices[0]
      }
      utterance.voice = voice;
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const generateReport = () => {
    if(!data) return;
    
    const highRisks = Object.entries(data.flood_risk)
      .filter(([_, r]) => r.risk_level === 'High')
      .map(([id]) => data.locations[id].name)

    let text = "";
    let langCode = "en-IN";

    if (language === 'Kannada') {
        langCode = "kn-IN";
        if (highRisks.length > 0) {
            text = `ಗಮನಿಸಿ. ${highRisks.join(' ಮತ್ತು ')} ನಲ್ಲಿ ಹೆಚ್ಚಿನ ಪ್ರವಾಹದ ಅಪಾಯವಿದೆ. ದಯವಿಟ್ಟು ಈ ಪ್ರದೇಶಗಳನ್ನು ತಪ್ಪಿಸಿ. ಪರ್ಯಾಯ ಮಾರ್ಗವನ್ನು ಬಳಸಿ.`;
        } else {
            text = `ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ: ಹೆಚ್ಚಿನ ಪ್ರದೇಶಗಳು ಸುರಕ್ಷಿತವಾಗಿವೆ. ಮಳೆಯ ತೀವ್ರತೆ ${data.weather.rainfall_intensity} ಮಿಲಿಮೀಟರ್ ಇದೆ.`;
        }
    } else if (language === 'Hindi') {
        langCode = "hi-IN";
        if (highRisks.length > 0) {
            text = `ध्यान दें। ${highRisks.join(' और ')} में बाढ़ का उच्च जोखिम है। कृपया इन क्षेत्रों से बचें। वैकल्पिक मार्ग का उपयोग करें।`;
        } else {
            text = `वर्तमान स्थिति: अधिकांश क्षेत्र सुरक्षित हैं। बारिश की तीव्रता ${data.weather.rainfall_intensity} मिलीमीटर है। कोई तत्काल खतरा नहीं है।`;
        }
    } else {
        // English Default
        if (highRisks.length > 0) {
            text = `Attention. High flood risk detected at ${highRisks.join(' and ')}. Please avoid these areas. Safe routes are available via NICE Road.`;
        } else {
            text = `Current status: Most areas are safe. Rainfall intensity is at ${data.weather.rainfall_intensity} millimeters. No immediate flood threat.`;
        }
    }
    
    speak(text, langCode);
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={generateReport}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isSpeaking ? 'bg-danger text-white animate-pulse' : 'bg-primary-light/10 text-primary hover:bg-primary-light/20'}`}
      >
        <Volume2 size={18} />
        <span className="hidden md:inline">Audio Alert</span>
      </button>
      
      <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
        <Mic size={20} />
      </button>
    </div>
  )
}

export default VoiceAssistant
