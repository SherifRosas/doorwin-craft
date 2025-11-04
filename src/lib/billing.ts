import { db } from './db';

export type SubscriptionStatusType = 'trial_active' | 'subscribed_active' | 'past_due' | 'canceled';

export async function getBilling(orgId: string) {
  // If the org doesn't exist (e.g., anonymous trial), do not touch DB; return a virtual trial
  const org = await db.org.findUnique({ where: { id: orgId } });
  if (!org) {
    return {
      orgId,
      status: 'trial_active' as SubscriptionStatusType,
      trialEndsAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      currentPeriodEnd: undefined,
    };
  }

  const subscription = await db.subscription.findUnique({ where: { orgId } });

  if (!subscription) {
    // No subscription yet for this org; treat as trial without creating records
    return {
      orgId,
      status: 'trial_active' as SubscriptionStatusType,
      trialEndsAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      currentPeriodEnd: undefined,
    };
  }

  return {
    orgId,
    status: subscription.status.toLowerCase() as SubscriptionStatusType,
    trialEndsAt: subscription.trialEndsAt?.toISOString(),
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
  };
}

export async function activateSubscription(orgId: string, periodEndISO: string) {
  await db.subscription.upsert({
    where: { orgId },
    update: {
      status: 'SUBSCRIBED_ACTIVE',
      currentPeriodEnd: new Date(periodEndISO),
    },
    create: {
      orgId,
      status: 'SUBSCRIBED_ACTIVE',
      currentPeriodEnd: new Date(periodEndISO),
    }
  });
}

export async function markPastDue(orgId: string) {
  await db.subscription.update({
    where: { orgId },
    data: { status: 'PAST_DUE' }
  });
}

export async function cancelSubscription(orgId: string) {
  await db.subscription.update({
    where: { orgId },
    data: { status: 'CANCELED' }
  });
}

export async function hasEntitlement(orgId: string): Promise<boolean> {
  const billing = await getBilling(orgId);
  if (billing.status === 'subscribed_active') return true;
  if (billing.status === 'trial_active' && billing.trialEndsAt && new Date(billing.trialEndsAt).getTime() > Date.now()) return true;
  return false;
}


