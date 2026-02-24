
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
  Download
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
    className="group tile-active aspect-square bg-[#1f2937]/95 rounded-[40px] flex flex-col items-center justify-center text-center p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] tile-shadow border border-white/10 hover:scale-[1.04] hover:bg-[#2d3748] hover:border-white/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] will-change-transform transform-gpu"
  >
    <div className="text-white mb-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 will-change-transform">
      {icon}
    </div>
    <span className="text-white font-extrabold text-[12px] tracking-[0.1em] mb-1">{title}</span>
    <span className="text-gray-400 text-[9px] font-semibold tracking-wider uppercase transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-gray-300">{subtitle}</span>
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
      
      // Business Hours: Mon-Fri, 09:00 - 13:30
      const isWeekday = day >= 1 && day <= 5;
      const isWorkingHours = currentTime >= 9 && currentTime <= 13.5;
      setIsOpen(isWeekday && isWorkingHours);
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 mb-6 animate-in fade-in duration-1000">
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
          <span>Seg a Sex • 09:00 às 13:30</span>
        </div>
      )}
    </div>
  );
};

// Home Screen
const HomeScreen: React.FC<{ onTabChange: (tab: Tab) => void }> = ({ onTabChange }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
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
  const openMaps = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address)}`, '_blank');

  return (
    <div className="flex flex-col items-center min-h-screen px-8 pb-12 fade-in" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
      {/* PWA Install Button */}
      {showInstallBtn && (
        <button 
          onClick={handleInstallClick}
          className="w-full max-w-sm mb-10 bg-pink-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-pink-500/20 active:scale-95 transition-all duration-300 group"
        >
          <Download size={20} className="group-hover:bounce" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Instalar Aplicativo</span>
        </button>
      )}

      {/* Circle Logo with Charcoal Background and Contained Shine Effect */}
      <div className="relative mb-10">
        {/* Contêiner da Borda (Cor original branca) e Sombra */}
        <div className="w-56 h-56 rounded-full border-[8px] border-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] flex items-center justify-center bg-[#1f2937] group transition-transform duration-700 hover:scale-105 overflow-hidden">
          {/* Contêiner Interno de Recorte para o Brilho */}
          <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            <img 
              src={BUSINESS.logoUrl} 
              alt="Logo Marmitaria Ventura - Comida Caseira em Samambaia DF" 
              className="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-125"
            />
            {/* Efeito de Brilho Recortado pelo overflow-hidden do pai */}
            <div className="shine-overlay" />
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <div className="text-center w-full max-w-xs relative">
        <h1 className="font-serif font-normal text-[76px] text-[#0f172a] leading-none mb-1 drop-shadow-sm select-none">Ventura</h1>
        <h2 className="text-[#ec4899] font-black text-[13px] tracking-[0.45em] uppercase mb-5 opacity-100 select-none">Marmitaria</h2>
        
        {/* Animated Status */}
        <OpenStatus />

        <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-12 select-none">Comida caseira de qualidade</p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-sm mb-16">
        <ActionTile 
          icon={<ShoppingBag size={34} strokeWidth={1.5} />} 
          title="CARDÁPIO" 
          subtitle="FAZER PEDIDO" 
          onClick={() => onTabChange(Tab.MENU)} 
        />
        <ActionTile 
          icon={<Phone size={34} strokeWidth={1.5} />} 
          title="WHATSAPP" 
          subtitle="FALE CONOSCO" 
          onClick={openWhatsApp} 
        />
        <ActionTile 
          icon={<Instagram size={34} strokeWidth={1.5} />} 
          title="INSTAGRAM" 
          subtitle="SIGA-NOS" 
          onClick={openInstagram} 
        />
        <ActionTile 
          icon={<MapPin size={34} strokeWidth={1.5} />} 
          title="ENDEREÇO" 
          subtitle="COMO CHEGAR" 
          onClick={openMaps} 
        />
      </div>

      {/* Business Info Section */}
      <div className="w-full max-w-xs flex flex-col gap-6 mb-16 px-4">
        <div className="h-px bg-black/5 w-full" />
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: "📍", text: "Samambaia, DF" },
            { icon: "🥡", text: "Take away, retirada na loja" },
            { icon: "🛵", text: "Delivery disponível" },
            { icon: "🕘", text: "Atendimento: segunda a sexta, das 9h às 13h30" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <span className="text-xl transition-transform duration-500 group-hover:scale-110">{item.icon}</span>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] leading-relaxed">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto text-center py-4 px-4">
        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-4">
          Marmitaria Ventura - Marmita da Lu - CNPJ 30.278.268/0001-50
        </p>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.25em] mb-1">Desenvolvido por</p>
        <a 
          href="https://www.gorinsolucoes.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[11px] text-gray-600 font-extrabold tracking-widest uppercase hover:text-pink-400/80 transition-colors duration-300"
        >
          Gorin Soluções
        </a>
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
    <div className="min-h-screen max-w-lg mx-auto bg-transparent relative">
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
