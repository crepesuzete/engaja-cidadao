import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Building2, UserCircle, Landmark, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon, BadgeCheck, Star, Users } from 'lucide-react';

// IMAGENS DEFINIDAS PELO USUÁRIO
const HERO_IMAGE_DESKTOP = "https://i.imgur.com/kzdVI0C.png"; // PC
const HERO_IMAGE_MOBILE = "https://i.imgur.com/ZZEPLhN.png"; // Mobile - Foto Horizontal

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accessCode: '', // For Gov roles
    partyOrDept: '' // Party for Legislative, Dept for Executive
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData({ name: '', email: '', accessCode: '', partyOrDept: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Mock Validation
    if ((selectedRole === UserRole.EXECUTIVE || selectedRole === UserRole.LEGISLATIVE) && formData.accessCode !== '1234') {
      alert("Código de acesso inválido! (Dica: use 1234)");
      return;
    }

    // Create User Object
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      points: selectedRole === UserRole.CITIZEN ? 100 : 0, // Citizens start with points
      level: 1,
      role: selectedRole || UserRole.CITIZEN,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`,
      badges: [],
      recentActivity: [],
      department: selectedRole === UserRole.EXECUTIVE ? formData.partyOrDept : undefined,
      party: selectedRole === UserRole.LEGISLATIVE ? formData.partyOrDept : undefined
    };

    onLogin(newUser);
  };

  // --- SELEÇÃO DE PERFIL (LANDING) ---
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row animate-fade-in overflow-hidden">
        
        {/* LADO ESQUERDO - IMAGEM HERO (POSTER) */}
        {/* Mobile: h-64 define altura do banner. object-contain garante que a arte horizontal apareça inteira sem cortes. */}
        <div className="lg:w-1/2 relative bg-white h-64 lg:h-auto shrink-0 overflow-hidden border-r border-slate-200">
           {/* IMAGEM MOBILE */}
           <img 
             src={HERO_IMAGE_MOBILE} 
             alt="Engaja Cidadão Capa Mobile" 
             className="absolute inset-0 w-full h-full object-contain object-center lg:hidden"
           />
           {/* IMAGEM DESKTOP */}
           <img 
             src={HERO_IMAGE_DESKTOP} 
             alt="Engaja Cidadão Capa Desktop" 
             className="absolute inset-0 w-full h-full object-cover object-top hidden lg:block"
           />
        </div>

        {/* LADO DIREITO - SELEÇÃO DE PERFIL */}
        <div className="lg:w-1/2 flex flex-col items-center justify-start p-6 pt-10 lg:p-12 lg:pt-24 overflow-y-auto bg-slate-50">
          <div className="w-full max-w-md space-y-8">
            
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bem-vindo</h2>
              <p className="text-slate-500 mt-2 text-base">Selecione seu perfil para acessar o sistema.</p>
            </div>

            <div className="space-y-4">
              {/* Card Cidadão */}
              <button 
                onClick={() => handleRoleSelect(UserRole.CITIZEN)}
                className="w-full group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-emerald-100 hover:shadow-xl transition-all text-left relative overflow-hidden flex items-start gap-5"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
                  <UserCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Sou Cidadão</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-2 leading-relaxed">
                    Reporte problemas, ganhe recompensas e vote em melhorias.
                  </p>
                  <div className="flex items-center text-emerald-600 text-xs font-bold">
                    Entrar <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Card Executivo */}
              <button 
                onClick={() => handleRoleSelect(UserRole.EXECUTIVE)}
                className="w-full group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-blue-100 hover:shadow-xl transition-all text-left relative overflow-hidden flex items-start gap-5"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Gestão Pública</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-2 leading-relaxed">
                    Prefeitura e Secretarias: Gerencie demandas e obras.
                  </p>
                  <div className="flex items-center text-blue-600 text-xs font-bold">
                    Acesso Corporativo <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Card Legislativo */}
              <button 
                onClick={() => handleRoleSelect(UserRole.LEGISLATIVE)}
                className="w-full group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-purple-100 hover:shadow-xl transition-all text-left relative overflow-hidden flex items-start gap-5"
              >
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shrink-0">
                  <Landmark className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Legislativo</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-2 leading-relaxed">
                    Vereadores: Acompanhe projetos de lei e tramitações.
                  </p>
                  <div className="flex items-center text-purple-600 text-xs font-bold">
                    Acesso Parlamentar <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
            
            <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
               <p>© 2025 Engaja Cidadão. Tecnologia cívica open-source.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FORM VIEW ---

  const isGov = selectedRole !== UserRole.CITIZEN;
  const themeColor = selectedRole === UserRole.CITIZEN ? 'emerald' : selectedRole === UserRole.EXECUTIVE ? 'blue' : 'purple';
  const roleTitle = selectedRole === UserRole.CITIZEN ? 'Acesso Cidadão' : selectedRole === UserRole.EXECUTIVE ? 'Portal do Executivo' : 'Portal Legislativo';

  // Configuração de Estilo Baseado no Tema
  const bgGradient = selectedRole === UserRole.CITIZEN ? 'from-emerald-600 to-emerald-800' : 
                     selectedRole === UserRole.EXECUTIVE ? 'from-blue-600 to-blue-800' : 'from-purple-600 to-purple-800';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-slide-up relative overflow-hidden">
      
      {/* Background Decorativo (Blurred) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src={HERO_IMAGE_DESKTOP} className="w-full h-full object-cover blur-3xl scale-110" />
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative z-10">
        
        {/* Header with Back Button */}
        <div className={`p-8 bg-gradient-to-br ${bgGradient} text-white relative`}>
          <button onClick={() => setSelectedRole(null)} className="absolute top-6 left-6 text-white/80 hover:text-white font-bold text-xs flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md transition-all hover:bg-white/20">
             ← Voltar
          </button>
          
          <div className="mt-6 flex flex-col items-center">
             <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 shadow-inner ring-1 ring-white/30">
                {selectedRole === UserRole.CITIZEN && <UserCircle className="w-10 h-10 text-white" />}
                {selectedRole === UserRole.EXECUTIVE && <Building2 className="w-10 h-10 text-white" />}
                {selectedRole === UserRole.LEGISLATIVE && <Landmark className="w-10 h-10 text-white" />}
             </div>
             <h2 className="text-2xl font-bold tracking-tight">{roleTitle}</h2>
             <p className="text-white/80 text-sm mt-1 font-medium">Preencha seus dados para conectar.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Nome Completo</label>
            <div className="relative group">
              <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <input 
                type="text" 
                required
                className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all font-medium text-slate-800"
                placeholder="Seu nome"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <input 
                type="email" 
                required
                className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all font-medium text-slate-800"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {isGov && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
                  {selectedRole === UserRole.EXECUTIVE ? 'Secretaria / Departamento' : 'Partido Político'}
                </label>
                <div className="relative group">
                  <BadgeCheck className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all font-medium text-slate-800"
                    placeholder={selectedRole === UserRole.EXECUTIVE ? "Ex: Saúde, Obras..." : "Ex: PV, MDB..."}
                    value={formData.partyOrDept}
                    onChange={e => setFormData({...formData, partyOrDept: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Código de Acesso</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-10 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all font-medium text-slate-800"
                    placeholder="••••"
                    value={formData.accessCode}
                    onChange={e => setFormData({...formData, accessCode: e.target.value})}
                  />
                </div>
                {/* AUTO-FILL BUTTON FOR DEMO */}
                <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">
                  *Para demonstração use: 
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, accessCode: '1234'})}
                    className="ml-1 text-blue-600 hover:underline font-bold"
                  >
                    1234 (Clique para preencher)
                  </button>
                </p>
              </div>
            </>
          )}

          <div className="pt-2">
            <button 
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2
                ${selectedRole === UserRole.CITIZEN ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 
                    selectedRole === UserRole.EXECUTIVE ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 
                    'bg-purple-600 hover:bg-purple-700 shadow-purple-200'}`}
            >
                {isGov ? 'Acessar Sistema' : 'Criar Conta Grátis'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;