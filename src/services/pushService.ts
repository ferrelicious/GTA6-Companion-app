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

export type PushMessageKey = 'webPush' | 'browserSaved' | 'browserLocalMissingVapid';

export interface PushActivationResult {
  state: PushSubscriptionState;
  mode: 'web-push' | 'browser-local';
  messageKey: PushMessageKey;
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
    throw new Error('PUSH_UNSUPPORTED');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('PUSH_PERMISSION_DENIED');
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
        messageKey: 'webPush',
      };
    } catch (err) {
      console.warn('PushManager.subscribe failed, falling back to local SW notification:', err);
    }
  }

  const fallbackPayload = {
    endpoint: `browser-notification://${api.getDeviceId()}`,
    keys: {},
    note: 'Add VITE_WEB_PUSH_PUBLIC_KEY for background push when tab is closed.',
  };
  const saved = await api.savePushSubscription(platform, fallbackPayload);

  return {
    state: saved,
    mode: 'browser-local',
    messageKey: vapidPublicKey ? 'browserSaved' : 'browserLocalMissingVapid',
  };
}

export async function triggerTestPatchNotification(
  title: string,
  body: string
): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    throw new Error('PUSH_PERMISSION_REQUIRED');
  }

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
