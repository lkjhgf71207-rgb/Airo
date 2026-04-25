import { motion, AnimatePresence } from "motion/react";
import { Plane, Info, ExternalLink, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";

export default function App() {
  const [isPressed, setIsPressed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInfo, setShowInfo] = useState(false);
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    // Auto-launch intent if in standalone mode or auto-flag is present
    const urlParams = new URLSearchParams(window.location.search);
    const isAuto = urlParams.get('mode') === 'auto';
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone;

    if (isAuto || isStandalone) {
      setIsAutoRedirecting(true);
      const timer = setTimeout(() => {
        openAirplaneSettings();
      }, 500); 
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  const openAirplaneSettings = () => {
    // This is the specific Android intent URI to open Airplane Mode settings directly
    const androidIntent = "intent:#Intent;action=android.settings.AIRPLANE_MODE_SETTINGS;end";
    
    // Attempt to open the intent
    window.location.href = androidIntent;

    // Fallback if the intent fails (e.g. on non-Android or if it doesn't recognize the URI)
    setTimeout(() => {
      if (document.hasFocus()) {
        // If still in the app after 500ms, it might be a different device/unsupported
        console.log("Intent possibly failed, providing fallback info.");
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#151619] text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-orange-500/30">
      {/* Status Bar Indicator */}
      <div className="absolute top-8 left-0 right-0 flex justify-center opacity-30">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-widest font-mono">
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isOnline ? "Network Active" : "Offline / Airplane"}
        </div>
      </div>

      {/* Main Control Interface */}
      <div className="relative group flex flex-col items-center">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full scale-150 animate-pulse pointer-events-none" />
        
        {/* The Toggle Button (Hardware Style) */}
        <motion.button
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onClick={openAirplaneSettings}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative w-64 h-64 rounded-full flex items-center justify-center
            bg-gradient-to-br from-[#1c1d21] to-[#0f1012]
            border-[12px] border-[#1a1b1e]
            shadow-[20px_20px_60px_#0a0b0d,-20px_-20px_60px_#202125]
            transition-all duration-200 cursor-pointer
            ${isPressed ? 'shadow-inner' : ''}
          `}
        >
          {/* Inner Ring */}
          <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
          
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{
                rotate: isOnline ? 0 : 45,
                y: isPressed ? 4 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Plane 
                size={80} 
                className={`transition-colors duration-500 ${isOnline ? 'text-white/20' : 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]'}`} 
              />
            </motion.div>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/40 mb-1">Toggle System</span>
              <span className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${!isOnline ? 'text-orange-500' : 'text-white/80'}`}>
                {isAutoRedirecting ? "Launching..." : (isOnline ? "Normal" : "Airplane")}
              </span>
            </div>
          </div>

          {/* Screws / Industrial details */}
          {[0, 90, 180, 270].map((deg) => (
            <div 
              key={deg}
              className="absolute w-2 h-2 rounded-full bg-[#111] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),1px_1px_1px_rgba(255,255,255,0.05)]"
              style={{
                transform: `rotate(${deg}deg) translateY(-100px)`
              }}
            />
          ))}
        </motion.button>
      </div>

      {/* Footer Instructions */}
      <div className="mt-20 max-w-xs text-center space-y-6">
        <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <Info size={16} className="text-orange-500" />
          <p className="text-[11px] leading-relaxed font-medium uppercase tracking-wider">
            One tap launches system toggle.<br/>Designed for Android Home Screen use.
          </p>
        </div>

        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          {showInfo ? "Hide Help" : "Installation Guide"}
        </button>

        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4"
            >
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 text-left">
                <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-3">
                  <Smartphone size={12} /> Android Integration
                </h4>
                <ol className="space-y-3 text-[10px] text-white/60 uppercase tracking-wide leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-orange-500 font-bold">01.</span>
                    Tap the Browser Menu (⋮).
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500 font-bold">02.</span>
                    Select "Add to Home Screen".
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500 font-bold">03.</span>
                    Launch this icon for instant Airplane Mode access.
                  </li>
                </ol>
              </div>
              <p className="text-[9px] text-white/30 uppercase leading-relaxed px-2">
                Note: Modern Android security prevents 3rd party apps from toggling wireless radios silently. This tool provides the fastest possible path to the system switch.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-4 text-[9px] text-white/10 uppercase tracking-[0.5em] font-mono select-none">
        System Logic v4.11 // Protected Circuit
      </div>
    </div>
  );
}
