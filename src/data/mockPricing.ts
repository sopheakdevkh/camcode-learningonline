import type { Coupon, SubscriptionPlan } from '@/types';

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    tier: 'free',
    name: { en: 'Free', km: 'ឥតគិតថ្លៃ' },
    tagline: {
      en: 'Explore public videos, previews, and free foundational courses.',
      km: 'ទស្សនាវីដេអូសាធារណៈ មើលវគ្គសាកល្បង និងរៀនវគ្គសិក្សាឥតគិតថ្លៃ។',
    },
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'USD',
    taxRate: 0,
    autoRenewNotice: {
      en: 'No payment card required. Free forever.',
      km: 'មិនតម្រូវឱ្យមានកាតបង់ប្រាក់ទេ។ ឥតគិតថ្លៃជារៀងរហូត។',
    },
    cancellationPolicy: {
      en: 'No billing obligations.',
      km: 'គ្មានកាតព្វកិច្ចបង់ប្រាក់ឡើយ។',
    },
    features: [
      {
        label: { en: 'Access to public free videos', km: 'ទស្សនាវីដេអូសាធារណៈឥតគិតថ្លៃ' },
        included: true,
      },
      {
        label: { en: 'Limited course lesson previews', km: 'មើលមេរៀនសាកល្បងនៃវគ្គសិក្សា' },
        included: true,
      },
      {
        label: { en: 'Free open-enrollment courses', km: 'ចុះឈ្មោះរៀនវគ្គសិក្សាឥតគិតថ្លៃ' },
        included: true,
      },
      {
        label: { en: 'Standard subscription video library', km: 'បណ្ណាល័យវីដេអូសមាជិកស្តង់ដារ' },
        included: false,
      },
      {
        label: { en: 'Premium exclusive videos & selected courses', km: 'វីដេអូពិសេស (Premium) និងវគ្គសិក្សាជ្រើសរើស' },
        included: false,
      },
    ],
  },
  {
    id: 'plan-basic',
    tier: 'basic',
    name: { en: 'Basic', km: 'មូលដ្ឋាន (Basic)' },
    tagline: {
      en: 'Ideal for consistent viewers wanting standard subscription content.',
      km: 'សាកសមសម្រាប់អ្នកទស្សនាប្រចាំដែលត្រូវការបណ្ណាល័យវីដេអូស្តង់ដារ។',
    },
    monthlyPrice: 9.0,
    yearlyPrice: 86.0,
    currency: 'USD',
    taxRate: 0.1,
    highlighted: true,
    autoRenewNotice: {
      en: 'Auto-renews each billing cycle until cancelled.',
      km: 'បន្តដោយស្វ័យប្រវត្តិតាមវដ្តនីមួយៗរហូតដល់មានការបោះបង់។',
    },
    cancellationPolicy: {
      en: 'Cancel anytime; access continues until period end.',
      km: 'អាចបោះបង់បានគ្រប់ពេល; សិទ្ធិនៅតែប្រើបានរហូតដល់ចប់វដ្ត។',
    },
    features: [
      {
        label: { en: 'Access to public free videos', km: 'ទស្សនាវីដេអូសាធារណៈឥតគិតថ្លៃ' },
        included: true,
      },
      {
        label: { en: 'Limited course lesson previews', km: 'មើលមេរៀនសាកល្បងនៃវគ្គសិក្សា' },
        included: true,
      },
      {
        label: { en: 'Free open-enrollment courses', km: 'ចុះឈ្មោះរៀនវគ្គសិក្សាឥតគិតថ្លៃ' },
        included: true,
      },
      {
        label: { en: 'Standard subscription video library', km: 'បណ្ណាល័យវីដេអូសមាជិកស្តង់ដារ' },
        included: true,
        detail: { en: 'Includes Basic-tier courses', km: 'រួមបញ្ចូលវគ្គសិក្សាកម្រិត Basic' },
      },
      {
        label: { en: 'Personal watchlist & watch history sync', km: 'រក្សាទុកបញ្ជីមើល និងប្រវត្តិទស្សនា' },
        included: true,
      },
      {
        label: { en: 'Premium exclusive videos & flagship courses', km: 'វីដេអូ Premium និងវគ្គសិក្សាពិសេស' },
        included: false,
      },
    ],
  },
  {
    id: 'plan-premium',
    tier: 'premium',
    name: { en: 'Premium', km: 'ពិសេស (Premium)' },
    tagline: {
      en: 'Full eligible premium video library plus included flagship courses.',
      km: 'ទស្សនាបណ្ណាល័យវីដេអូ Premium ពេញលេញ និងវគ្គសិក្សាសំខាន់ៗ។',
    },
    monthlyPrice: 19.0,
    yearlyPrice: 182.0,
    currency: 'USD',
    taxRate: 0.1,
    autoRenewNotice: {
      en: 'Auto-renews each billing cycle until cancelled.',
      km: 'បន្តដោយស្វ័យប្រវត្តិតាមវដ្តនីមួយៗរហូតដល់មានការបោះបង់។',
    },
    cancellationPolicy: {
      en: 'Cancel anytime; access continues until period end.',
      km: 'អាចបោះបង់បានគ្រប់ពេល; សិទ្ធិនៅតែប្រើបានរហូតដល់ចប់វដ្ត។',
    },
    features: [
      {
        label: { en: 'Access to public free videos', km: 'ទស្សនាវីដេអូសាធារណៈឥតគិតថ្លៃ' },
        included: true,
      },
      {
        label: { en: 'Free open-enrollment courses', km: 'ចុះឈ្មោះរៀនវគ្គសិក្សាឥតគិតថ្លៃ' },
        included: true,
      },
      {
        label: { en: 'Standard subscription video library', km: 'បណ្ណាល័យវីដេអូសមាជិកស្តង់ដារ' },
        included: true,
      },
      {
        label: { en: 'Personal watchlist & watch history sync', km: 'រក្សាទុកបញ្ជីមើល និងប្រវត្តិទស្សនា' },
        included: true,
      },
      {
        label: { en: 'Full eligible Premium video library', km: 'បណ្ណាល័យវីដេអូ Premium ពេញលេញ' },
        included: true,
      },
      {
        label: { en: 'Eligible Premium courses & priority certificates', km: 'វគ្គសិក្សាកម្រិត Premium និងវិញ្ញាបនបត្រ' },
        included: true,
      },
    ],
  },
];

export const MOCK_COMPARISON_ROWS = [
  {
    feature: { en: 'Public free videos & previews', km: 'វីដេអូសាធារណៈឥតគិតថ្លៃ' },
    free: { en: 'Included', km: 'មាន' },
    basic: { en: 'Included', km: 'មាន' },
    premium: { en: 'Included', km: 'មាន' },
  },
  {
    feature: { en: 'Free courses & completion certificates', km: 'វគ្គសិក្សាឥតគិតថ្លៃ និងវិញ្ញាបនបត្រ' },
    free: { en: 'Included', km: 'មាន' },
    basic: { en: 'Included', km: 'មាន' },
    premium: { en: 'Included', km: 'មាន' },
  },
  {
    feature: { en: 'Standard subscription video library', km: 'បណ្ណាល័យវីដេអូស្តង់ដារ' },
    free: { en: '—', km: '—' },
    basic: { en: 'Included', km: 'មាន' },
    premium: { en: 'Included', km: 'មាន' },
  },
  {
    feature: { en: 'Streaming quality', km: 'គុណភាពវីដេអូ' },
    free: { en: 'Standard (720p)', km: 'ស្តង់ដារ (720p)' },
    basic: { en: 'HD (1080p)', km: 'HD (1080p)' },
    premium: { en: 'Full HD / 4K where available', km: 'Full HD / 4K តាមមាតិកា' },
  },
  {
    feature: { en: 'Watchlist & watch history sync', km: 'រក្សាទុកបញ្ជីមើល និងប្រវត្តិទស្សនា' },
    free: { en: 'Limited', km: 'មានកំណត់' },
    basic: { en: 'Included', km: 'មាន' },
    premium: { en: 'Included', km: 'មាន' },
  },
  {
    feature: { en: 'Premium exclusive videos', km: 'វីដេអូផ្តាច់មុខ Premium' },
    free: { en: '—', km: '—' },
    basic: { en: '—', km: '—' },
    premium: { en: 'Included', km: 'មាន' },
  },
  {
    feature: { en: 'Eligible included courses', km: 'វគ្គសិក្សាដែលរួមបញ្ចូលក្នុងគម្រោង' },
    free: { en: 'Free courses only', km: 'តែវគ្គឥតគិតថ្លៃ' },
    basic: { en: 'Selected Basic courses', km: 'វគ្គ Basic ជ្រើសរើស' },
    premium: { en: 'All eligible plan courses', km: 'វគ្គសិក្សាដែលមានសិទ្ធិទាំងអស់' },
  },
];

export const MOCK_PRICING_FAQS = [
  {
    id: 'faq-p1',
    question: {
      en: 'Does a subscription include every individual course on the platform?',
      km: 'តើការជាវគម្រោងរួមបញ្ចូលវគ្គសិក្សាទាំងអស់នៅលើថ្នាលដែរឬទេ?',
    },
    answer: {
      en: 'Each plan includes the video library and course tiers explicitly configured for that tier. Some specialized courses remain individual one-time purchases unless included in Premium.',
      km: 'គម្រោងនីមួយៗរួមបញ្ចូលតែបណ្ណាល័យវីដេអូ និងវគ្គសិក្សាដែលបានកំណត់សម្រាប់គម្រោងនោះប៉ុណ្ណោះ។ វគ្គសិក្សាឯកទេសខ្លះអាចទិញដាច់ដោយឡែក។',
    },
  },
  {
    id: 'faq-p2',
    question: {
      en: 'Can I buy a single course without subscribing?',
      km: 'តើខ្ញុំអាចទិញវគ្គសិក្សាតែមួយដោយមិនបាច់ជាវប្រចាំខែបានទេ?',
    },
    answer: {
      en: 'Yes. Any paid course in the Course Marketplace can be purchased individually with a one-time payment.',
      km: 'បាន។ វគ្គសិក្សាគិតថ្លៃណាមួយក្នុងទីផ្សារវគ្គសិក្សា អាចទិញដាច់ដោយឡែកដោយបង់ប្រាក់ម្តង។',
    },
  },
  {
    id: 'faq-p3',
    question: {
      en: 'How do auto-renewal and cancellation work?',
      km: 'តើការបន្តដោយស្វ័យប្រវត្តិ និងការបោះបង់ដំណើរការដូចម្តេច?',
    },
    answer: {
      en: 'Paid plans renew automatically at the end of your monthly or yearly cycle. You can cancel anytime prior to renewal and keep access until the paid period ends.',
      km: 'គម្រោងបង់ប្រាក់បន្តដោយស្វ័យប្រវត្តិនៅចុងវដ្តប្រចាំខែ ឬប្រចាំឆ្នាំ។ អ្នកអាចបោះបង់បានគ្រប់ពេល ហើយនៅតែប្រើបានដល់ចប់រយៈពេលដែលបានបង់។',
    },
  },
  {
    id: 'faq-p4',
    question: {
      en: 'Are taxes shown before I pay?',
      km: 'តើពន្ធត្រូវបានបង្ហាញមុនពេលបង់ប្រាក់ដែរឬទេ?',
    },
    answer: {
      en: 'Yes. Subtotal, coupon discounts, applicable taxes, and the final total are all itemized clearly on the Checkout page before you submit payment.',
      km: 'បាទ/ចាស។ តម្លៃដើម ការបញ្ចុះតម្លៃ ពន្ធ និងតម្លៃសរុបត្រូវបានបង្ហាញយ៉ាងច្បាស់លើទំព័រ Checkout មុនពេលបង់ប្រាក់។',
    },
  },
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'SAVE20',
    discountType: 'percent',
    value: 20,
    description: { en: '20% off your order', km: 'បញ្ចុះតម្លៃ ២០% លើការបញ្ជាទិញ' },
  },
  {
    code: 'KHMER10',
    discountType: 'percent',
    value: 10,
    description: { en: '10% community discount', km: 'បញ្ចុះតម្លៃសហគមន៍ ១០%' },
  },
  {
    code: 'WELCOME5',
    discountType: 'fixed',
    value: 5,
    description: { en: '$5.00 welcome credit', km: 'បញ្ចុះតម្លៃ $5.00 សម្រាប់សមាជិកថ្មី' },
  },
];

