import { describe, expect, it } from 'vitest';
import { calculateOrderTotals } from '../pricingMath';

describe('calculateOrderTotals', () => {
  it('computes subtotal, tax, and total without floating-point drift', () => {
    const res = calculateOrderTotals({ subtotal: 19.99, taxRate: 0.1 });
    expect(res.subtotalCents).toBe(1999);
    expect(res.discountCents).toBe(0);
    expect(res.taxCents).toBe(200);
    expect(res.totalCents).toBe(2199);
    expect(res.total).toBe(21.99);
  });

  it('applies percentage coupon accurately in cents', () => {
    const res = calculateOrderTotals({
      subtotal: 49,
      coupon: {
        code: 'SAVE20',
        discountType: 'percent',
        value: 20,
        description: { en: '20% off' },
      },
      taxRate: 0.1,
    });
    expect(res.subtotalCents).toBe(4900);
    expect(res.discountCents).toBe(980);
    expect(res.taxCents).toBe(392);
    expect(res.totalCents).toBe(4312);
    expect(res.total).toBe(43.12);
  });

  it('caps fixed coupon discount at subtotal', () => {
    const res = calculateOrderTotals({
      subtotal: 5,
      coupon: {
        code: 'BIG10',
        discountType: 'fixed',
        value: 10,
        description: { en: '$10 off' },
      },
      taxRate: 0.1,
    });
    expect(res.discountCents).toBe(500);
    expect(res.taxCents).toBe(0);
    expect(res.totalCents).toBe(0);
  });

  it('guards against negative or non-finite inputs', () => {
    const res = calculateOrderTotals({ subtotal: Number.NaN, taxRate: -0.5 });
    expect(res.totalCents).toBe(0);
  });
});
