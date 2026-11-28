import type {
  BillingCycle,
  LocalizedText,
  OrderRecord,
  PaymentMethod,
} from '@/types';
import { API_CONFIG, apiRequest, delay } from './apiClient';

export interface CreateOrderInput {
  type: 'course' | 'subscription';
  itemTitle: LocalizedText;
  itemSlugOrTier: string;
  billingCycle?: BillingCycle;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  simulateFailure?: boolean;
}

export const checkoutService = {
  /**
   * Step 1: Create payment intent on backend (Port 4000).
   * Returns order in 'pending' status — access MUST NOT be granted yet.
   */
  async createPaymentOrder(input: CreateOrderInput): Promise<OrderRecord> {
    if (!API_CONFIG.useMock) {
      return apiRequest<OrderRecord>('/checkout/orders', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    }
    await delay(300);
    return {
      orderId: `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      type: input.type,
      itemTitle: input.itemTitle,
      itemSlugOrTier: input.itemSlugOrTier,
      billingCycle: input.billingCycle,
      subtotal: input.subtotal,
      discount: input.discount,
      tax: input.tax,
      total: input.total,
      couponCode: input.couponCode,
      paymentMethod: input.paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Step 2: Poll/confirm verified payment event / webhook from backend.
   * Only when backend confirms 'verified' does entitlement activate.
   */
  async verifyOrderWebhook(
    order: OrderRecord,
    simulateFailure = false,
  ): Promise<OrderRecord> {
    if (!API_CONFIG.useMock) {
      return apiRequest<OrderRecord>(`/checkout/orders/${order.orderId}/status`);
    }
    await delay(1400);
    if (simulateFailure) {
      return {
        ...order,
        status: 'failed',
        message: 'Payment provider declined or webhook signature could not be verified.',
      };
    }
    return {
      ...order,
      status: 'verified',
      message: 'Webhook confirmed by backend payment processor.',
    };
  },
};

