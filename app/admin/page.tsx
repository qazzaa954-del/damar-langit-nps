'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { Languages, RefreshCw, Filter, X, TrendingUp, Phone, Printer, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { OUTLETS } from '@/utils/outlets'

// Update Tipe Data (Tambah Phone, Outlet)
type Submission = { 
  id: number; 
  score: number; 
  feedback: string; 
  phone: string; 
  created_at: string;
  outlet?: string;
  outlet_name?: string;
  barcode?: string;
}

type SortField = 'score' | 'phone' | 'feedback' | 'created_at' | 'outlet_name'
type SortDirection = 'asc' | 'desc' | null

export default function AdminPage() {
  const [data, setData] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStar, setFilterStar] = useState<number | 'all'>('all')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const fetchData = async () => {
    setLoading(true)
    const { data: submissions } = await supabase
      .from('nps_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (submissions) setData(submissions)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  // Fungsi Print
  const handlePrint = () => {
    window.print()
  }

  // Filter by outlet
  const outletFilteredData = activeTab === 'all' 
    ? data 
    : data.filter(item => item.outlet === activeTab || item.barcode === activeTab)
  
  // Filter by star
  const filteredData = filterStar === 'all' 
    ? outletFilteredData 
    : outletFilteredData.filter(item => item.score === filterStar)
  
  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0
    
    let aVal: any = a[sortField]
    let bVal: any = b[sortField]
    
    if (sortField === 'created_at') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else if (sortField === 'score') {
      aVal = Number(aVal)
      bVal = Number(bVal)
    } else {
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })
  
  const chartData = [...outletFilteredData].reverse().slice(-15).map((item, index) => ({ name: `G${index}`, score: item.score }))
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-slate-400" />
    if (sortDirection === 'asc') return <ArrowUp size={14} className="text-emerald-600" />
    if (sortDirection === 'desc') return <ArrowDown size={14} className="text-emerald-600" />
    return <ArrowUpDown size={14} className="text-slate-400" />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-8">
      
      {/* CSS KHUSUS PRINT (Menyembunyikan tombol saat nge-print) */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-only-table { width: 100%; border: 1px solid #ddd; }
          body { background: white; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header (Logo + Tombol) */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 bg-emerald-50 p-2 rounded-xl">
               <Image src="/logo-damar.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-950">Executive Dashboard</h1>
              <p className="text-slate-500 text-sm">Multi-Outlet NPS Insights</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-sm font-bold">
              <Printer size={16} /> Print Data
            </button>
            <button onClick={fetchData} className="px-5 py-2.5 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 transition flex items-center gap-2 text-sm font-medium">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </header>

        {/* --- GRAFIK (Disembunyikan saat Print) --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
          <h3 className="font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600"/> Tren Kepuasan Tamu
          </h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TABS OUTLET (Disembunyikan saat Print) --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
          <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">Filter Outlet</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('all')} 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === 'all' 
                  ? 'bg-emerald-900 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Outlet
            </button>
            {OUTLETS.map((outlet) => (
              <button 
                key={outlet.id}
                onClick={() => setActiveTab(outlet.id)} 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                  activeTab === outlet.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {outlet.displayName}
              </button>
            ))}
          </div>
        </div>

        {/* --- FILTER (Disembunyikan saat Print) --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2"><Filter size={18}/> Filter Score</h3>
            {filterStar !== 'all' && (
              <button onClick={() => setFilterStar('all')} className="text-xs flex items-center gap-1 text-red-500 font-bold hover:underline"><X size={14}/> Reset</button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterStar('all')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filterStar === 'all' ? 'bg-emerald-900 text-white' : 'bg-slate-100'}`}>Semua</button>
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((num) => (
              <button key={num} onClick={() => setFilterStar(num)} className={`px-3 py-2 rounded-lg text-sm font-bold border ${filterStar === num ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white'}`}>★ {num}</button>
            ))}
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print-only-table">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Laporan Data Tamu</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">{sortedData.length} Data</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th 
                    className="p-5 cursor-pointer hover:bg-slate-100 transition select-none"
                    onClick={() => handleSort('outlet_name')}
                  >
                    <div className="flex items-center gap-2">
                      Outlet
                      {getSortIcon('outlet_name')}
                    </div>
                  </th>
                  <th 
                    className="p-5 cursor-pointer hover:bg-slate-100 transition select-none"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center gap-2">
                      Score
                      {getSortIcon('score')}
                    </div>
                  </th>
                  <th 
                    className="p-5 cursor-pointer hover:bg-slate-100 transition select-none"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center gap-2">
                      Phone (WA)
                      {getSortIcon('phone')}
                    </div>
                  </th>
                  <th 
                    className="p-5 w-1/3 cursor-pointer hover:bg-slate-100 transition select-none"
                    onClick={() => handleSort('feedback')}
                  >
                    <div className="flex items-center gap-2">
                      Feedback
                      {getSortIcon('feedback')}
                    </div>
                  </th>
                  <th className="p-5 no-print">Action</th>
                  <th 
                    className="p-5 cursor-pointer hover:bg-slate-100 transition select-none"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/50 transition">
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">{item.outlet_name || item.outlet || '-'}</span>
                        {item.barcode && (
                          <span className="text-xs text-slate-400">Barcode: {item.barcode}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${item.score>=9?'bg-emerald-100 text-emerald-700':item.score<=6?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>
                        {item.score}
                      </span>
                    </td>
                    <td className="p-5 font-medium text-slate-700">
                      {item.phone ? (
                        <div className="flex items-center gap-2">
                           <Phone size={14} className="text-emerald-600"/> {item.phone}
                        </div>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="p-5 text-slate-700">{item.feedback || "-"}</td>
                    <td className="p-5 no-print">
                      {item.feedback && (
                        <a href={`https://translate.google.com/?sl=auto&tl=id&text=${encodeURIComponent(item.feedback)}&op=translate`} target="_blank" className="text-indigo-600 font-bold text-xs flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded w-fit">
                          <Languages size={12}/> Translate
                        </a>
                      )}
                    </td>
                    <td className="p-5 text-slate-400 text-xs">{new Date(item.created_at).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}