import {
  MOCK_CATEGORIES,
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_TESTIMONIALS,
  MOCK_VIDEOS,
} from '@/data/mockCatalog';
import type {
  Category,
  Course,
  CourseFilterParams,
  Instructor,
  Testimonial,
  VideoItem,
} from '@/types';
import { API_CONFIG, apiRequest, delay } from './apiClient';

export interface PaginatedCoursesResult {
  items: Course[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const catalogService = {
  async getCategories(): Promise<Category[]> {
    if (!API_CONFIG.useMock) {
      return apiRequest<Category[]>('/categories');
    }
    await delay(80);
    return MOCK_CATEGORIES;
  },

  async getInstructors(): Promise<Instructor[]> {
    if (!API_CONFIG.useMock) {
      return apiRequest<Instructor[]>('/instructors');
    }
    await delay(80);
    return MOCK_INSTRUCTORS;
  },

  getInstructorById(id: string): Instructor | undefined {
    return MOCK_INSTRUCTORS.find((inst) => inst.id === id);
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return MOCK_CATEGORIES.find((cat) => cat.slug === slug);
  },

  async getFeaturedCourses(): Promise<Course[]> {
    if (!API_CONFIG.useMock) {
      return apiRequest<Course[]>('/courses?featured=true');
    }
    await delay(90);
    return MOCK_COURSES.filter((c) => c.featured);
  },

  async listCourses(params: CourseFilterParams = {}): Promise<PaginatedCoursesResult> {
    if (!API_CONFIG.useMock) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== 'all') qs.set(k, String(v));
      });
      return apiRequest<PaginatedCoursesResult>(`/courses?${qs.toString()}`);
    }

    await delay(120);
    let filtered = [...MOCK_COURSES];

    if (params.q && params.q.trim()) {
      const query = params.q.trim().toLowerCase();
      filtered = filtered.filter((c) => {
        const inst = MOCK_INSTRUCTORS.find((i) => i.id === c.instructorId);
        return (
          c.title.en.toLowerCase().includes(query) ||
          (c.title.km?.toLowerCase().includes(query) ?? false) ||
          c.subtitle.en.toLowerCase().includes(query) ||
          (inst?.name.toLowerCase().includes(query) ?? false)
        );
      });
    }

    if (params.category) {
      filtered = filtered.filter((c) => c.categorySlug === params.category);
    }

    if (params.difficulty) {
      filtered = filtered.filter((c) => c.difficulty === params.difficulty);
    }

    if (params.priceType === 'free') {
      filtered = filtered.filter((c) => c.price === 0);
    } else if (params.priceType === 'paid') {
      filtered = filtered.filter((c) => c.price > 0);
    }

    if (params.minRating && params.minRating > 0) {
      filtered = filtered.filter((c) => c.rating >= params.minRating!);
    }

    if (params.duration && params.duration !== 'all') {
      if (params.duration === 'short') {
        filtered = filtered.filter((c) => c.durationHours < 5);
      } else if (params.duration === 'medium') {
        filtered = filtered.filter((c) => c.durationHours >= 5 && c.durationHours <= 12);
      } else if (params.duration === 'long') {
        filtered = filtered.filter((c) => c.durationHours > 12);
      }
    }

    if (params.language) {
      filtered = filtered.filter(
        (c) => c.language === params.language || c.language === 'bilingual',
      );
    }

    if (params.instructorId) {
      filtered = filtered.filter((c) => c.instructorId === params.instructorId);
    }

    switch (params.sort) {
      case 'popular':
        filtered.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case 'newest':
        filtered.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
        break;
      case 'highest_rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'recommended':
      default:
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
        break;
    }

    const pageSize = params.pageSize ?? 6;
    const page = Math.max(1, params.page ?? 1);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      total,
      page: safePage,
      pageSize,
      totalPages,
    };
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    if (!API_CONFIG.useMock) {
      return apiRequest<Course | null>(`/courses/${slug}`);
    }
    await delay(90);
    return MOCK_COURSES.find((c) => c.slug === slug) ?? null;
  },

  async listVideos(params?: { q?: string; category?: string }): Promise<VideoItem[]> {
    if (!API_CONFIG.useMock) {
      const qs = new URLSearchParams();
      if (params?.q) qs.set('q', params.q);
      if (params?.category) qs.set('category', params.category);
      return apiRequest<VideoItem[]>(`/videos?${qs.toString()}`);
    }
    await delay(100);
    let list = [...MOCK_VIDEOS];
    if (params?.category) {
      list = list.filter((v) => v.categorySlug === params.category);
    }
    if (params?.q && params.q.trim()) {
      const query = params.q.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.title.en.toLowerCase().includes(query) ||
          (v.title.km?.toLowerCase().includes(query) ?? false) ||
          v.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }
    return list;
  },

  async getVideoBySlug(slug: string): Promise<VideoItem | null> {
    if (!API_CONFIG.useMock) {
      return apiRequest<VideoItem | null>(`/videos/${slug}`);
    }
    await delay(90);
    return MOCK_VIDEOS.find((v) => v.slug === slug) ?? null;
  },

  async getRelatedVideos(video: VideoItem): Promise<VideoItem[]> {
    await delay(60);
    return MOCK_VIDEOS.filter(
      (v) => v.id !== video.id && (v.categorySlug === video.categorySlug || v.trending),
    ).slice(0, 4);
  },

  async searchAll(query: string): Promise<{ courses: Course[]; videos: VideoItem[] }> {
    const q = query.trim().toLowerCase();
    if (!q) return { courses: [], videos: [] };
    await delay(80);
    return {
      courses: MOCK_COURSES.filter(
        (c) =>
          c.title.en.toLowerCase().includes(q) ||
          (c.title.km?.toLowerCase().includes(q) ?? false) ||
          c.subtitle.en.toLowerCase().includes(q),
      ).slice(0, 5),
      videos: MOCK_VIDEOS.filter(
        (v) =>
          v.title.en.toLowerCase().includes(q) ||
          (v.title.km?.toLowerCase().includes(q) ?? false) ||
          v.tags.some((t) => t.toLowerCase().includes(q)),
      ).slice(0, 5),
    };
  },

  async getTestimonials(): Promise<Testimonial[]> {
    await delay(60);
    return MOCK_TESTIMONIALS;
  },
};

