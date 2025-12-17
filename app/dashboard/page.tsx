// app/dashboard/notifications/page.tsx
import { getNotifications } from '@/app/dashboard/action';
import { NotificationsTable } from '@/components/notifications-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function NotificationsPage() {
  const result = await getNotifications();

  // APLANA Y AGREGA "id" USANDO "code"
  let notifications = [];
  if (
    Array.isArray(result.data) &&
    result.data.length > 0 &&
    Array.isArray(result.data[0].data)
  ) {
    notifications = result.data[0].data.map(n => ({
      ...n,
      id: n.id, // si "code" es único, úsalo como "id"
    }));
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
    );
  }

  return (
    <NotificationsTable initialNotifications={notifications} />
  );
}