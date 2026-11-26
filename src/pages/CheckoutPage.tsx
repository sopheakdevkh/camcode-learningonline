import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { calculateOrderTotals } from '@/lib/pricingMath';
import { API_CONFIG } from '@/services/apiClient';
import { catalogService } from '@/services/catalogService';
import { checkoutService } from '@/services/checkoutService';
import { pricingService } from '@/services/pricingService';
import type {
  BillingCycle,
  Coupon,
  Course,
  OrderRecord,
  PaymentMethod,
  PlanTier,
  SubscriptionPlan,
} from '@/types';

const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Please provide your full name and a valid email address.'),
    email: z.string().trim().email('Please provide your full name and a valid email address.'),
    paymentMethod: z.enum(['card', 'khqr', 'bank_transfer']),
    cardNumber: z.string(),
    cardExpiry: z.string(),
    cardCvc: z.string(),
    acceptTerms: z.literal(true, {
      message: 'Please accept the Terms of Service and billing terms before paying.',
    }),
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentMethod === 'card' &&
      (!data.cardNumber.trim() || !data.cardExpiry.trim() || !data.cardCvc.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please complete your card payment details.',
      });
    }
  });

export const CheckoutPage: React.FC = () => {
  const { t, pickText, formatCurrency } = useI18n();
  const { user, grantPurchasedCourse, grantSubscription } = useAuth();
  const [searchParams] = useSearchParams();

  const checkoutType = (searchParams.get('type') === 'subscription' ? 'subscription' : 'course') as
    | 'course'
    | 'subscription';
  const courseSlug = searchParams.get('slug') ?? '';
  const planTier = (searchParams.get('plan') ?? 'basic') as PlanTier;
  const billingCycle = (searchParams.get('billing') === 'yearly' ? 'yearly' : 'monthly') as BillingCycle;

  const [course, setCourse] = useState<Course | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);

  // Customer & Payment Form
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Mobile expandable summary
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Payment verification state machine (prevents duplicate submission & client-only entitlement)
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [simulateFail, setSimulateFail] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingItem(true);
    if (checkoutType === 'course' && courseSlug) {
      catalogService
        .getCourseBySlug(courseSlug)
        .then((c) => {
          if (!active) return;
          setCourse(c);
          setLoadingItem(false);
        })
        .catch(() => {
          if (!active) return;
          setCourse(null);
          setLoadingItem(false);
        });
    } else if (checkoutType === 'subscription') {
      pricingService
        .getPlanByTier(planTier)
        .then((p) => {
          if (!active) return;
          setPlan(p ?? null);
          setLoadingItem(false);
        })
        .catch(() => {
          if (!active) return;
          setPlan(null);
          setLoadingItem(false);
        });
    } else {
      setLoadingItem(false);
    }
    return () => {
      active = false;
    };
  }, [checkoutType, courseSlug, planTier]);

  const itemTitle =
    checkoutType === 'course' && course
      ? course.title
      : checkoutType === 'subscription' && plan
        ? plan.name
        : null;

  const rawSubtotal =
    checkoutType === 'course' && course
      ? course.price
      : checkoutType === 'subscription' && plan
        ? billingCycle === 'monthly'
          ? plan.monthlyPrice
          : plan.yearlyPrice
        : 0;

  const { subtotal, discount, tax, total } = calculateOrderTotals({
    subtotal: rawSubtotal,
    coupon: appliedCoupon,
    taxRate: checkoutType === 'subscription' && plan ? plan.taxRate : 0.1,
  });

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      const found = await pricingService.validateCoupon(couponInput);
      if (!found) {
        setCouponError('Invalid coupon code. Try SAVE20, KHMER10, or WELCOME5.');
        return;
      }
      setAppliedCoupon(found);
      toast.success(`Coupon ${found.code} applied`);
    } catch {
      setCouponError(t.common.errorGeneric);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || order?.status === 'pending' || order?.status === 'verified') return;

    setFormError('');
    const parsed = checkoutSchema.safeParse({
      fullName,
      email,
      paymentMethod,
      cardNumber,
      cardExpiry,
      cardCvc,
      acceptTerms,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? t.common.errorGeneric);
      return;
    }
    if (!itemTitle) return;

    setSubmitting(true);
    try {
      // Step 1: Create backend pending order (no access granted yet!)
      const pendingOrder = await checkoutService.createPaymentOrder({
        type: checkoutType,
        itemTitle,
        itemSlugOrTier: checkoutType === 'course' ? course!.slug : plan!.tier,
        billingCycle: checkoutType === 'subscription' ? billingCycle : undefined,
        subtotal,
        discount,
        tax,
        total,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        simulateFailure: API_CONFIG.useMock ? simulateFail : false,
      });
      setOrder(pendingOrder);

      // Step 2: Await backend webhook verification before activating access
      const confirmed = await checkoutService.verifyOrderWebhook(
        pendingOrder,
        API_CONFIG.useMock ? simulateFail : false,
      );
      setOrder(confirmed);

      if (confirmed.status === 'verified') {
        toast.success(t.checkout.verifiedTitle);
        if (checkoutType === 'course' && course) {
          grantPurchasedCourse(course.id);
        } else if (checkoutType === 'subscription' && plan) {
          grantSubscription(plan.tier, billingCycle);
        }
      } else if (confirmed.status === 'failed') {
        toast.error(t.checkout.failedTitle);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.common.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  if (!loadingItem && !itemTitle) {
    return (
      <div className="container-page py-16 text-center space-y-4">
        <h1 className="text-h2 text-secondary">{t.checkout.noItemTitle}</h1>
        <p className="text-body text-muted">{t.checkout.noItemDesc}</p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/courses">
            <Button>{t.home.exploreCourses}</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline">{t.videos.viewPlans}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderSummaryContent = (
    <div className="space-y-4">
      {itemTitle && (
        <div className="p-4 rounded-[10px] bg-background border border-border space-y-1">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
            {checkoutType === 'course' ? t.nav.courses : t.nav.pricing}
          </p>
          <p className="text-[16px] font-semibold text-secondary">{pickText(itemTitle)}</p>
          {checkoutType === 'subscription' && (
            <p className="text-[13px] text-muted">
              {t.checkout.billingCycleLabel}:{' '}
              {billingCycle === 'monthly' ? t.pricing.monthly : t.pricing.yearly}
            </p>
          )}
        </div>
      )}

      {/* Coupon */}
      <div className="space-y-2">
        <label htmlFor="checkout-coupon-code" className="block text-[13px] font-medium text-secondary">
          {t.checkout.couponLabel}
        </label>
        <div className="flex gap-2">
          <Input
            id="checkout-coupon-code"
            name="couponCode"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder={t.checkout.couponPlaceholder}
            disabled={Boolean(appliedCoupon) || submitting || order?.status === 'verified'}
            leftAddon={<Tag className="h-4 w-4" />}
          />
          {appliedCoupon ? (
            <Button
              variant="outline"
              onClick={() => {
                setAppliedCoupon(null);
                setCouponInput('');
              }}
              disabled={submitting || order?.status === 'verified'}
            >
              {t.checkout.removeCoupon}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              loading={applyingCoupon}
              disabled={submitting || order?.status === 'verified'}
            >
              {t.checkout.applyCoupon}
            </Button>
          )}
        </div>
        {couponError && <p className="text-[12px] font-medium text-[#B91C1C] dark:text-red-400">{couponError}</p>}
        {appliedCoupon && (
          <p className="text-[12px] text-[#15803D] dark:text-emerald-400 font-medium">
            ✓ {appliedCoupon.code} — {pickText(appliedCoupon.description)}
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="pt-3 border-t border-border space-y-2.5 text-[14px] tabular-nums">
        <div className="flex justify-between text-[#475569]">
          <span>{t.checkout.subtotal}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success font-medium">
            <span>{t.checkout.discount}</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#475569]">
          <span>{t.checkout.tax}</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="pt-3 border-t border-border flex justify-between text-[18px] font-bold text-secondary">
          <span>{t.checkout.total}</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {checkoutType === 'subscription' && (
        <p className="text-[12px] text-muted leading-relaxed">{t.checkout.renewalInfo}</p>
      )}
    </div>
  );

  return (
    <div className="container-page py-8 md:py-12 pb-28 lg:pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-h1 text-secondary">{t.checkout.title}</h1>
          <p className="text-body text-muted mt-1">{t.checkout.subtitle}</p>
        </div>

        {/* Mobile Expandable Order Summary */}
        <div className="lg:hidden glass-card rounded-[20px] overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen((o) => !o)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-[14px] font-semibold text-secondary"
          >
            <span className="flex items-center gap-2">
              <span>{t.checkout.orderSummary}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`}
              />
            </span>
            <span className="text-[16px] font-bold tabular-nums text-primary">{formatCurrency(total)}</span>
          </button>
          {mobileSummaryOpen && (
            <div className="p-4 pt-0 border-t border-border">{orderSummaryContent}</div>
          )}
        </div>

        {/* Payment Verification Result States */}
        {order?.status === 'pending' && (
          <Alert tone="warning" title={t.checkout.pendingTitle}>
            <p>{t.checkout.pendingDesc}</p>
            <p className="text-[12px] mt-1 font-mono">Order ID: {order.orderId}</p>
          </Alert>
        )}

        {order?.status === 'verified' && (
          <Alert tone="success" title={t.checkout.verifiedTitle}>
            <p>{t.checkout.verifiedDesc}</p>
            <p className="text-[12px] mt-1 font-mono">Order ID: {order.orderId}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {checkoutType === 'course' && course ? (
                <Link to={`/courses/${course.slug}`}>
                  <Button variant="success" size="sm">
                    {t.checkout.goToCourse}
                  </Button>
                </Link>
              ) : (
                <Link to="/videos">
                  <Button variant="success" size="sm">
                    {t.checkout.goToVideos}
                  </Button>
                </Link>
              )}
            </div>
          </Alert>
        )}

        {order?.status === 'failed' && (
          <Alert tone="error" title={t.checkout.failedTitle}>
            <p>{order.message || t.checkout.failedDesc}</p>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOrder(null);
                  setSimulateFail(false);
                }}
              >
                {t.checkout.retryPayment}
              </Button>
            </div>
          </Alert>
        )}

        {/* Desktop 2-Column Layout */}
        <form onSubmit={handleSubmitPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {formError && <Alert tone="error">{formError}</Alert>}

            <section className="glass-card rounded-3xl p-6 space-y-4">
              <h2 className="text-h3 text-secondary">{t.checkout.customerDetails}</h2>
              <Input
                label={t.auth.fullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={submitting || order?.status === 'verified'}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t.auth.email}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting || order?.status === 'verified'}
                />
                <Input
                  label={t.auth.phone}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting || order?.status === 'verified'}
                />
              </div>
            </section>

            <section className="glass-card rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-h3 text-secondary">{t.checkout.paymentMethod}</h2>
                <span className="inline-flex items-center gap-1 text-[12px] text-muted">
                  <Lock className="h-3.5 w-3.5" /> TLS Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    ['card', t.checkout.methodCard, <CreditCard className="h-4 w-4" />],
                    ['khqr', t.checkout.methodKhqr, <QrCode className="h-4 w-4" />],
                    ['bank_transfer', t.checkout.methodBank, <Building2 className="h-4 w-4" />],
                  ] as const
                ).map(([method, label, icon]) => (
                  <button
                    key={method}
                    type="button"
                    disabled={submitting || order?.status === 'verified'}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-[8px] border text-left text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                      paymentMethod === method
                        ? 'border-primary dark:border-blue-400 bg-[#EFF6FF] dark:bg-blue-950/60 text-primary-hover dark:text-blue-300'
                        : 'border-border dark:border-slate-700 bg-white dark:bg-slate-900/90 text-secondary dark:text-slate-100 hover:bg-background dark:hover:bg-slate-800'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <Input
                    label={t.checkout.cardNumber}
                    placeholder="4242 4242 4242 4242"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    disabled={submitting || order?.status === 'verified'}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t.checkout.cardExpiry}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      disabled={submitting || order?.status === 'verified'}
                    />
                    <Input
                      label={t.checkout.cardCvc}
                      placeholder="CVC"
                      autoComplete="cc-csc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      disabled={submitting || order?.status === 'verified'}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'khqr' && (
                <Alert tone="info">{t.checkout.khqrHint}</Alert>
              )}

              {paymentMethod === 'bank_transfer' && (
                <Alert tone="info">{t.checkout.bankHint}</Alert>
              )}

              <label htmlFor="checkout-accept-terms" className="flex items-start gap-2.5 text-[13px] text-[#475569] cursor-pointer pt-2">
                <input
                  id="checkout-accept-terms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={submitting || order?.status === 'verified'}
                  className="mt-0.5 accent-primary"
                />
                <span>{t.checkout.acceptTerms}</span>
              </label>

              {/* Testing helper for webhook failure state (mock mode only) */}
              {API_CONFIG.useMock && (
                <label htmlFor="checkout-simulate-fail" className="flex items-center gap-2 text-[12px] text-muted cursor-pointer">
                  <input
                    id="checkout-simulate-fail"
                    name="simulateFail"
                    type="checkbox"
                    checked={simulateFail}
                    onChange={(e) => setSimulateFail(e.target.checked)}
                    disabled={submitting || order?.status === 'verified'}
                    className="accent-error"
                  />
                  <span>{t.checkout.simulateFailureToggle}</span>
                </label>
              )}

              <div className="hidden lg:block pt-2">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  success={order?.status === 'verified'}
                  disabled={order?.status === 'verified'}
                >
                  {submitting
                    ? t.checkout.processing
                    : `${t.checkout.payNow} · ${formatCurrency(total)}`}
                </Button>
              </div>
            </section>
          </div>

          {/* Right: Desktop Order Summary */}
          <aside className="hidden lg:block lg:col-span-5 glass-panel rounded-3xl p-6 sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 text-secondary">{t.checkout.orderSummary}</h2>
              <ShieldCheck className="h-5 w-5 text-success" />
            </div>
            {orderSummaryContent}
          </aside>

          {/* Mobile Sticky Payment CTA */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-border dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] text-muted">{t.checkout.total}</p>
              <p className="text-[18px] font-bold tabular-nums text-secondary">{formatCurrency(total)}</p>
            </div>
            <Button
              type="submit"
              loading={submitting}
              success={order?.status === 'verified'}
              disabled={order?.status === 'verified'}
            >
              {submitting ? t.checkout.processing : t.checkout.payNow}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

