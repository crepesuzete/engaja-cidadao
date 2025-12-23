import React, { useState, useEffect } from 'react';
import { ArrowRight, Building2, Loader2, MapPin } from 'lucide-react';

interface LocationSelectorProps {
  onSelect: (state: string, city: string) => void;
}

interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect }) => {
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch States on Mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados", error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch Cities when State changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Erro ao buscar cidades", error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedState]);

  const handleConfirm = () => {
    if (selectedState && selectedCity) {
      onSelect(selectedState, selectedCity);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col items-center justify-center p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-slate-100 my-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Building2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo ao Engaja<span className="text-emerald-600">Cidadão</span></h1>
          <p className="text-slate-500 mt-2">Selecione sua cidade para visualizar o mapa real e as ações locais.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <div className="relative">
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all appearance-none"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
                disabled={loadingStates}
              >
                <option value="">{loadingStates ? 'Carregando...' : 'Selecione o Estado'}</option>
                {states.map(state => (
                  <option key={state.id} value={state.sigla}>{state.nome}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                {loadingStates ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-4 h-4 rotate-90" />}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
            <div className="relative">
               <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all disabled:opacity-50 appearance-none"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState || loadingCities}
              >
                <option value="">
                  {!selectedState 
                    ? 'Selecione um Estado primeiro' 
                    : loadingCities 
                      ? 'Carregando cidades...' 
                      : 'Selecione a Cidade'}
                </option>
                {cities.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                {loadingCities ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-4 h-4" />}
              </div>
            </div>
          </div>

          <button 
            onClick={handleConfirm}
            disabled={!selectedCity}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mt-6 transition-all transform active:scale-95 shadow-lg
              ${selectedCity 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            Acessar Mapa <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">Dados fornecidos por IBGE • Abrangência Nacional</p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;