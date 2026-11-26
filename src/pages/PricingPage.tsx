import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Info, X } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { pricingService, type PricingConfiguration } from '@/services/pricingService';
import type { BillingCycle } from '@/types';

export const PricingPage: React.FC = () => {
  const { t, pickText, formatCurrency } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [config, setConfig] = useState<PricingConfiguration | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    pricingService
      .getPricingConfig()
      .then((data) => {
        if (!active) return;
        setConfig(data);
        if (data.faqs.length > 0) setOpenFaqId(data.faqs[0].id);
      })
      .catch(() => {
        if (!active) return;
        setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container-page py-10 md:py-16 space-y-14">
      {/* Header + Billing Toggle */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <h1 className="text-h1 text-secondary">{t.pricing.title}</h1>
        <p className="text-body text-muted">{t.pricing.subtitle}</p>

        <div className="inline-flex items-center p-1 rounded-[10px] bg-white dark:bg-slate-900 border border-border dark:border-slate-700">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer ${
              billing === 'monthly'
                ? 'bg-primary text-white'
                : 'text-[#475569] dark:text-slate-300 hover:text-secondary dark:hover:text-white'
            }`}
          >
            {t.pricing.monthly}
          </button>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              billing === 'yearly'
                ? 'bg-primary text-white'
                : 'text-[#475569] dark:text-slate-300 hover:text-secondary dark:hover:text-white'
            }`}
          >
            <span>{t.pricing.yearly}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                billing === 'yearly'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F0FDF4] dark:bg-emerald-950/70 text-[#15803D] dark:text-emerald-300'
              }`}
            >
              {t.pricing.saveYearly}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards (Dynamic from pricingService) */}
      {loadError ? (
        <Alert tone="error">{t.common.errorGeneric}</Alert>
      ) : !config ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-105" />
          <Skeleton className="h-105" />
          <Skeleton className="h-105" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {config.plans.map((plan) => {
            const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const isCurrent = user?.activePlan === plan.tier;

            return (
              <div
                key={plan.id}
                className={`glass-card rounded-3xl p-6 md:p-7 flex flex-col justify-between ${
                  plan.highlighted
                    ? 'ring-2 ring-emerald-400/50'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h2 className="text-[20px] font-semibold text-secondary">
                      {pickText(plan.name)}
                    </h2>
                    {plan.highlighted && <Badge tone="primary">{t.pricing.mostPopular}</Badge>}
                  </div>
                  <p className="text-[14px] text-muted mb-6">{pickText(plan.tagline)}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[34px] font-bold tabular-nums text-secondary">
                        {formatCurrency(price)}
                      </span>
                      {price > 0 && (
                        <span className="text-[14px] text-muted">
                          {billing === 'monthly' ? t.pricing.perMonth : t.pricing.perYear}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-muted mt-1">
                      {price === 0
                        ? pickText(plan.autoRenewNotice)
                        : `${billing === 'monthly' ? t.pricing.billedMonthly : t.pricing.billedYearly} · ${pickText(plan.autoRenewNotice)}`}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[14px]">
                        {feat.included ? (
                          <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-[#CBD5E1] mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className={feat.included ? 'text-secondary dark:text-slate-100' : 'text-muted dark:text-slate-500'}>
                            {pickText(feat.label)}
                          </span>
                          {feat.detail && (
                            <p className="text-[12px] text-[#475569] dark:text-slate-400">{pickText(feat.detail)}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {isCurrent ? (
                  <Button variant="outline" fullWidth disabled>
                    {t.pricing.currentPlan}
                  </Button>
                ) : plan.tier === 'free' ? (
                  <Link to="/register">
                    <Button variant="outline" fullWidth>
                      {t.pricing.getStartedFree}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    fullWidth
                    onClick={() =>
                      navigate(`/checkout?type=subscription&plan=${plan.tier}&billing=${billing}`)
                    }
                  >
                    {t.pricing.subscribeNow}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Feature Comparison Table */}
      {config && (
        <section className="glass-card rounded-3xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-h3 text-secondary">{t.pricing.comparisonTitle}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="bg-background dark:bg-slate-900/90 border-b border-border dark:border-slate-800 text-[13px] font-semibold text-secondary dark:text-slate-100">
                  <th className="py-3.5 px-6">{t.pricing.featureCol}</th>
                  {config.plans.map((p) => (
                    <th key={p.id} className="py-3.5 px-6 text-center">
                      {pickText(p.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-800 text-[14px]">
                {config.comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-background dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-secondary">
                      {pickText(row.feature)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-muted">
                      {pickText(row.free)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-secondary">
                      {pickText(row.basic)}
                    </td>
                    <td className="py-3.5 px-6 text-center font-medium text-primary">
                      {pickText(row.premium)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Auto-renewal, Taxes & Cancellation Transparency */}
      <Alert tone="info" title={t.pricing.termsTitle}>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>{t.pricing.termsAutoRenew}</li>
          <li>{t.pricing.termsCancel}</li>
          <li>{t.pricing.termsTax}</li>
          <li>{t.pricing.termsScope}</li>
        </ul>
      </Alert>

      {/* Pricing FAQ Accordion */}
      {config && (
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-h2 text-secondary text-center">{t.pricing.faqTitle}</h2>
          </div>

          <div className="space-y-5">
            {config.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <article key={faq.id} className="glass-card rounded-3xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-[17px] font-medium text-secondary">
                      {pickText(faq.question)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-[14px] text-muted leading-relaxed">
                      {pickText(faq.answer)}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

