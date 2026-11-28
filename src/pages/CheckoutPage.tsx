import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { calculateOrderTotals } from '@/lib/pricingMath';
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

export const CheckoutPage: React.FC = () => {
  const { t, pickText } = useI18n();
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
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('424');
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
      catalogService.getCourseBySlug(courseSlug).then((c) => {
        if (!active) return;
        setCourse(c);
        setLoadingItem(false);
      });
    } else if (checkoutType === 'subscription') {
      pricingService.getPlanByTier(planTier).then((p) => {
        if (!active) return;
        setPlan(p ?? null);
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

  const subtotal =
    checkoutType === 'course' && course
      ? course.price
      : checkoutType === 'subscription' && plan
        ? billingCycle === 'monthly'
          ? plan.monthlyPrice
          : plan.yearlyPrice
        : 0;

  const { discount, tax, total } = calculateOrderTotals({
    subtotal,
    coupon: appliedCoupon,
  });

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    const found = await pricingService.validateCoupon(couponInput);
    setApplyingCoupon(false);
    if (!found) {
      setCouponError('Invalid coupon code. Try SAVE20, KHMER10, or WELCOME5.');
      return;
    }
    setAppliedCoupon(found);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || order?.status === 'pending' || order?.status === 'verified') return;

    setFormError('');
    if (!fullName.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setFormError('Please provide your full name and a valid email address.');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())) {
      setFormError('Please complete your card payment details.');
      return;
    }
    if (!acceptTerms) {
      setFormError('Please accept the Terms of Service and billing terms before paying.');
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
        simulateFailure: simulateFail,
      });
      setOrder(pendingOrder);

      // Step 2: Await backend webhook verification before activating access
      const confirmed = await checkoutService.verifyOrderWebhook(pendingOrder, simulateFail);
      setOrder(confirmed);

      if (confirmed.status === 'verified') {
        if (checkoutType === 'course' && course) {
          grantPurchasedCourse(course.id);
        } else if (checkoutType === 'subscription' && plan) {
          grantSubscription(plan.tier, billingCycle);
        }
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.common.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  if (!loadingItem && !itemTitle) {
    return (
      <div className="surface-mist min-h-screen">
        <div className="container-page pt-[140px] pb-16 text-center space-y-4">
          <h1 className="text-h2 text-[#141312] dark:text-[#f6f3ec]">{t.checkout.noItemTitle}</h1>
          <p className="text-body text-[#6e6a62]">{t.checkout.noItemDesc}</p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/courses">
              <Button rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                {t.home.exploreCourses}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline">{t.videos.viewPlans}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderSummaryContent = (
    <div className="space-y-4">
      {itemTitle && (
        <div className="p-4 rounded-xl bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] space-y-1">
          <p className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1c5b48] dark:text-[#7CD4B5]">
            {checkoutType === 'course' ? t.nav.courses : t.nav.pricing}
          </p>
          <p className="text-[16px] font-bold text-[#141312] dark:text-[#f6f3ec]">
            {pickText(itemTitle)}
          </p>
          {checkoutType === 'subscription' && (
            <p className="font-mono-tech text-[11px] text-[#6e6a62]">
              {t.checkout.billingCycleLabel}:{' '}
              {billingCycle === 'monthly' ? t.pricing.monthly : t.pricing.yearly}
            </p>
          )}
        </div>
      )}

      {/* Coupon */}
      <div className="space-y-2">
        <label className="block font-mono-tech text-[11px] uppercase tracking-[0.08em] font-medium text-[#6e6a62]">
          {t.checkout.couponLabel}
        </label>
        <div className="flex gap-2">
          <Input
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
        {couponError && <p className="text-[12px] text-[#a5331f]">{couponError}</p>}
        {appliedCoupon && (
          <p className="font-mono-tech text-[12px] text-[#1c5b48] dark:text-[#7CD4B5] font-medium">
            ✓ {appliedCoupon.code} — {pickText(appliedCoupon.description)}
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="pt-4 border-t border-[#ded8ca] dark:border-[#2A332E] space-y-2.5 text-[14px]">
        <div className="flex justify-between text-[#6e6a62]">
          <span>{t.checkout.subtotal}</span>
          <span className="font-mono-tech tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#1c5b48] dark:text-[#7CD4B5] font-medium">
            <span>{t.checkout.discount}</span>
            <span className="font-mono-tech tabular-nums">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#6e6a62]">
          <span>{t.checkout.tax}</span>
          <span className="font-mono-tech tabular-nums">${tax.toFixed(2)}</span>
        </div>
        <div className="pt-3 border-t border-[#ded8ca] dark:border-[#2A332E] flex justify-between items-baseline text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">
          <span>{t.checkout.total}</span>
          <span className="font-serif-display text-[26px] font-medium tabular-nums">${total.toFixed(2)}</span>
        </div>
      </div>

      {checkoutType === 'subscription' && (
        <p className="font-mono-tech text-[11px] text-[#6e6a62] leading-relaxed">
          {t.checkout.renewalInfo}
        </p>
      )}
    </div>
  );

  return (
    <div className="surface-mist relative overflow-hidden min-h-screen">
      <span aria-hidden="true" className="deco-ring left-[-240px] top-[-320px] size-[720px]" />
      <span aria-hidden="true" className="deco-ring right-[-320px] top-[-220px] size-[640px]" />
      <div className="relative container-page pt-[124px] pb-28 md:pt-[140px] lg:pb-16">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#ded8ca] dark:border-[#2A332E]">
          <span className="swiss-eyebrow">
            <span className="swiss-dot" aria-hidden="true" />
            <span>SECURE CHECKOUT</span>
          </span>
          <span className="font-mono-tech text-[11px] uppercase tracking-[0.08em] text-[#6e6a62]">
            TLS · WEBHOOK VERIFIED
          </span>
        </div>

        <div>
          <h1 className="text-h1 text-[#141312] dark:text-[#f6f3ec]">{t.checkout.title}</h1>
          <p className="text-body text-[#6e6a62] mt-1">{t.checkout.subtitle}</p>
        </div>

        {/* Mobile Expandable Order Summary */}
        <div className="lg:hidden swiss-surface overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen((o) => !o)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-[14px] font-bold text-[#141312] dark:text-[#f6f3ec]"
          >
            <span className="flex items-center gap-2">
              <span>{t.checkout.orderSummary}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`}
              />
            </span>
            <span className="font-mono-tech text-[16px] font-extrabold tabular-nums text-[#1c5b48] dark:text-[#7CD4B5]">
              ${total.toFixed(2)}
            </span>
          </button>
          {mobileSummaryOpen && (
            <div className="p-4 pt-3 border-t border-[#ded8ca] dark:border-[#2A332E]">
              {orderSummaryContent}
            </div>
          )}
        </div>

        {/* Payment Verification Result States */}
        {order?.status === 'pending' && (
          <Alert tone="warning" title={t.checkout.pendingTitle}>
            <p>{t.checkout.pendingDesc}</p>
            <p className="font-mono-tech text-[12px] mt-1">Order ID: {order.orderId}</p>
          </Alert>
        )}

        {order?.status === 'verified' && (
          <Alert tone="success" title={t.checkout.verifiedTitle}>
            <p>{t.checkout.verifiedDesc}</p>
            <p className="font-mono-tech text-[12px] mt-1">Order ID: {order.orderId}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {checkoutType === 'course' && course ? (
                <Link to={`/courses/${course.slug}`}>
                  <Button variant="success" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                    {t.checkout.goToCourse}
                  </Button>
                </Link>
              ) : (
                <Link to="/videos">
                  <Button variant="success" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
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

            <section className="swiss-surface p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ded8ca] dark:border-[#2A332E]">
                <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
                  {t.checkout.customerDetails}
                </h2>
                <span className="font-mono-tech text-[11px] text-[#1c5b48] dark:text-[#7CD4B5]">01</span>
              </div>
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

            <section className="swiss-surface p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#ded8ca] dark:border-[#2A332E]">
                <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
                  {t.checkout.paymentMethod}
                </h2>
                <span className="font-mono-tech inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.06em] text-[#6e6a62]">
                  <Lock className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" /> TLS Encrypted
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
                    className={`p-3 rounded-xl border text-left text-[13px] font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                      paymentMethod === method
                        ? 'border-[#1c5b48] bg-[#1c5b48] text-white dark:bg-[#2D7A62]'
                        : 'border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48]'
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
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    disabled={submitting || order?.status === 'verified'}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t.checkout.cardExpiry}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      disabled={submitting || order?.status === 'verified'}
                    />
                    <Input
                      label={t.checkout.cardCvc}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      disabled={submitting || order?.status === 'verified'}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'khqr' && <Alert tone="info">{t.checkout.khqrHint}</Alert>}

              {paymentMethod === 'bank_transfer' && <Alert tone="info">{t.checkout.bankHint}</Alert>}

              <label className="flex items-start gap-2.5 text-[13px] text-[#6e6a62] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={submitting || order?.status === 'verified'}
                  className="mt-0.5 accent-[#1c5b48]"
                />
                <span>{t.checkout.acceptTerms}</span>
              </label>

              {/* Testing helper for webhook failure state */}
              <label className="flex items-center gap-2 font-mono-tech text-[11px] text-[#6e6a62] cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFail}
                  onChange={(e) => setSimulateFail(e.target.checked)}
                  disabled={submitting || order?.status === 'verified'}
                  className="accent-[#a5331f]"
                />
                <span>{t.checkout.simulateFailureToggle}</span>
              </label>

              <div className="hidden lg:block pt-2">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  success={order?.status === 'verified'}
                  disabled={order?.status === 'verified'}
                  rightIcon={<ArrowUpRight className="h-4 w-4" />}
                >
                  {submitting
                    ? t.checkout.processing
                    : `${t.checkout.payNow} · $${total.toFixed(2)}`}
                </Button>
              </div>
            </section>
          </div>

          {/* Right: Desktop Order Summary */}
          <aside className="hidden lg:block lg:col-span-5 swiss-surface border-[#1c5b48]/40 dark:border-[#2A332E] p-6 sticky top-24 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded8ca] dark:border-[#2A332E]">
              <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
                {t.checkout.orderSummary}
              </h2>
              <ShieldCheck className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" />
            </div>
            {orderSummaryContent}
          </aside>

          {/* Mobile Sticky Payment CTA */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#efebe1] dark:bg-[#151A17] border-t border-[#ded8ca] dark:border-[#2A332E] px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono-tech text-[10px] uppercase tracking-[0.06em] text-[#6e6a62]">
                {t.checkout.total}
              </p>
              <p className="font-serif-display text-[20px] font-medium tabular-nums text-[#141312] dark:text-[#f6f3ec]">
                ${total.toFixed(2)}
              </p>
            </div>
            <Button
              type="submit"
              loading={submitting}
              success={order?.status === 'verified'}
              disabled={order?.status === 'verified'}
              rightIcon={<ArrowUpRight className="h-4 w-4" />}
            >
              {submitting ? t.checkout.processing : t.checkout.payNow}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};
