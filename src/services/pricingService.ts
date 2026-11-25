import {
  MOCK_COMPARISON_ROWS,
  MOCK_COUPONS,
  MOCK_PRICING_FAQS,
  MOCK_SUBSCRIPTION_PLANS,
} from '@/data/mockPricing';
import type { Coupon, PlanTier, SubscriptionPlan } from '@/types';
import { API_CONFIG, apiRequest, delay } from './apiClient';

export interface PricingConfiguration {
  plans: SubscriptionPlan[];
  comparisonRows: typeof MOCK_COMPARISON_ROWS;
  faqs: typeof MOCK_PRICING_FAQS;
  currency: 'USD';
  defaultTaxRate: number;
}

export const pricingService = {
  async getPricingConfig(): Promise<PricingConfiguration> {
    if (!API_CONFIG.useMock) {
      return apiRequest<PricingConfiguration>('/pricing/config');
    }
    await delay(90);
    return {
      plans: MOCK_SUBSCRIPTION_PLANS,
      comparisonRows: MOCK_COMPARISON_ROWS,
      faqs: MOCK_PRICING_FAQS,
      currency: 'USD',
      defaultTaxRate: 0.1,
    };
  },

  async getPlanByTier(tier: PlanTier): Promise<SubscriptionPlan | undefined> {
    const config = await this.getPricingConfig();
    return config.plans.find((p) => p.tier === tier);
  },

  async validateCoupon(code: string): Promise<Coupon | null> {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return null;
    if (!API_CONFIG.useMock) {
      return apiRequest<Coupon | null>(`/pricing/coupons/${encodeURIComponent(normalized)}`);
    }
    await delay(140);
    return MOCK_COUPONS.find((c) => c.code === normalized) ?? null;
  },
};

