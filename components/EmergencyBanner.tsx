import React from 'react';
import { EmergencyAlert } from '../types';
import { AlertTriangle, Phone, X } from 'lucide-react';

interface EmergencyBannerProps {
  alert: EmergencyAlert;
  onDismiss: () => void;
}

const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ alert, onDismiss }) => {
  if (!alert.active) return null;

  const getTheme = () => {
    switch (alert.level) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'WARNING':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className={`flex items-center justify-between px-3 h-full relative z-30 overflow-hidden md:w-[730px] md:flex-none flex-1 ${getTheme()}`}>
      
      {/* Icon & Text Area */}
      <div className="flex items-center gap-2.5 overflow-hidden flex-1">
        <div className="shrink-0 animate-pulse bg-white/20 p-1.5 rounded-md">
           <AlertTriangle className="w-4 h-4" />
        </div>
        
        <div className="flex flex-col min-w-0 justify-center">
          <span className="font-black uppercase tracking-wide text-[10px] leading-tight opacity-80 truncate">
            {alert.title}
          </span>
          <span className="font-bold text-xs leading-tight truncate">
            {alert.message}
          </span>
        </div>
      </div>

      {/* Action / Contact Area */}
      <div className="flex items-center gap-1 shrink-0 ml-2">
        {/* Phone Button: Hidden on mobile to save space, Expanded on desktop for readability */}
        {alert.contactInfo && (
          <a 
            href={`tel:${alert.contactInfo.replace(/\D/g,'')}`} 
            className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            title="Ligar para Emergência"
          >
             <Phone className="w-3.5 h-3.5 fill-current" />
             <span className="text-xs font-bold">{alert.contactInfo}</span>
          </a>
        )}
        
        <button 
          onClick={onDismiss}
          className="w-8 h-8 flex items-center justify-center hover:bg-black/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmergencyBanner;