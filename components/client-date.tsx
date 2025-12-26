"use client"

import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"

interface ClientDateProps {
  timestamp: number
  className?: string
}

export function ClientDate({ timestamp, className }: ClientDateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={className}>--/--/----, --:--</span>
  }

  return <span className={className}>{formatDate(timestamp)}</span>
}
