// app/dashboard/notifications/page.tsx
import { getNotifications } from '@/app/dashboard/action';
import { NotificationsTable } from '@/components/notifications-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function NotificationsPage() {
  const result = await getNotifications();

  console.log('Result from API:', result); // Debug

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

  // Crear una función de logout del lado del cliente
  const logoutAction = async () => {
    'use server';
    // Por ahora solo redirige, ajusta según tu implementación de Supabase
    const { redirect } = await import('next/navigation');
    redirect('/login');
  };

  return <NotificationsTable initialNotifications={result.data} onLogout={logoutAction} />;
}