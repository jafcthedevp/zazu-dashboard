// app/dashboard/notifications/page.tsx
import { getNotifications } from '@/app/dashboard/action';
import { NotificationsTable } from '@/components/notifications-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function NotificationsPage() {
  const result = await getNotifications();

  let notifications: any[] = [];

  // LOGICA DEFENSIVA:
  // Forzamos el tipo 'any' en rawData para que TS no se queje de la estructura anidada.
  const rawData = result.data as any;

  if (result.success) {
    // 1. Intento: Estructura anidada (según tu log: array -> objeto -> array en .data)
    if (
      Array.isArray(rawData) && 
      rawData.length > 0 && 
      rawData[0]?.data && 
      Array.isArray(rawData[0].data)
    ) {
      notifications = rawData[0].data;
    } 
    // 2. Intento: Estructura plana (por si la API cambia o devuelve directo)
    else if (Array.isArray(rawData)) {
      notifications = rawData;
    }
  }

  // NORMALIZACIÓN:
  // Aseguramos que cada elemento tenga 'id' (usando 'code' si falta)
  // para cumplir con el esquema de NotificationSchema.
  const cleanNotifications = notifications.map((n) => ({
    ...n,
    id: n.id || n.code || `temp-${Math.random()}`, // Fallback para evitar keys duplicadas
  }));

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

  return (
    <NotificationsTable 
      initialNotifications={cleanNotifications} 
      onLogout={handleLogout} 
    />
  );
}