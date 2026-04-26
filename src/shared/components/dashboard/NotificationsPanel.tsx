'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotificationsPanel() {
  const [totalNotifications, setTotalNotifications] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const res = await fetch('/api/user/notifications', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Error al obtener las notificaciones');
        }

        const data = await res.json();

        if (!cancelled) {
          setTotalNotifications(data);
        }
      } catch (error) {
        console.error('NotificationsPanel error:', error);
      }
    };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 dark:hover:text-white"
      href="/dashboard/notifications"
    >
      <span className="sr-only">View notifications</span>
      <BellIcon aria-hidden="true" className="size-6" />
      {totalNotifications > 0 && (
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
          {totalNotifications}
        </span>
      )}
    </Link>
  );
}
