export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    (window as any).posthog?.capture(event, props);
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event:', event, props);
    }
  } catch (e) {
    console.error('Analytics error:', e);
  }
}

export function identify(userId: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    (window as any).posthog?.identify(userId, props);
  } catch (e) {
    console.error('Analytics identify error:', e);
  }
}

// Funnel event helpers
export const FunnelEvents = {
  // Design funnel
  design_started: (template: string, type: string) => 
    track('design_started', { template, type }),
  
  design_template_changed: (template: string, type: string) =>
    track('design_template_changed', { template, type }),
  
  design_dimensions_changed: (width: number, height: number) =>
    track('design_dimensions_changed', { width, height }),
  
  design_material_changed: (material: string) =>
    track('design_material_changed', { material }),
  
  design_price_calculated: (price: number, components: string[]) =>
    track('design_price_calculated', { price, components: components.join(',') }),
  
  design_saved: (designId?: string) =>
    track('design_saved', { designId }),
  
  design_exported: (format: 'png' | 'json') =>
    track('design_exported', { format }),
  
  // Quote/Payment funnel
  quote_viewed: (designId: string, price: number) =>
    track('quote_viewed', { designId, price }),
  
  checkout_started: (gateway: string, amount: number) =>
    track('checkout_started', { gateway, amount }),
  
  payment_completed: (gateway: string, amount: number, orderId?: string) =>
    track('payment_completed', { gateway, amount, orderId }),
  
  payment_failed: (gateway: string, amount: number, reason?: string) =>
    track('payment_failed', { gateway, amount, reason }),
  
  // Customer/Order events
  customer_created: (customerId: string) =>
    track('customer_created', { customerId }),
  
  order_created: (orderId: string, total: number, itemCount: number) =>
    track('order_created', { orderId, total, itemCount }),
  
  // User engagement
  designer_opened: () =>
    track('designer_opened'),
  
  dashboard_viewed: () =>
    track('dashboard_viewed'),
  
  template_selected: (template: string, type: string) =>
    track('template_selected', { template, type }),
  
  quick_size_applied: (width: number, height: number) =>
    track('quick_size_applied', { width, height }),
};







