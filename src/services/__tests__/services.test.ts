import { describe, expect, it } from 'vitest';
import { catalogService } from '../catalogService';
import { checkoutService } from '../checkoutService';
import { pricingService } from '../pricingService';

describe('catalogService (mock mode)', () => {
  it('filters courses by priceType, category, and search query', async () => {
    const freeRes = await catalogService.listCourses({ priceType: 'free' });
    expect(freeRes.total).toBeGreaterThan(0);
    expect(freeRes.items.every((c) => c.price === 0)).toBe(true);

    const marketingRes = await catalogService.listCourses({ category: 'digital-marketing' });
    expect(marketingRes.items.length).toBeGreaterThan(0);
    expect(marketingRes.items.every((c) => c.categorySlug === 'digital-marketing')).toBe(true);

    const searchRes = await catalogService.listCourses({ q: 'React' });
    expect(searchRes.items.length).toBeGreaterThan(0);
  });

  it('clamps out-of-range page numbers safely', async () => {
    const res = await catalogService.listCourses({ page: 999, pageSize: 6 });
    expect(res.page).toBe(res.totalPages);
    expect(res.items.length).toBeGreaterThan(0);
  });

  it('looks up courses and videos by slug and returns null for unknown slugs', async () => {
    const all = await catalogService.listCourses({ pageSize: 20 });
    const first = all.items[0];
    expect(first).toBeDefined();
    const found = await catalogService.getCourseBySlug(first.slug);
    expect(found?.id).toBe(first.id);

    const missingCourse = await catalogService.getCourseBySlug('non-existent-course-slug');
    expect(missingCourse).toBeNull();

    const missingVideo = await catalogService.getVideoBySlug('non-existent-video-slug');
    expect(missingVideo).toBeNull();
  });
});

describe('pricingService & checkoutService (mock mode)', () => {
  it('validates known coupons case-insensitively and rejects unknown codes', async () => {
    const save20 = await pricingService.validateCoupon(' save20 ');
    expect(save20?.code).toBe('SAVE20');
    expect(save20?.value).toBe(20);

    const invalid = await pricingService.validateCoupon('NOT_A_COUPON');
    expect(invalid).toBeNull();
  });

  it('creates pending orders first and activates only on verified webhook', async () => {
    const pending = await checkoutService.createPaymentOrder({
      type: 'subscription',
      itemTitle: { en: 'Basic' },
      itemSlugOrTier: 'basic',
      billingCycle: 'monthly',
      subtotal: 9,
      discount: 0,
      tax: 0.9,
      total: 9.9,
      paymentMethod: 'card',
    });
    expect(pending.status).toBe('pending');
    expect(pending.orderId).toMatch(/^ORD-/);

    const verified = await checkoutService.verifyOrderWebhook(pending, false);
    expect(verified.status).toBe('verified');

    const failed = await checkoutService.verifyOrderWebhook(pending, true);
    expect(failed.status).toBe('failed');
  });
});
