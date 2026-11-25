export type Locale = 'en' | 'km';

export interface LocalizedText {
  en: string;
  km?: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentLanguage = 'en' | 'km' | 'bilingual';
export type VideoAccessType = 'free' | 'subscription' | 'premium';
export type PlanTier = 'free' | 'basic' | 'premium';
export type BillingCycle = 'monthly' | 'yearly';

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  courseCount: number;
  videoCount: number;
  accentColor: string;
}

export interface Instructor {
  id: string;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  avatarColor: string;
  initials: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface CourseLesson {
  id: string;
  title: LocalizedText;
  durationMinutes: number;
  isPreview: boolean;
  type: 'video' | 'reading' | 'quiz';
}

export interface CourseSection {
  id: string;
  title: LocalizedText;
  lessons: CourseLesson[];
}

export interface CourseReview {
  id: string;
  authorName: string;
  authorRole: LocalizedText;
  rating: number;
  date: string;
  comment: LocalizedText;
}

export interface Course {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  categorySlug: string;
  instructorId: string;
  difficulty: DifficultyLevel;
  durationHours: number;
  lessonsCount: number;
  language: ContentLanguage;
  price: number; // 0 for free
  originalPrice?: number;
  includedInPlans: PlanTier[];
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  lastUpdated: string;
  thumbnailTheme: string;
  thumbnailLabel: string;
  featured: boolean;
  outcomes: LocalizedText[];
  requirements: LocalizedText[];
  curriculum: CourseSection[];
  reviews: CourseReview[];
}

export interface VideoItem {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  categorySlug: string;
  instructorId: string;
  durationMinutes: number;
  publishedAt: string;
  accessType: VideoAccessType;
  requiredPlans: PlanTier[];
  viewsCount: number;
  featured?: boolean;
  trending?: boolean;
  recommended?: boolean;
  recentlyAdded?: boolean;
  thumbnailTheme: string;
  tags: string[];
}

export interface SubscriptionPlanFeature {
  label: LocalizedText;
  included: boolean;
  detail?: LocalizedText;
}

export interface SubscriptionPlan {
  id: string;
  tier: PlanTier;
  name: LocalizedText;
  tagline: LocalizedText;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: 'USD';
  taxRate: number;
  highlighted?: boolean;
  autoRenewNotice: LocalizedText;
  cancellationPolicy: LocalizedText;
  features: SubscriptionPlanFeature[];
}

export interface Testimonial {
  id: string;
  name: string;
  persona: LocalizedText;
  quote: LocalizedText;
  rating: number;
  initials: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  preferredLanguage: Locale;
  activePlan: PlanTier;
  billingCycle?: BillingCycle;
  purchasedCourseIds: string[];
  enrolledFreeCourseIds: string[];
  watchlistVideoIds: string[];
}

export type CourseSortOption =
  | 'recommended'
  | 'popular'
  | 'newest'
  | 'highest_rated'
  | 'price_asc'
  | 'price_desc';

export interface CourseFilterParams {
  q?: string;
  category?: string;
  difficulty?: DifficultyLevel | '';
  priceType?: 'all' | 'free' | 'paid';
  minRating?: number;
  duration?: 'all' | 'short' | 'medium' | 'long';
  language?: ContentLanguage | '';
  instructorId?: string;
  sort?: CourseSortOption;
  page?: number;
  pageSize?: number;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  description: LocalizedText;
}

export type PaymentMethod = 'card' | 'khqr' | 'bank_transfer';
export type PaymentVerificationStatus = 'idle' | 'pending' | 'verified' | 'failed';

export interface OrderRecord {
  orderId: string;
  type: 'course' | 'subscription';
  itemTitle: LocalizedText;
  itemSlugOrTier: string;
  billingCycle?: BillingCycle;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  status: PaymentVerificationStatus;
  createdAt: string;
  message?: string;
}

