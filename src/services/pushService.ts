import { PushPlatformChoice, PushSubscriptionState } from '../types';
import { api } from './api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface PushActivationResult {
  state: PushSubscriptionState;
  mode: 'web-push' | 'browser-local';
  message: string;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    return registration;
  } catch {
    return null;
  }
}

export async function subscribeToPatchNotifications(
  platform: PushPlatformChoice
): Promise<PushActivationResult> {
  if (!isNotificationSupported()) {
    throw new Error('Din webbläsare stöder tyvärr inte Push-notiser.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error(
      'Notisbehörighet nekades. Tillåt notiser i webbläsarens sidinställningar för att bevaka uppdateringar.'
    );
  }

  const registration = await registerPushServiceWorker();
  const vapidPublicKey = (import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY as string | undefined)?.trim();

  if (registration && 'pushManager' in registration && vapidPublicKey) {
    try {
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey.buffer as ArrayBuffer,
        });
      }
      const jsonSub = subscription.toJSON();
      const saved = await api.savePushSubscription(platform, jsonSub);
      return {
        state: saved,
        mode: 'web-push',
        message: 'Web Push aktiverat och synkat till Supabase.',
      };
    } catch (err) {
      console.warn('PushManager.subscribe misslyckades, använder lokal SW-prenumeration:', err);
    }
  }

  // Fallback när VITE_WEB_PUSH_PUBLIC_KEY ännu inte satts i .env
  const fallbackPayload = {
    endpoint: `browser-notification://${api.getDeviceId()}`,
    keys: {},
    note: 'Lägg till VITE_WEB_PUSH_PUBLIC_KEY för bakgrunds-push när fliken är stängd.',
  };
  const saved = await api.savePushSubscription(platform, fallbackPayload);

  return {
    state: saved,
    mode: 'browser-local',
    message: vapidPublicKey
      ? 'Prenumeration sparad med webbläsarnotiser.'
      : 'Notiser aktiverade och sparade! Lägg till VITE_WEB_PUSH_PUBLIC_KEY för bakgrunds-push när appen är stängd.',
  };
}

export async function triggerTestPatchNotification(platform: PushPlatformChoice): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    throw new Error('Aktivera notisbehörighet först.');
  }

  const platformLabel =
    platform === 'both' ? 'PS5 & Xbox' : platform === 'ps5' ? 'PS5' : 'Xbox Series X|S';
  const title = `GTA VI · Ny patch för ${platformLabel}`;
  const body = 'Testnotis: Version 01.004.001 finns nu i Leonida Companion.';

  const registration = await registerPushServiceWorker();
  if (registration && 'showNotification' in registration) {
    await registration.showNotification(title, {
      body,
      tag: 'leonida-patch-test',
    });
    return;
  }

  new Notification(title, { body });
}
