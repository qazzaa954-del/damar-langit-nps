'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { OUTLETS } from '@/utils/outlets'
import { Download, Printer, Copy, Check } from 'lucide-react'

export default function BarcodesPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    // Get base URL (production atau development)
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadQR = (outletName: string, barcode: string) => {
    const svg = document.getElementById(`qr-${barcode}`)?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()

    img.onload = () => {
      if (ctx) {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = `${outletName.replace(/\s+/g, '-')}-${barcode}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 p-6 md:p-8">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .qr-card { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 no-print">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 bg-emerald-50 p-2 rounded-xl">
                <Image src="/logo-damar.png" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-950">Barcode Outlet</h1>
                <p className="text-slate-500 text-sm">QR Code untuk semua outlet</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handlePrint}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-sm font-bold"
              >
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        </header>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 no-print">
          <p className="text-sm text-blue-800">
            <strong>Petunjuk:</strong> Scan QR code dengan kamera smartphone untuk langsung mengarah ke halaman feedback outlet yang sesuai. 
            QR code ini bisa di-print dan ditempel di setiap outlet.
          </p>
        </div>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OUTLETS.map((outlet, index) => {
            const qrUrl = `${baseUrl}/?barcode=${outlet.barcode}`
            
            return (
              <div 
                key={outlet.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 qr-card"
              >
                {/* Outlet Info */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-emerald-900 mb-1">
                    {outlet.displayName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1 rounded inline-block">
                    {outlet.barcode}
                  </p>
                </div>

                {/* QR Code */}
                <div 
                  id={`qr-${outlet.barcode}`}
                  className="flex justify-center mb-4 p-4 bg-white rounded-lg border-2 border-slate-200"
                >
                  <QRCodeSVG
                    value={qrUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor="#059669"
                    bgColor="#ffffff"
                  />
                </div>

                {/* URL Info */}
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-600 mb-2 font-semibold">URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-slate-700 flex-1 break-all">
                      {qrUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(qrUrl, index)}
                      className="flex-shrink-0 p-1.5 hover:bg-slate-200 rounded transition"
                      title="Copy URL"
                    >
                      {copiedIndex === index ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} className="text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 no-print">
                  <button
                    onClick={() => downloadQR(outlet.displayName, outlet.barcode)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Download
                  </button>
                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium text-center"
                  >
                    Test
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200 text-center no-print">
          <p className="text-sm text-slate-600">
            Total <strong className="text-emerald-700">{OUTLETS.length} Outlet</strong> dengan barcode unik
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Setiap QR code mengarah ke halaman feedback khusus untuk outlet tersebut
          </p>
        </div>
      </div>
    </div>
  )
}

