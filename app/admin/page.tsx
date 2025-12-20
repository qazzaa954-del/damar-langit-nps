'use client'
import dynamic from 'next/dynamic'

// Disable SSR untuk admin page karena menggunakan Supabase client
const AdminPageContent = dynamic(() => import('./AdminContent'), { ssr: false })

export default function AdminPage() {
  return <AdminPageContent />
}
