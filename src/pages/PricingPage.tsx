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
  const { t, pickText } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [config, setConfig] = useState<PricingConfiguration | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    pricingService.getPricingConfig().then((data) => {
      setConfig(data);
      if (data.faqs.length > 0) setOpenFaqId(data.faqs[0].id);
    });
  }, []);

  return (
    <div className="container-page py-10 md:py-16 space-y-14">
      {/* Header + Billing Toggle */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <h1 className="text-h1 text-[#0F172A]">{t.pricing.title}</h1>
        <p className="text-body text-[#64748B]">{t.pricing.subtitle}</p>

        <div className="inline-flex items-center p-1 rounded-[10px] bg-white border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer ${
              billing === 'monthly'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {t.pricing.monthly}
          </button>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              billing === 'yearly'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span>{t.pricing.yearly}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                billing === 'yearly'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F0FDF4] text-[#16A34A]'
              }`}
            >
              {t.pricing.saveYearly}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards (Dynamic from pricingService) */}
      {!config ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {config.plans.map((plan) => {
            const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const isCurrent = user?.activePlan === plan.tier;

            return (
              <div
                key={plan.id}
                className={`glass-card rounded-[24px] p-6 md:p-7 flex flex-col justify-between ${
                  plan.highlighted
                    ? 'ring-2 ring-emerald-400/50'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h2 className="text-[20px] font-semibold text-[#0F172A]">
                      {pickText(plan.name)}
                    </h2>
                    {plan.highlighted && <Badge tone="primary">{t.pricing.mostPopular}</Badge>}
                  </div>
                  <p className="text-[14px] text-[#64748B] mb-6">{pickText(plan.tagline)}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[34px] font-bold text-[#0F172A]">
                        ${price.toFixed(2)}
                      </span>
                      {price > 0 && (
                        <span className="text-[14px] text-[#64748B]">
                          {billing === 'monthly' ? t.pricing.perMonth : t.pricing.perYear}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1">
                      {price === 0
                        ? pickText(plan.autoRenewNotice)
                        : `${billing === 'monthly' ? t.pricing.billedMonthly : t.pricing.billedYearly} · ${pickText(plan.autoRenewNotice)}`}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[14px]">
                        {feat.included ? (
                          <Check className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-[#CBD5E1] mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className={feat.included ? 'text-[#0F172A]' : 'text-[#94A3B8]'}>
                            {pickText(feat.label)}
                          </span>
                          {feat.detail && (
                            <p className="text-[12px] text-[#64748B]">{pickText(feat.detail)}</p>
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
        <section className="glass-card rounded-[24px] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E2E8F0]">
            <h2 className="text-h3 text-[#0F172A]">{t.pricing.comparisonTitle}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A]">
                  <th className="py-3.5 px-6">{t.pricing.featureCol}</th>
                  {config.plans.map((p) => (
                    <th key={p.id} className="py-3.5 px-6 text-center">
                      {pickText(p.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[14px]">
                {config.comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC]">
                    <td className="py-3.5 px-6 font-medium text-[#0F172A]">
                      {pickText(row.feature)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-[#64748B]">
                      {pickText(row.free)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-[#0F172A]">
                      {pickText(row.basic)}
                    </td>
                    <td className="py-3.5 px-6 text-center font-medium text-[#2563EB]">
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
            <Info className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-h2 text-[#0F172A] text-center">{t.pricing.faqTitle}</h2>
          </div>

          <div className="space-y-5">
            {config.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <article key={faq.id} className="glass-card rounded-[24px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-[17px] font-medium text-[#0F172A]">
                      {pickText(faq.question)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-[14px] text-[#64748B] leading-relaxed">
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

