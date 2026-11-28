import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Check, ChevronDown, Info, X } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { API_CONFIG } from '@/services/apiClient';
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
    <div className="min-h-screen">
      <PageHero
        eyebrow="MEMBERSHIP & BILLING"
        title={t.pricing.title}
        description={t.pricing.subtitle}
      >
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1 rounded-full bg-[#e5dfd2] dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E]">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`font-mono-tech px-4 py-2 rounded-full text-[11.5px] uppercase tracking-[0.06em] font-medium transition-colors cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-[#1c5b48] text-white dark:bg-[#2D7A62]'
                  : 'text-[#6e6a62] hover:text-[#141312]'
              }`}
            >
              {t.pricing.monthly}
            </button>
            <button
              type="button"
              onClick={() => setBilling('yearly')}
              className={`font-mono-tech px-4 py-2 rounded-full text-[11.5px] uppercase tracking-[0.06em] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-[#1c5b48] text-white dark:bg-[#2D7A62]'
                  : 'text-[#6e6a62] hover:text-[#141312]'
              }`}
            >
              <span>{t.pricing.yearly}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  billing === 'yearly'
                    ? 'bg-white text-[#1c5b48]'
                    : 'bg-[#e4ede7] text-[#1c5b48] border border-[#c5d6cb]'
                }`}
              >
                {t.pricing.saveYearly}
              </span>
            </button>
          </div>
        </div>
      </PageHero>

      <div className="surface-dots py-12 md:py-16">
      <div className="container-page space-y-14">

      {/* Pricing Cards (Dynamic from pricingService) */}
      {!config ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {config.plans.map((plan, idx) => {
            const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const isCurrent = user?.activePlan === plan.tier;

            return (
              <article
                key={plan.id}
                data-reveal="true"
                className={`card-note group p-6 md:p-7 flex flex-col justify-between ${
                  plan.highlighted
                    ? '!border-[#1c5b48] dark:!border-[#2D7A62] ring-1 ring-[#1c5b48] dark:ring-[#2D7A62] shadow-[0_20px_48px_-20px_rgba(27,77,62,0.22)]'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#3E4D45] mb-4">
                    <span className="index-number">
                      PLAN · 0{idx + 1}
                    </span>
                    {plan.highlighted && <Badge tone="primary">{t.pricing.mostPopular}</Badge>}
                  </div>

                  <h2 className="font-serif-display text-[26px] font-medium tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] mb-1.5">
                    {pickText(plan.name)}
                  </h2>
                  <p className="text-[14.5px] leading-[1.6] text-[#6e6a62] mb-6">{pickText(plan.tagline)}</p>

                  <div className="mb-6 pb-6 border-b border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#3E4D45]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif-display text-[42px] font-medium tracking-[-0.03em] tabular-nums text-[#141312] dark:text-[#f6f3ec]">
                        ${price.toFixed(2)}
                      </span>
                      {price > 0 && (
                        <span className="font-mono-tech text-[12px] text-[#6e6a62]">
                          {billing === 'monthly' ? t.pricing.perMonth : t.pricing.perYear}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-[4px] text-[12px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                        {price === 0
                          ? pickText(plan.autoRenewNotice)
                          : `${billing === 'monthly' ? t.pricing.billedMonthly : t.pricing.billedYearly}`}
                      </span>
                      {price > 0 && (
                        <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-[4px] text-[12px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                          {pickText(plan.autoRenewNotice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-[14px]">
                        {feat.included ? (
                          <Check className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] mt-0.5 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-[#6e6a62]/40 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span
                            className={
                              feat.included
                                ? 'text-[#141312] dark:text-[#f6f3ec]'
                                : 'text-[#6e6a62]/50'
                            }
                          >
                            {pickText(feat.label)}
                          </span>
                          {feat.detail && (
                            <p className="text-[12px] text-[#6e6a62]">{pickText(feat.detail)}</p>
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
                  <a href={`${API_CONFIG.userAppUrl}/register`} className="block">
                    <Button
                      variant="outline"
                      fullWidth
                      rightIcon={<ArrowUpRight className="h-4 w-4" />}
                    >
                      {t.pricing.getStartedFree}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    fullWidth
                    rightIcon={<ArrowUpRight className="h-4 w-4" />}
                    onClick={() =>
                      navigate(`/checkout?type=subscription&plan=${plan.tier}&billing=${billing}`)
                    }
                  >
                    {t.pricing.subscribeNow}
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Feature Comparison Table — Havenline Sage-Highlighted Column */}
      {config && (
        <section className="swiss-surface overflow-hidden">
          <div className="px-6 py-5 border-b border-[#ded8ca] dark:border-[#2A332E] flex items-center justify-between">
            <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
              {t.pricing.comparisonTitle}
            </h2>
            <span className="swiss-eyebrow">
              <span className="swiss-dot" aria-hidden="true" />
              <span>MATRIX</span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#e5dfd2]/75 dark:bg-[#181E1B] border-b border-[#ded8ca] dark:border-[#2A332E] font-mono-tech text-[11px] uppercase tracking-[0.08em] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                  <th className="py-4 px-6">{t.pricing.featureCol}</th>
                  {config.plans.map((p) => (
                    <th
                      key={p.id}
                      className={`py-4 px-6 text-center ${
                        p.highlighted
                          ? 'bg-[#e4ede7] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5]'
                          : ''
                      }`}
                    >
                      {pickText(p.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] text-[14px]">
                {config.comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#e5dfd2]/40 dark:hover:bg-[#181E1B] transition-colors"
                  >
                    <td className="py-3.5 px-6 font-medium text-[#141312] dark:text-[#f6f3ec]">
                      {pickText(row.feature)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-[#6e6a62]">
                      {pickText(row.free)}
                    </td>
                    <td className="py-3.5 px-6 text-center font-medium text-[#1c5b48] dark:text-[#7CD4B5] bg-[#e4ede7]/55 dark:bg-[#1B3028]/55">
                      {pickText(row.basic)}
                    </td>
                    <td className="py-3.5 px-6 text-center font-semibold text-[#141312] dark:text-[#f6f3ec]">
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

      {/* Pricing FAQ Accordion — Havenline Warm Stone Card Container */}
      {config && (
        <section className="max-w-4xl mx-auto rounded-2xl bg-[#e5dfd2]/65 dark:bg-[#141916] border border-[#ded8ca] dark:border-[#2A332E] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ded8ca] dark:border-[#2A332E]">
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
              <h2 className="text-h2 text-[#141312] dark:text-[#f6f3ec]">{t.pricing.faqTitle}</h2>
            </div>
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.08em] text-[#6e6a62]">
              FAQ
            </span>
          </div>

          <div className="space-y-3">
            {config.faqs.map((faq, idx) => {
              const isOpen = openFaqId === faq.id;
              return (
                <article
                  key={faq.id}
                  className="rounded-xl border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#e5dfd2]/40 dark:hover:bg-[#181E1B] transition-colors"
                  >
                    <span className="text-[15.5px] font-semibold tracking-[-0.01em] text-[#141312] dark:text-[#f6f3ec]">
                      <span className="font-mono-tech text-[11px] text-[#1c5b48] dark:text-[#7CD4B5] mr-3">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {pickText(faq.question)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#6e6a62] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pl-12 text-[14px] text-[#6e6a62] leading-relaxed">
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
      </div>
    </div>
  );
};
