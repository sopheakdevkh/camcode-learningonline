import type { Coupon } from '@/types';

export interface OrderTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
}

/**
 * Computes order subtotal, coupon discount, tax, and grand total using
 * integer minor units (cents) to avoid IEEE-754 floating-point drift.
 */
export function calculateOrderTotals(params: {
  subtotal: number;
  coupon?: Coupon | null;
  taxRate?: number;
}): OrderTotals {
  const safeSubtotal = Number.isFinite(params.subtotal) ? Math.max(0, params.subtotal) : 0;
  const safeTaxRate = Number.isFinite(params.taxRate) ? Math.max(0, params.taxRate!) : 0.1;

  const subtotalCents = Math.round(safeSubtotal * 100);

  let discountCents = 0;
  if (params.coupon && subtotalCents > 0) {
    if (params.coupon.discountType === 'percent') {
      const pct = Math.min(100, Math.max(0, params.coupon.value));
      discountCents = Math.round((subtotalCents * pct) / 100);
    } else {
      const fixedCents = Math.max(0, Math.round(params.coupon.value * 100));
      discountCents = Math.min(subtotalCents, fixedCents);
    }
  }

  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableCents * safeTaxRate);
  const totalCents = taxableCents + taxCents;

  return {
    subtotal: subtotalCents / 100,
    discount: discountCents / 100,
    tax: taxCents / 100,
    total: totalCents / 100,
    subtotalCents,
    discountCents,
    taxCents,
    totalCents,
  };
}
