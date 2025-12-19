import { getNotifications } from '@/app/dashboard/action';
import { NotificationsTable } from '@/components/notifications-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export default async function NotificationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 20;
  
  const result = await getNotifications(page, pageSize);

  // Server Action para logout
  async function handleLogout() {
    'use server';
    redirect('/login');
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

  // Normalización de datos
  const cleanNotifications = (result.data || []).map((n) => ({
    ...n,
    id: n.id || n.code || `temp-${Math.random()}`,
  }));

  return (
    <NotificationsTable 
      initialNotifications={cleanNotifications}
      pagination={result.pagination}
      onLogout={handleLogout} 
    />
  );
}