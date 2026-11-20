// Supabase Edge Function-mall: supabase/functions/notify-new-patch/index.ts
// Triggas via Supabase Database Webhook vid INSERT på tabellen `public.patches`.
//
// Nödvändiga secrets i Supabase Dashboard (Edge Functions -> Secrets):
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - VAPID_PUBLIC_KEY
// - VAPID_PRIVATE_KEY
// - VAPID_SUBJECT (t.ex. "mailto:admin@din-doman.se")

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import webpush from 'npm:web-push@3.6.7';

interface PatchRecord {
  id: string;
  version: string;
  title: string;
  platforms: ('ps5' | 'xbox')[];
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: PatchRecord;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
  const vapidSubject = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:noreply@leonidacompanion.app';

  if (!supabaseUrl || !serviceRoleKey || !vapidPublicKey || !vapidPrivateKey) {
    return new Response(
      JSON.stringify({ error: 'Saknar nödvändiga miljövariabler för Supabase eller VAPID.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const payload = (await req.json()) as WebhookPayload;
  if (payload.type !== 'INSERT' || !payload.record) {
    return new Response(JSON.stringify({ ignored: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const patch = payload.record;
  const targetPlatforms = ['both', ...(patch.platforms ?? ['ps5', 'xbox'])];

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: subscribers, error } = await supabase
    .from('push_subscriptions')
    .select('device_id, platform, endpoint, subscription_json')
    .eq('enabled', true)
    .in('platform', targetPlatforms);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const notificationBody = JSON.stringify({
    title: `GTA VI v${patch.version} släppt!`,
    body: `${patch.title} (${(patch.platforms ?? []).map((p) => p.toUpperCase()).join(' / ')})`,
    url: '/',
  });

  let sentCount = 0;
  let failedCount = 0;

  for (const sub of subscribers ?? []) {
    const pushSub = sub.subscription_json;
    // Hoppa över lokala platshållar-prenumerationer utan riktiga push-nycklar
    if (!pushSub?.endpoint || !pushSub?.keys?.p256dh || !pushSub?.keys?.auth) {
      continue;
    }

    try {
      await webpush.sendNotification(pushSub, notificationBody);
      sentCount += 1;
    } catch (pushErr: unknown) {
      failedCount += 1;
      const statusCode =
        typeof pushErr === 'object' && pushErr !== null && 'statusCode' in pushErr
          ? (pushErr as { statusCode?: number }).statusCode
          : undefined;

      // Inaktivera utgångna eller återkallade endpoints (HTTP 404 / 410)
      if (statusCode === 404 || statusCode === 410) {
        await supabase
          .from('push_subscriptions')
          .update({ enabled: false })
          .eq('device_id', sub.device_id);
      }
    }
  }

  return new Response(
    JSON.stringify({
      patchVersion: patch.version,
      matchedSubscribers: subscribers?.length ?? 0,
      sent: sentCount,
      failed: failedCount,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
