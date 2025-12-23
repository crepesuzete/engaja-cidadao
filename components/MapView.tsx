import React, { useState, useEffect, useRef } from 'react';
import { Issue, IssueCategory, IssueStatus } from '../types';
import { 
  Plus, Loader2, 
  Construction, Stethoscope, GraduationCap, TreePine, 
  ShieldAlert, Bus, Theater, Users, LayoutGrid, CheckCircle2, AlertCircle, Filter 
} from 'lucide-react';

// Declaration for Leaflet attached to window via CDN
declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  issues: Issue[];
  onAddIssue: () => void;
  onUpdateLocation: (id: string, lat: number, lng: number) => void;
  onDeleteIssue: (id: string) => void;
  onEditIssue: (issue: Issue) => void;
  onViewDetails: (issue: Issue) => void; 
  currentCity: string;
}

// 1. Mapping for React Components (UI Buttons - Filters)
const CATEGORY_UI_ICONS: Record<string, React.ElementType> = {
  [IssueCategory.INFRAESTRUTURA]: Construction,
  [IssueCategory.SAUDE]: Stethoscope,
  [IssueCategory.EDUCACAO]: GraduationCap,
  [IssueCategory.MEIO_AMBIENTE]: TreePine,
  [IssueCategory.SEGURANCA]: ShieldAlert,
  [IssueCategory.MOBILIDADE]: Bus,
  [IssueCategory.CULTURA]: Theater,
  [IssueCategory.ASSISTENCIA_SOCIAL]: Users
};

// 2. Robust SVG Generator for Leaflet - NORMALIZED MAPPING
const getCategoryIconSVG = (category: string) => {
  const strokeColor = "white";
  const strokeWidth = "2";
  
  // Normalize
  const normalizedCat = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // INFRAESTRUTURA
  if (normalizedCat.includes('infra')) {
     return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
  }
  // SAUDE
  if (normalizedCat.includes('saude')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v6"/><path d="M11 3v5"/><path d="M6 3v5"/><circle cx="12" cy="10" r="3"/></svg>`;
  }
  // EDUCACAO
  if (normalizedCat.includes('educacao')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
  }
  // MEIO AMBIENTE
  if (normalizedCat.includes('meio') || normalizedCat.includes('ambiente')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 5.3-2.1"/><path d="M7 16v6"/><path d="M13 16v-2.3a8.9 8.9 0 1 1-12.8-4"/></svg>`;
  }
  // SEGURANCA
  if (normalizedCat.includes('seguranca')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;
  }
  // MOBILIDADE
  if (normalizedCat.includes('mobilidade')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;
  }
  // CULTURA
  if (normalizedCat.includes('cultura')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
  }
  // ASSISTENCIA SOCIAL
  if (normalizedCat.includes('assistencia') || normalizedCat.includes('social')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  }

  // Fallback (Circle)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
};

const MapView: React.FC<MapViewProps> = ({ 
  issues, 
  onAddIssue, 
  onUpdateLocation, 
  onDeleteIssue, 
  onEditIssue,
  onViewDetails, 
  currentCity 
}) => {
  const [activeCategory, setActiveCategory] = useState<IssueCategory | 'ALL'>('ALL');
  const [activeStatus, setActiveStatus] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL'); // NEW Status Filter
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  // Function to cycle status status (Single button logic)
  const cycleStatus = () => {
    if (activeStatus === 'ALL') setActiveStatus('OPEN');
    else if (activeStatus === 'OPEN') setActiveStatus('RESOLVED');
    else setActiveStatus('ALL');
  };

  const getStatusLabel = () => {
    if (activeStatus === 'ALL') return 'Status: Tudo';
    if (activeStatus === 'OPEN') return 'Pendentes';
    if (activeStatus === 'RESOLVED') return 'Resolvidas';
    return '';
  };

  const getStatusIcon = () => {
     if (activeStatus === 'ALL') return Filter;
     if (activeStatus === 'OPEN') return AlertCircle;
     if (activeStatus === 'RESOLVED') return CheckCircle2;
     return Filter;
  };

  const StatusIcon = getStatusIcon();

  // 1. Initialize Map & Geocode City
  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    // Destroy existing map if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const initMap = async () => {
      setIsLoadingMap(true);
      let lat = -23.5505; // Default SP
      let lon = -46.6333;

      try {
        // Geocoding via Nominatim
        const query = encodeURIComponent(`${currentCity}, Brasil`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
        }
      } catch (e) {
        console.error("Geocoding failed, using default", e);
      }

      // Initialize Leaflet
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false, 
        attributionControl: false
      }).setView([lat, lon], 14);

      // Add OpenStreetMap Tile Layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setIsLoadingMap(false);
    };

    initMap();

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentCity]);

  // 2. Update Markers when Issues or Filter changes
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // --- APPLY FILTERS ---
    const filteredIssues = issues.filter(i => {
      // Filter 1: Category
      const categoryMatch = activeCategory === 'ALL' || i.category === activeCategory;
      
      // Filter 2: Status
      let statusMatch = true;
      if (activeStatus === 'RESOLVED') {
        statusMatch = i.status === IssueStatus.RESOLVIDA;
      } else if (activeStatus === 'OPEN') {
        statusMatch = i.status !== IssueStatus.RESOLVIDA;
      }

      return categoryMatch && statusMatch;
    });

    // Get Map Center
    const center = mapRef.current.getCenter();

    filteredIssues.forEach((issue) => {
      // Logic: Use stored lat/lng if available. 
      let pinLat = issue.location.lat;
      let pinLng = issue.location.lng;

      if (!pinLat || !pinLng) {
         const seed = issue.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
         const pseudoRandom1 = Math.sin(seed * 9999) - Math.floor(Math.sin(seed * 9999)); 
         const pseudoRandom2 = Math.cos(seed * 9999) - Math.floor(Math.cos(seed * 9999));
         
         // Offset from center
         pinLat = center.lat + (pseudoRandom1 * 0.03); 
         pinLng = center.lng + (pseudoRandom2 * 0.03);
      }

      // Define Color based on Status (Urgency/Resolution)
      const colorClass = issue.status === IssueStatus.RESOLVIDA ? 'bg-emerald-500' : 
                         issue.status === IssueStatus.ANALISE ? 'bg-amber-500' : 'bg-red-500';
      const colorHex = issue.status === IssueStatus.RESOLVIDA ? '#10b981' : 
                       issue.status === IssueStatus.ANALISE ? '#f59e0b' : '#ef4444';

      // Get Icon based on Category (Normalized Check)
      const categoryIconSVG = getCategoryIconSVG(issue.category);

      // Custom Icon HTML
      const iconHtml = `
        <div class="relative group cursor-pointer">
           <div class="w-10 h-10 ${colorClass} rounded-full border-[3px] border-white shadow-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
              ${categoryIconSVG}
           </div>
           <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 ${colorClass} rotate-45 border-r border-b border-white"></div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 42],
        popupAnchor: [0, -42]
      });

      // Custom Popup HTML Content
      const popupContent = `
        <div class="font-sans">
           <div class="h-1.5 w-full ${colorClass}"></div>
           <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                 <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    ${issue.category}
                 </span>
                 <span class="text-[9px] bg-slate-100 text-slate-500 px-1 rounded">Arraste para mover</span>
              </div>
              <h3 class="text-sm font-bold text-slate-800 leading-snug mb-2">${issue.title}</h3>
              <p class="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">${issue.description}</p>
              
              <div class="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                 <button id="btn-details-${issue.id}" class="flex-1 text-xs font-bold text-white py-2 rounded shadow-sm hover:opacity-90 transition-colors" style="background-color: ${colorHex}">
                    Ver Detalhes & Apoiar
                 </button>
              </div>
              <div class="flex items-center justify-between pt-2 gap-2">
                 <button id="btn-edit-${issue.id}" class="flex-1 text-[10px] text-slate-500 bg-slate-100 py-1.5 rounded hover:bg-slate-200 transition-colors">
                    Editar
                 </button>
                 <button id="btn-delete-${issue.id}" class="flex-1 text-[10px] text-red-500 bg-red-50 py-1.5 rounded hover:bg-red-100 transition-colors">
                    Excluir
                 </button>
              </div>
           </div>
        </div>
      `;

      // Create Marker (Draggable)
      const marker = window.L.marker([pinLat, pinLng], { 
          icon: customIcon,
          draggable: true 
      }).addTo(mapRef.current).bindPopup(popupContent);

      // Event: Drag End
      marker.on('dragend', (event: any) => {
         const { lat, lng } = event.target.getLatLng();
         onUpdateLocation(issue.id, lat, lng);
      });

      // Event: Popup Open
      marker.on('popupopen', () => {
         const detailsBtn = document.getElementById(`btn-details-${issue.id}`);
         if (detailsBtn) {
            detailsBtn.onclick = (e) => {
               e.stopPropagation();
               marker.closePopup();
               onViewDetails(issue); // Opens the side panel
            };
         }

         const editBtn = document.getElementById(`btn-edit-${issue.id}`);
         if (editBtn) {
            editBtn.onclick = (e) => {
               e.stopPropagation();
               marker.closePopup();
               onEditIssue(issue);
            };
         }

         const deleteBtn = document.getElementById(`btn-delete-${issue.id}`);
         if (deleteBtn) {
            deleteBtn.onclick = (e) => {
               e.stopPropagation();
               marker.closePopup();
               onDeleteIssue(issue.id);
            };
         }
      });

      markersRef.current.push(marker);
    });

  }, [issues, activeCategory, activeStatus]); 

  return (
    <div className="relative w-full h-full bg-slate-200 overflow-hidden">
      
      {/* Real Map Container */}
      <div id="map" ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Loading Overlay */}
      {isLoadingMap && (
        <div className="absolute inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
          <p className="text-sm text-slate-500 font-medium">Carregando mapa de {currentCity}...</p>
        </div>
      )}

      {/* --- TOP CONTROL SECTION --- */}
      
      {/* 1. Category Filter (Full Width Top) */}
      <div className="absolute top-2 left-0 right-0 z-10 pointer-events-none flex justify-center">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-100 pointer-events-auto flex gap-2 overflow-x-auto no-scrollbar items-center max-w-[95%]">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${activeCategory === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Todos
          </button>
          
          <div className="w-px h-4 bg-slate-300 mx-1 shrink-0"></div>

          {Object.values(IssueCategory).map(cat => {
             const IconComponent = CATEGORY_UI_ICONS[cat] || Construction;
             return (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-emerald-600'}`}
               >
                 <IconComponent className="w-3.5 h-3.5" />
                 {cat}
               </button>
             );
          })}
        </div>
      </div>

      {/* 2. Action Grid Row (List | Status | Add) */}
      <div className="absolute top-[4.5rem] left-[32vw] right-2 z-10 pointer-events-none flex gap-2">
         
         {/* Slot 1: List Button (Handled by IssueListSidebar.tsx externally, physically positioned at left-2) */}
         
         {/* Slot 2: Status Cycle Button (Middle) */}
         <button 
           onClick={cycleStatus}
           className={`pointer-events-auto flex-1 h-12 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 leading-none
             ${activeStatus === 'OPEN' ? 'border-red-200 bg-red-50 text-red-600' : 
               activeStatus === 'RESOLVED' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'text-slate-600'}`}
         >
           <StatusIcon className="w-4 h-4" />
           <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">{getStatusLabel()}</span>
         </button>

         {/* Slot 3: CTA Button (Right) */}
         <button 
          onClick={onAddIssue}
          className="pointer-events-auto flex-1 h-12 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-slate-900/30 transition-all active:scale-95 border-2 border-white/10 flex flex-col items-center justify-center gap-0.5 leading-none"
         >
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-emerald-100 leading-none">Clique aqui</span>
           <span className="text-[10px] sm:text-xs font-black whitespace-nowrap">Faça seu Pedido</span>
        </button>

      </div>

      {/* City Watermark */}
      <div className="absolute bottom-6 right-6 z-0 pointer-events-none opacity-50 hidden md:block">
         <h1 className="text-4xl font-black text-slate-900/10 tracking-tighter uppercase">{currentCity}</h1>
      </div>

    </div>
  );
};

export default MapView;