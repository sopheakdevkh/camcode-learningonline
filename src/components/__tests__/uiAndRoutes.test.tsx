import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '@/App';
import { CourseCard } from '@/components/cards/CourseCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBoundaryInner, ErrorFallback, isChunkLoadFailure } from '@/components/ui/ErrorBoundary';
import { ErrorState } from '@/components/ui/ErrorState';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Tabs } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/Textarea';
import { Tooltip } from '@/components/ui/Tooltip';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MOCK_COURSES, MOCK_VIDEOS } from '@/data/mockCatalog';
import { I18nProvider } from '@/i18n/I18nContext';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PricingPage } from '@/pages/PricingPage';
import { AboutPage, ContactPage, FaqPage, PrivacyPage, TermsPage } from '@/pages/StaticPages';
import { VideosPage } from '@/pages/VideosPage';

const NESTED_BUTTON_IN_ANCHOR_RE = /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<button\b/;

function renderWithProviders(ui: React.ReactElement, initialEntries: string[] = ['/']) {
  return renderToStaticMarkup(
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>,
  );
}

describe('Shared UI Primitives', () => {
  it('renders Button variants, loading state, and buttonClasses helper', () => {
    const html = renderToStaticMarkup(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
        <Button variant="outline" success>
          Done
        </Button>
      </>,
    );
    expect(html).toContain('Primary');
    expect(html).toContain('animate-spin');
    expect(html).toContain('Done');
    expect(buttonClasses({ variant: 'primary', size: 'lg' })).toContain('h-12');
  });

  it('renders Input with accessible label, error, and aria-invalid', () => {
    const html = renderToStaticMarkup(
      <Input label="Email address" error="Invalid email" defaultValue="bad" />,
    );
    expect(html).toContain('Email address');
    expect(html).toContain('Invalid email');
    expect(html).toContain('aria-invalid="true"');
  });

  it('renders Dropdown, Alert, and Badge with proper roles', () => {
    const html = renderToStaticMarkup(
      <>
        <Badge tone="success">Free</Badge>
        <Alert tone="error" title="Failure">
          Could not verify
        </Alert>
        <Dropdown
          label="Language"
          value="en"
          options={[
            { value: 'en', label: 'English' },
            { value: 'km', label: 'Khmer' },
          ]}
        />
      </>,
    );
    expect(html).toContain('Free');
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('English');

    const enFlag = renderToStaticMarkup(<FlagIcon lang="en" />);
    const kmFlag = renderToStaticMarkup(<FlagIcon lang="km" />);
    expect(enFlag).toContain('#012169');
    expect(kmFlag).toContain('#032EA1');
    expect(kmFlag).toContain('#E00025');
  });

  it('renders Card, Select, Textarea, Tabs, Table, Breadcrumbs, EmptyState, ErrorState, PageHeader, and Tooltip', () => {
    const html = renderWithProviders(
      <>
        <PageHeader
          eyebrow="Catalog"
          title="Courses"
          description="Structured learning paths"
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Courses' }]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Module 1</CardTitle>
            <CardDescription>Intro</CardDescription>
          </CardHeader>
          <CardContent>
            <Select label="Level" defaultValue="beginner">
              <option value="beginner">Beginner</option>
            </Select>
            <Textarea label="Notes" error="Required" />
            <Tabs
              ariaLabel="Billing"
              value="monthly"
              onChange={() => {}}
              items={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Basic</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Tooltip content="More details">
              <button type="button">Info</button>
            </Tooltip>
          </CardFooter>
        </Card>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Detail' }]} />
        <EmptyState title="No items" description="Adjust filters" />
        <ErrorState message="Load failed" onRetry={() => {}} />
      </>,
    );
    expect(html).toContain('Module 1');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('No items');
    expect(html).toContain('Load failed');
  });
});

describe('Layout, Cards & Navigation Integrity', () => {
  it('renders PublicHeader without nested interactive button inside anchor and keeps mobile hidden class clean', () => {
    const html = renderWithProviders(<PublicHeader />);
    expect(html).toContain('Camcode');
    expect(html).toContain('href="http://localhost:3001/login"');
    expect(html).not.toContain('href="/login"');
    expect(html).not.toContain('href="/register"');
    expect(html).not.toMatch(/class="hidden min-\[375px\]:inline-flex[^"]*inline-flex/);
    expect(html).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);
  });

  it('renders CourseCard and VideoCard cleanly with real Lucide icons and no nested buttons', () => {
    const courseHtml = renderWithProviders(<CourseCard course={MOCK_COURSES[0]} />);
    expect(courseHtml).toContain(MOCK_COURSES[0].title.en);
    expect(courseHtml).toContain(`href="/courses/${MOCK_COURSES[0].slug}"`);
    expect(courseHtml).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);

    const videoHtml = renderWithProviders(<VideoCard video={MOCK_VIDEOS[0]} />);
    expect(videoHtml).toContain(MOCK_VIDEOS[0].title.en);
    expect(videoHtml).toContain(`href="/videos/${MOCK_VIDEOS[0].slug}"`);
    expect(videoHtml).toContain('lucide-play');
    expect(videoHtml).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);
  });
});

describe('Routing, 404 Page & Error Boundary', () => {
  it('renders HomePage on "/" route with Havenline home sections, 100% real libraries, 2026 dates, and skip link', () => {
    const html = renderWithProviders(<AppRoutes />, ['/']);
    expect(html).toContain('id="main-content"');
    expect(html).toContain('Skip to main content');
    expect(html).toContain('Learn what works. Know when it ships.');
    expect(html).toContain('Complete Digital Marketing Course');
    expect(html).toContain('Building Bilingual SaaS Products for Southeast Asia');
    expect(html).toContain('John Instructor');
    expect(html).toContain('Sophea Meas');
    expect(html).toContain('Five steps, one learning path');
    expect(html).toContain('The numbers we are judged on');
    expect(html).toContain('Two ways to build your skills');
    expect(html).toContain('The six we are asked most');
    expect(html).toContain('2026-11-26');
    expect(html).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);
  });

  it('renders CoursesPage on "/courses" with Havenline Atlas Grocers UI, real libraries, and 2026 dates', () => {
    const html = renderWithProviders(<CoursesPage />, ['/courses']);
    expect(html).toContain('Master real skills from Module 01 to verified mastery');
    expect(html).toContain('Complete Digital Marketing Course');
    expect(html).toContain('Modern React &amp; TypeScript Architecture');
    expect(html).toContain('The problem');
    expect(html).toContain('What we changed');
    expect(html).toContain('Four phases across every learning track');
    expect(html).toContain('Twelve months across our 2026 library');
    expect(html).toContain('Other tracks in our library');
    expect(html).toContain('Nov 2026');
    expect(html).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);
  });

  it('renders CourseDetailPage on "/courses/:slug" with Havenline Atlas Grocers case-study sections', () => {
    const html = renderWithProviders(
      <Routes>
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
      </Routes>,
      ['/courses/complete-digital-marketing-course'],
    );
    expect(html).toContain('Complete Digital Marketing Course');
    expect(html).toContain('John Instructor');
    expect(html).toContain('What this course solves');
    expect(html).toContain('What you will master');
    expect(html).toContain('Curriculum phases &amp; modules');
    expect(html).toContain('Verified outcomes &amp; course metrics');
    expect(html).toContain('Other courses you can explore');
    expect(html).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);
  });

  it('renders NotFoundPage with 404 indicator, Return Home, Courses, and Videos links', () => {
    const html = renderWithProviders(<NotFoundPage />);
    expect(html).toContain('404');
    expect(html).toContain('Return Home');
    expect(html).toContain('href="/courses"');
    expect(html).toContain('href="/videos"');
    expect(html).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);
  });

  it('derives error state for runtime and lazy chunk failures and renders safe fallback UI', () => {
    expect(isChunkLoadFailure(new Error('Failed to fetch dynamically imported module'))).toBe(true);
    expect(isChunkLoadFailure(new Error('Unexpected render bug'))).toBe(false);

    const derived = ErrorBoundaryInner.getDerivedStateFromError(
      new Error('Sensitive internal stack detail'),
    );
    expect(derived).toEqual({ hasError: true, isChunkError: false });

    const html = renderWithProviders(
      <ErrorFallback
        title="Something went wrong loading this view"
        description="An unexpected error occurred while rendering this page."
        retryLabel="Retry"
        homeLabel="Return Home"
        onRetry={() => {}}
      />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('Something went wrong loading this view');
    expect(html).toContain('Retry');
    expect(html).toContain('Return Home');
    expect(html).not.toContain('Sensitive internal stack detail');
  });

  it('resolves all lazy-loaded page modules without import errors', async () => {
    const modules = await Promise.all([
      import('@/pages/HomePage'),
      import('@/pages/CoursesPage'),
      import('@/pages/CourseDetailPage'),
      import('@/pages/VideosPage'),
      import('@/pages/VideoDetailPage'),
      import('@/pages/CategoriesPage'),
      import('@/pages/PricingPage'),
      import('@/pages/CheckoutPage'),
      import('@/pages/StaticPages'),
      import('@/pages/NotFoundPage'),
    ]);
    expect(modules.every(Boolean)).toBe(true);
  });

  it('renders all primary pages cleanly without nested interactive buttons inside anchors', () => {
    const pages = [
      <CoursesPage key="courses" />,
      <VideosPage key="videos" />,
      <CategoriesPage key="categories" />,
      <PricingPage key="pricing" />,
      <CheckoutPage key="checkout" />,
      <AboutPage key="about" />,
      <ContactPage key="contact" />,
      <TermsPage key="terms" />,
      <PrivacyPage key="privacy" />,
      <FaqPage key="faq" />,
    ];

    for (const page of pages) {
      const html = renderWithProviders(page);
      expect(html.length).toBeGreaterThan(100);
      expect(html).not.toMatch(NESTED_BUTTON_IN_ANCHOR_RE);
    }
  });
});
