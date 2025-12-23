import React from 'react';
import { Issue, IssueStatus, IssueCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Users, Download, Printer, FileText, Paperclip, Radio } from 'lucide-react';

interface AdminDashboardProps {
  issues: Issue[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ issues }) => {
  
  // Calculate stats
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === IssueStatus.RESOLVIDA).length;
  const inProgressIssues = issues.filter(i => i.status === IssueStatus.EXECUCAO || i.status === IssueStatus.ANALISE).length;
  
  // Prepare chart data
  const dataByCategory = Object.values(IssueCategory).map(cat => ({
    name: cat,
    count: issues.filter(i => i.category === cat).length
  })).filter(d => d.count > 0);

  const dataByStatus = [
    { name: 'Resolvida', value: resolvedIssues },
    { name: 'Em Andamento', value: inProgressIssues },
    { name: 'Registrada', value: totalIssues - resolvedIssues - inProgressIssues }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  // --- Handlers for Reports ---

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // 1. Define Headers
    const headers = ['ID', 'Data', 'Título', 'Categoria', 'Status', 'Descrição', 'Votos', 'Autor', 'Anexos'];
    
    // 2. Map Data
    const rows = issues.map(issue => [
        issue.id,
        new Date(issue.createdAt).toLocaleDateString(),
        `"${issue.title.replace(/"/g, '""')}"`, // Escape quotes for CSV
        issue.category,
        issue.status,
        `"${issue.description.replace(/"/g, '""')}"`,
        issue.votes,
        issue.authorId,
        issue.attachments?.length || 0
    ]);

    // 3. Create CSV Content
    const csvContent = [
        headers.join(','), 
        ...rows.map(r => r.join(','))
    ].join('\n');

    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_engaja_cidadao_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in print:p-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold text-slate-800">Painel de Gestão Urbana</h2>
             {/* LIVE INDICATOR */}
             <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-600 rounded-full border border-red-200 animate-pulse no-print">
               <Radio className="w-3 h-3" />
               <span className="text-[10px] font-bold uppercase tracking-wide">Ao Vivo</span>
             </div>
           </div>
           <p className="text-slate-500">Visão geral das demandas da cidade em tempo real.</p>
        </div>
        
        {/* Actions Buttons (Hidden on Print) */}
        <div className="flex items-center gap-3 no-print">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
               <Printer className="w-4 h-4" />
               Imprimir
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
               <Download className="w-4 h-4" />
               Exportar Dados (CSV)
            </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-black print:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Total Demandas</h3>
            <AlertTriangle className="text-blue-500 w-5 h-5 print:text-black" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalIssues}</p>
          <span className="text-xs text-green-600 font-medium no-print">+12% vs mês anterior</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-black print:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Resolvidas</h3>
            <CheckCircle className="text-green-500 w-5 h-5 print:text-black" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{resolvedIssues}</p>
          <span className="text-xs text-slate-400 font-medium">Taxa de resolução: {((resolvedIssues/totalIssues)*100).toFixed(0)}%</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-black print:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Em Análise</h3>
            <Clock className="text-amber-500 w-5 h-5 print:text-black" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{inProgressIssues}</p>
          <span className="text-xs text-amber-600 font-medium">Tempo médio: 3 dias</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-black print:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Engajamento</h3>
            <Users className="text-purple-500 w-5 h-5 print:text-black" />
          </div>
          <p className="text-3xl font-bold text-slate-900">1.2k</p>
          <span className="text-xs text-purple-600 font-medium">Cidadãos ativos hoje</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:break-inside-avoid">
        {/* Category Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-black print:shadow-none">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Demandas por Categoria</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-black print:shadow-none">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Status das Solicitações</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {dataByStatus.map((entry, index) => (
              <div key={index} className="flex items-center text-sm text-slate-600">
                <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index]}}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-black print:shadow-none print:break-before-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Últimas Solicitações</h3>
          <span className="text-xs text-slate-400 no-print">Visualizando 5 mais recentes</span>
        </div>
        <ul>
          {issues.slice(0, 10).map((issue, index) => (
            <li key={issue.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex justify-between items-center print:border-slate-200 ${index === 0 ? 'bg-emerald-50/30' : ''}`}>
              <div className="flex-1 min-w-0 pr-4">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 mb-1 inline-block print:border print:border-slate-300">
                  {issue.category}
                </span>
                <div className="flex items-center gap-2">
                   <h4 className="font-medium text-slate-900 truncate">{issue.title}</h4>
                   {issue.attachments && issue.attachments.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                        <Paperclip className="w-3 h-3" /> {issue.attachments.length}
                      </span>
                   )}
                   {/* NEW BADGE */}
                   {index === 0 && (
                     <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-sm font-bold animate-pulse">NOVO</span>
                   )}
                </div>
                <p className="text-sm text-slate-500 truncate max-w-md print:whitespace-normal">{issue.description}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">ID: {issue.id} • {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-right shrink-0">
                 <span className={`text-xs font-bold px-3 py-1 rounded-full print:border print:border-slate-300 ${
                   issue.status === IssueStatus.RESOLVIDA ? 'bg-green-100 text-green-700' :
                   issue.status === IssueStatus.EXECUCAO ? 'bg-blue-100 text-blue-700' :
                   'bg-amber-100 text-amber-700'
                 }`}>
                   {issue.status}
                 </span>
                 <p className="text-xs text-slate-400 mt-1">{issue.votes} votos</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Footer for Print */}
      <div className="hidden print:block text-center text-slate-400 text-xs mt-8 pt-4 border-t border-slate-200">
         <p>Relatório gerado automaticamente pelo sistema EngajaCidadão em {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;