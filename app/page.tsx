'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/utils/supabase/client'
import { Instagram, Globe, Send, CheckCircle2, Phone } from 'lucide-react'
import { OUTLETS, getOutletByBarcode, getOutletById, type Outlet } from '@/utils/outlets'

function HomeContent() {
  const searchParams = useSearchParams()
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [phone, setPhone] = useState('') // <-- State baru untuk No HP
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [outlet, setOutlet] = useState<Outlet | null>(null)

  // Deteksi outlet dari URL parameter (barcode atau outlet id)
  useEffect(() => {
    const barcode = searchParams.get('barcode')
    const outletId = searchParams.get('outlet')
    
    if (barcode) {
      const foundOutlet = getOutletByBarcode(barcode)
      if (foundOutlet) setOutlet(foundOutlet)
    } else if (outletId) {
      const foundOutlet = getOutletById(outletId)
      if (foundOutlet) setOutlet(foundOutlet)
    } else {
      // Default ke outlet pertama jika tidak ada parameter
      setOutlet(OUTLETS[0])
    }
  }, [searchParams])

  const socialLinks = {
    instagram: "https://www.instagram.com/damarlangitresort/",
    tiktok: "https://www.tiktok.com/@damarlangitresort",
    website: "https://damarlangit.com"
  }

  const submitNPS = async () => {
    if (score === null) return
    // Validasi: No HP Wajib Diisi
    if (!phone) return alert('Mohon isi Nomor WhatsApp/HP Anda.\nPlease enter your Phone Number.')
    if (!outlet) return alert('Outlet tidak ditemukan. Silakan scan barcode yang valid.')
    
    setStatus('loading')
    // Kirim data termasuk phone dan outlet
    const { error } = await supabase.from('nps_submissions').insert([{ 
      score, 
      feedback, 
      phone,
      outlet: outlet.id,
      outlet_name: outlet.displayName,
      barcode: outlet.barcode
    }])
    
    if (error) { alert('Error: ' + error.message); setStatus('idle') } 
    else { setStatus('success') }
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      
      {/* BACKGROUND GIF */}
      <div className="absolute inset-0 z-[-2] bg-cover bg-center bg-no-repeat scale-110 animate-slow-pan" style={{ backgroundImage: "url('https://i.gifer.com/7S7.gif')" }} />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-emerald-950/90 via-emerald-900/70 to-black/60 backdrop-blur-[2px]" />

      <div className="z-10 max-w-2xl w-full backdrop-blur-lg bg-black/20 border border-emerald-500/20 p-8 md:p-12 rounded-[2rem] shadow-2xl text-center relative mt-10">
        
        {/* Header Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 relative w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl filter brightness-110">
            <Image src="/logo-damar.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <h2 className="text-amber-400 tracking-[0.3em] text-xs font-bold uppercase mb-2 drop-shadow-md">
            {outlet?.displayName || 'Damar Langit Resort'}
          </h2>
          {outlet && (
            <p className="text-emerald-300/80 text-[10px] tracking-wider mt-1">
              Barcode: {outlet.barcode}
            </p>
          )}
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </div>

        {status === 'success' ? (
          <div className="animate-fade-in py-8 space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-full mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-serif text-white drop-shadow-lg">Thank You</h2>
              <p className="text-lg text-emerald-100">Terima Kasih</p>
              <p className="text-xl font-serif text-amber-400 mt-2">شكرًا لك</p>
            </div>
            <button onClick={() => window.location.reload()} className="mt-8 px-10 py-3 bg-white/5 hover:bg-white/10 rounded-full transition border border-white/20 text-sm tracking-widest uppercase hover:scale-105">
              Back / Kembali
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-10">
              <h1 className="text-3xl md:text-5xl font-serif leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-white drop-shadow-lg">
                How was your experience?
              </h1>
              <p className="text-emerald-100/90 text-sm md:text-base font-light drop-shadow-md">
                Bagaimana pengalaman kunjungan Anda?
              </p>
            </div>

            {/* Tombol Angka */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setScore(num)}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-xl font-bold transition-all duration-300 relative group border backdrop-blur-md
                    ${score === num 
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-500 text-black scale-110 shadow-[0_0_25px_rgba(245,158,11,0.8)]' 
                      : 'bg-black/30 border-white/10 text-emerald-100 hover:bg-emerald-900/50 hover:border-emerald-500/50 hover:scale-105'}
                  `}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Form Input (Muncul setelah pilih angka) */}
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${score !== null ? 'max-h-[800px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-10'}`}>
              
              {/* INPUT NO HP (BARU) */}
              <div className="bg-black/40 rounded-xl p-1 border border-white/10 mb-4 flex items-center px-4 backdrop-blur-md focus-within:border-amber-500/50 transition-colors">
                <Phone className="w-5 h-5 text-emerald-400 mr-3" />
                <input 
                  type="tel"
                  placeholder="WhatsApp Number / No. Handphone (Wajib)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-4 bg-transparent text-white placeholder-white/40 outline-none font-medium"
                />
              </div>

              {/* Input Feedback */}
              <div className="bg-gradient-to-b from-white/10 to-transparent rounded-2xl p-[1px] border border-white/10 shadow-inner mb-6 backdrop-blur-md">
                <textarea
                  placeholder="Tell us more... / Ceritakan lebih lanjut... / أخبرنا المزيد..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-5 bg-black/40 text-white placeholder-white/40 outline-none min-h-[100px] resize-none rounded-2xl focus:bg-black/60 transition-colors"
                />
              </div>
              
              <button
                onClick={submitNPS}
                disabled={status === 'loading'}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : <>Submit Feedback <Send size={18}/></>}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer Sosmed */}
      <div className="mt-12 flex items-center gap-6 z-10">
        <a href={socialLinks.instagram} target="_blank" className="p-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-full hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 hover:text-white transition hover:scale-110"><Instagram size={20} className="text-emerald-200" /></a>
        <a href={socialLinks.website} target="_blank" className="p-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-full hover:bg-emerald-500 hover:text-white transition hover:scale-110"><Globe size={20} className="text-emerald-200" /></a>
        <a href={socialLinks.tiktok} target="_blank" className="p-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-full hover:bg-black hover:text-white transition hover:scale-110">
           <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-200"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
        </a>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="text-white text-lg">Loading...</div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  )
}