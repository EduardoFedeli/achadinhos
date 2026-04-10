'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function SupabaseProgressBar() {
  const [dbSizeMB, setDbSizeMB] = useState(0)
  const maxLimitMB = 500 // Limite do plano Free do Supabase

  useEffect(() => {
    async function fetchDbSize() {
      const { data, error } = await supabase.rpc('get_db_size')
      
      if (data && !error) {
        const sizeInMB = (data / (1024 * 1024)).toFixed(1)
        setDbSizeMB(parseFloat(sizeInMB))
      }
    }
    fetchDbSize()
  }, [])

  const progressPercentage = Math.min((dbSizeMB / maxLimitMB) * 100, 100)

  return (
    <div className="flex items-center gap-3 bg-[#1A1A24] border border-[#2A2A35] px-4 py-2 rounded-full shrink-0">
      {/* Injeção da largura dinâmica na barra sem usar style inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        .supabase-progress-fill { width: ${progressPercentage}%; }
      `}} />

      <span className="text-xs font-bold text-[#22C55E]">Supabase</span>
      <div className="w-24 h-1.5 bg-[#0F0F13] rounded-full overflow-hidden">
        <div className="h-full bg-[#22C55E] transition-all duration-1000 supabase-progress-fill" />
      </div>
      <span className="text-xs font-medium text-[#A1A1AA]">
        {dbSizeMB} / {maxLimitMB}MB
      </span>
    </div>
  )
}