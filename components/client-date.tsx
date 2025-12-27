"use client"

import { useClientDate } from "@/lib/hooks/use-client-date"

interface ClientDateProps {
  timestamp: number
  className?: string
  placeholder?: string
}

export function ClientDate({
  timestamp,
  className,
  placeholder = "--/--/----, --:--"
}: ClientDateProps) {
  const formattedDate = useClientDate(timestamp, placeholder)

  return <span className={className}>{formattedDate}</span>
}
