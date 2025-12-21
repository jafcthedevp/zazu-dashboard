import { getNotifications } from "@/app/dashboard/action"
import { NotificationsTable } from "@/components/notifications-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { logout } from "../login/action"

interface PageProps {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    status?: string
    code?: string
    deviceId?: string
    amountMin?: string
    amountMax?: string
    dateFrom?: string
    dateTo?: string
    lastKey?: string
  }>
}

export default async function NotificationsPage({ searchParams }: PageProps) {
  const params = await searchParams

  console.log("[v0] Raw searchParams:", params)
  console.log("[v0] Status filter from URL:", params.status)

  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 20

  const currentFilters = {
    status: params.status,
    code: params.code,
    deviceId: params.deviceId,
    amountMin: params.amountMin,
    amountMax: params.amountMax,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    lastKey: params.lastKey,
  }

  console.log("[v0] Filters being sent to getNotifications:", currentFilters)

  const result = await getNotifications(page, pageSize, currentFilters)

  console.log("[v0] Result from API - success:", result.success)
  console.log("[v0] Result notifications count:", result.data?.length)
  if (result.data && result.data.length > 0) {
    console.log("[v0] First notification status:", result.data[0].status)
    console.log(
      "[v0] All statuses:",
      result.data.map((n) => n.status),
    )
  }

  async function handleLogout() {
    "use server"
    await logout();
  }

  if (!result.success) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const cleanNotifications = (result.data || []).map((n, index) => ({
    ...n,
    id: n.id || n.code || `temp-${index}`,
  }))

  return (
    <NotificationsTable
      initialNotifications={cleanNotifications}
      pagination={result.pagination!}
      initialFilters={params as Record<string, string>}
      onLogout={handleLogout}
    />
  )
}
