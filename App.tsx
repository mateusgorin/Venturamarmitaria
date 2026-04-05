
import React, { useState, useCallback, useEffect } from 'react';
import { Tab } from './types';
import { BUSINESS } from './constants';
import { 
  ShoppingBag, 
  Phone, 
  Instagram, 
  MapPin, 
  ArrowLeft,
  X,
  Clock,
  Download,
  Share,
  PlusSquare
} from 'lucide-react';

// Tile Button Component
const ActionTile: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  onClick: () => void;
  className?: string;
}> = ({ icon, title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="group tile-active aspect-square bg-[#1f2937]/95 rounded-[36px] lg:rounded-[44px] flex flex-col items-center justify-center text-center p-3.5 lg:p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] tile-shadow border border-white/10 hover:scale-[1.04] hover:bg-[#2d3748] hover:border-white/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] will-change-transform transform-gpu"
  >
    <div className="text-white mb-2.5 lg:mb-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 will-change-transform">
      {icon}
    </div>
    <span className="text-white font-extrabold text-[11px] lg:text-[13px] tracking-[0.1em] mb-1">{title}</span>
    <span className="text-gray-400 text-[8px] lg:text-[9px] font-semibold tracking-wider uppercase transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-gray-300">{subtitle}</span>
  </button>
);

// Animated Status Badge
const OpenStatus: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1-5 is Mon-Fri
      const hour = now.getHours();
      const min = now.getMinutes();
      const currentTime = hour + min / 60;
      
      // Business Hours: Mon-Fri, 09:00 - 13:50
      const isWeekday = day >= 1 && day <= 5;
      const isWorkingHours = currentTime >= 9 && currentTime <= 13.833; // 13:50 is 13 + 50/60
      setIsOpen(isWeekday && isWorkingHours);
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-700 backdrop-blur-xl ${
        isOpen 
          ? 'bg-green-50/40 border-green-200/50 text-green-600 shadow-[0_0_25px_rgba(34,197,94,0.1)]' 
          : 'bg-red-50/30 border-red-200/40 text-red-500 shadow-[0_0_25px_rgba(239,68,68,0.1)]'
      }`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em]">
          {isOpen ? 'Aberto Agora' : 'Fechado Agora'}
        </span>
      </div>
      {!isOpen && (
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400/70 uppercase tracking-widest">
          <Clock size={10} />
          <span>Seg a Sex • 09:00 às 13:50</span>
        </div>
      )}
    </div>
  );
};

// Home Screen
const HomeScreen: React.FC<{ onTabChange: (tab: Tab) => void }> = ({ onTabChange }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Detect if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(standalone);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const openWhatsApp = () => window.open(BUSINESS.whatsapp, '_blank');
  const openInstagram = () => window.open(BUSINESS.instagram, '_blank');
  const openMaps = () => window.open(BUSINESS.mapsUrl, '_blank');

  return (
    <div className="flex flex-col items-center min-h-screen px-8 pb-12 pt-12 lg:max-w-6xl lg:mx-auto lg:pt-20">
      
      <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:items-start lg:gap-24 lg:w-full">
        {/* Left Column: Brand & Logo */}
        <div className="flex flex-col items-center lg:w-2/5">
          {/* iOS Install Instruction */}
          {isIOS && !isStandalone && (
            <div className="w-full max-w-sm mb-10 bg-white/80 backdrop-blur-md border border-pink-100 p-6 rounded-3xl shadow-xl shadow-pink-500/5 animate-bounce-subtle">
              <div className="flex items-start gap-4">
                <div className="bg-pink-50 p-3 rounded-2xl text-pink-500">
                  <Download size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-800 mb-2">Instalar no iPhone</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    Toque no ícone <span className="inline-flex items-center mx-1 text-pink-500"><Share size={14} /></span> 
                    depois em <span className="inline-flex items-center mx-1 text-pink-500"><PlusSquare size={14} /></span> 
                    <span className="font-bold">"Adicionar à Tela de Início"</span> para ter o app.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PWA Install Button (Android/Desktop) */}
          {showInstallBtn && (
            <button 
              onClick={handleInstallClick}
              className="w-full max-w-sm mb-10 bg-pink-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-pink-500/20 active:scale-95 transition-all duration-300 group"
            >
              <Download size={20} className="group-hover:bounce" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Instalar Aplicativo</span>
            </button>
          )}

          {/* Circle Logo */}
          <div className="relative mb-10 lg:mb-12">
            <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full border-[8px] border-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] flex items-center justify-center bg-[#1f2937] group transition-transform duration-700 hover:scale-105 overflow-hidden">
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src={BUSINESS.logoUrl} 
                  alt="Logo Marmitaria Ventura" 
                  className="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-125"
                />
                <div className="shine-overlay" />
              </div>
            </div>
          </div>

          {/* Brand Header */}
          <div className="text-center w-full max-w-xs relative">
            <h1 className="font-serif font-normal text-[76px] lg:text-[84px] text-[#0f172a] leading-none mb-1 drop-shadow-sm select-none">Ventura</h1>
            <h2 className="text-[#ec4899] font-black text-[13px] lg:text-[15px] tracking-[0.45em] uppercase mb-5 opacity-100 select-none">Marmitaria</h2>
            
            <OpenStatus />

            <p className="text-gray-500 text-[10px] lg:text-[12px] font-bold tracking-[0.3em] uppercase mb-8 lg:mb-10 select-none">Comida caseira de qualidade</p>

            {/* Branding Info */}
            <div className="text-center w-full">
              <div className="text-[8px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] mb-4 leading-relaxed">
                <p>Marmitaria Ventura - Marmita da Lu</p>
                <p>CNPJ 30.278.268/0001-50</p>
              </div>
              <p className="text-[9px] lg:text-[11px] text-gray-400 font-bold uppercase tracking-[0.25em] mb-1">Desenvolvido por</p>
              <a 
                href="https://www.gorinsolucoes.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] lg:text-[13px] text-gray-500 font-extrabold tracking-widest uppercase hover:text-pink-400/80 transition-colors duration-300"
              >
                Gorin Soluções
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Info */}
        <div className="flex flex-col items-center lg:items-start lg:w-3/5">
          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-5 lg:gap-7 w-full max-w-[345px] lg:max-w-[460px] mb-14 lg:mb-10">
            <ActionTile 
              icon={<ShoppingBag className="w-7 h-7 lg:w-11 lg:h-11" strokeWidth={1.5} />} 
              title="CARDÁPIO" 
              subtitle="FAZER PEDIDO" 
              onClick={() => onTabChange(Tab.MENU)} 
            />
            <ActionTile 
              icon={<Phone className="w-7 h-7 lg:w-11 lg:h-11" strokeWidth={1.5} />} 
              title="WHATSAPP" 
              subtitle="FALE CONOSCO" 
              onClick={openWhatsApp} 
            />
            <ActionTile 
              icon={<Instagram className="w-7 h-7 lg:w-11 lg:h-11" strokeWidth={1.5} />} 
              title="INSTAGRAM" 
              subtitle="SIGA-NOS" 
              onClick={openInstagram} 
            />
            <ActionTile 
              icon={<MapPin className="w-7 h-7 lg:w-11 lg:h-11" strokeWidth={1.5} />} 
              title="ENDEREÇO" 
              subtitle="COMO CHEGAR" 
              onClick={openMaps} 
            />
          </div>

          {/* Business Info Section */}
          <div className="w-full max-w-sm lg:max-w-xl flex flex-col gap-6 mb-16 lg:mb-0 px-4 lg:px-0">
            <div className="h-px bg-black/5 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { icon: "📍", text: "Samambaia, DF" },
                { icon: "🥡", text: "Take away, retirada na loja" },
                { icon: "🛵", text: "Delivery disponível" },
                { icon: "🕘", text: "Atendimento: segunda a sexta, das 9h às 13h30" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <span className="text-xl lg:text-2xl transition-transform duration-500 group-hover:scale-110">{item.icon}</span>
                  <span className="text-[10px] lg:text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order View (Iframe)
const OrderScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="fixed inset-0 bg-white z-[100] flex flex-col fade-in">
    <div className="h-16 px-6 flex items-center border-b border-gray-100 bg-white shadow-sm">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-black transition-all"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
        <span className="text-[11px] font-black uppercase tracking-widest">Início</span>
      </button>
    </div>
    <div className="flex-1 relative bg-gray-50">
      <iframe 
        src={BUSINESS.orderUrl}
        className="absolute inset-0 w-full h-full border-none"
        title="Plataforma de Pedidos"
      />
    </div>
  </div>
);

// Main Controller
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);

  return (
    <div className="min-h-screen relative">
      {activeTab === Tab.HOME && (
        <HomeScreen onTabChange={setActiveTab} />
      )}
      
      {activeTab === Tab.MENU && (
        <OrderScreen onBack={() => setActiveTab(Tab.HOME)} />
      )}
    </div>
  );
};

export default App;
