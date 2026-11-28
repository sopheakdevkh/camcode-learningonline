import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Star,
  Users,
  Video,
} from 'lucide-react';
import { Course, Instructor, VideoItem } from '@/types';
import { catalogService } from '@/services/catalogService';
import { useI18n } from '@/i18n/I18nContext';
import { CourseCard } from '@/components/cards/CourseCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { PageHero } from '@/components/layout/PageHero';
import { Modal } from '@/components/ui/Modal';
import { CardSkeleton } from '@/components/ui/Skeleton';

// Subtle architectural plate tones derived strictly from the Havenline canvas palette
const PORTRAIT_TONES = [
  {
    canvas: 'bg-gradient-to-b from-[#e4ede7] via-[#efebe1] to-[#f6f3ec] dark:from-[#1B2B24] dark:via-[#181E1B] dark:to-[#151A17]',
    arch: 'bg-[#1c5b48]/10 border-[#1c5b48]/20 dark:bg-[#7CD4B5]/10 dark:border-[#7CD4B5]/20',
    accent: 'text-[#1c5b48] dark:text-[#7CD4B5]',
  },
  {
    canvas: 'bg-gradient-to-b from-[#e5dfd2] via-[#efebe1] to-[#f6f3ec] dark:from-[#23201B] dark:via-[#191B18] dark:to-[#151A17]',
    arch: 'bg-[#141312]/8 border-[#141312]/15 dark:bg-[#f6f3ec]/8 dark:border-[#f6f3ec]/15',
    accent: 'text-[#141312] dark:text-[#f6f3ec]',
  },
  {
    canvas: 'bg-gradient-to-b from-[#1f2622] via-[#27312C] to-[#f6f3ec] dark:from-[#0C100E] dark:via-[#131916] dark:to-[#151A17]',
    arch: 'bg-white/10 border-white/15',
    accent: 'text-white',
    isDarkPlate: true,
  },
  {
    canvas: 'bg-gradient-to-b from-[#e4ede7] via-[#efebe1] to-[#f6f3ec] dark:from-[#18241E] dark:via-[#141312] dark:to-[#151A17]',
    arch: 'bg-[#1c5b48]/12 border-[#1c5b48]/22 dark:bg-[#7CD4B5]/12 dark:border-[#7CD4B5]/20',
    accent: 'text-[#1c5b48] dark:text-[#7CD4B5]',
  },
];

export const TrainersPage: React.FC = () => {
  const { locale, pickText, formatNumber } = useI18n();

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState<Instructor | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      catalogService.getInstructors(),
      catalogService.listCourses({ pageSize: 100 }),
      catalogService.listVideos(),
    ])
      .then(([instList, courseRes, videoList]) => {
        if (cancelled) return;
        setInstructors(instList);
        setCourses(courseRes.items);
        setVideos(videoList);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const coursesByInstructor = useMemo(() => {
    const map: Record<string, Course[]> = {};
    for (const c of courses) {
      if (!map[c.instructorId]) map[c.instructorId] = [];
      map[c.instructorId].push(c);
    }
    return map;
  }, [courses]);

  const videosByInstructor = useMemo(() => {
    const map: Record<string, VideoItem[]> = {};
    for (const v of videos) {
      if (!map[v.instructorId]) map[v.instructorId] = [];
      map[v.instructorId].push(v);
    }
    return map;
  }, [videos]);

  const selectedTrainerCourses = selectedTrainer
    ? coursesByInstructor[selectedTrainer.id] ?? []
    : [];
  const selectedTrainerVideos = selectedTrainer
    ? videosByInstructor[selectedTrainer.id] ?? []
    : [];

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow={locale === 'km' ? 'គ្រូបង្រៀនជំនាញ' : 'Practitioner Faculty'}
        title={
          locale === 'km' ? (
            <>
              ជួបជាមួយគ្រូបង្រៀន និងស្វែងរក{' '}
              <span className="italic text-[#1c5b48] dark:text-[#7CD4B5]">វគ្គសិក្សារបស់ពួកគាត់</span>
            </>
          ) : (
            <>
              Meet trainers and explore their{' '}
              <span className="italic text-[#1c5b48] dark:text-[#7CD4B5]">courses</span>.
            </>
          )
        }
        description={
          locale === 'km'
            ? 'រៀនដោយផ្ទាល់ពីអ្នកជំនាញឧស្សាហកម្មជាមួយមេរៀនរចនាសម្ព័ន្ធ វីដេអូសិក្ខាសាលា និងបទពិសោធន៍អនុវត្តពិតប្រាកដ។'
            : 'Meet trainers and explore their courses, video workshops, and verified credentials across software, design, marketing, and business.'
        }
      />

      {/* Big-Size Trainer Portrait Cards Grid */}
      <section className="surface-dots py-14 sm:py-18">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {instructors.map((inst, index) => {
                const tone = PORTRAIT_TONES[index % PORTRAIT_TONES.length];
                const taughtCourses = coursesByInstructor[inst.id] ?? [];
                const taughtVideos = videosByInstructor[inst.id] ?? [];

                return (
                  <article
                    key={inst.id}
                    data-reveal="true"
                    style={{ transitionDelay: `${(index % 4) * 55}ms` }}
                    onClick={() => setSelectedTrainer(inst)}
                    className="card-note group relative flex cursor-pointer flex-col overflow-hidden !rounded-[22px]"
                  >
                    {/* Tall Editorial Portrait Frame fading cleanly into card surface */}
                    <div className={`relative h-[290px] w-full overflow-hidden ${tone.canvas}`}>
                      {/* Subtle orbital ring */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-14 -top-14 size-48 rounded-full border border-current opacity-10"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-16 bottom-6 size-44 rounded-full border border-current opacity-10"
                      />

                      {/* Top metadata bar inside portrait */}
                      <div className="relative z-10 flex items-center justify-between px-5 pt-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-medium backdrop-blur-sm ${
                            tone.isDarkPlate
                              ? 'border border-white/15 bg-black/25 text-white'
                              : 'border border-[#DFDBD2] dark:border-[#2A352F] bg-[#efebe1]/80 dark:bg-[#151A17]/80 text-[#141312] dark:text-[#f6f3ec]'
                          }`}
                        >
                          <Star className="h-3 w-3 fill-[#B8862D] text-[#B8862D]" />
                          {inst.rating.toFixed(1)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] ${
                            tone.isDarkPlate
                              ? 'border border-white/15 bg-black/25 text-[#D5D1C8]'
                              : 'border border-[#DFDBD2] dark:border-[#2A352F] bg-[#efebe1]/75 dark:bg-[#151A17]/75 text-[#6E746F] dark:text-[#9CA39E]'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')} / {String(instructors.length).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Arched Havenline Portrait Frame + Editorial Monogram Silhouette */}
                      <div className={`relative z-10 mx-auto mt-4 flex h-[230px] w-[196px] flex-col items-center justify-end overflow-hidden rounded-t-[100px] border border-b-0 shadow-inner transition-transform duration-500 ease-[var(--x-ease)] group-hover:scale-[1.03] px-4 pt-6 pb-8 ${tone.arch}`}>
                        <div className={`relative flex h-full w-full flex-col items-center justify-center rounded-t-[92px] border border-b-0 ${tone.arch}`}>
                          {/* Subtle editorial silhouette halo behind monogram */}
                          <span
                            aria-hidden="true"
                            className="mb-2 size-16 rounded-full border border-current opacity-20"
                          />
                          <span
                            className={`font-serif-display text-[56px] leading-none tracking-[-0.03em] select-none ${tone.accent}`}
                          >
                            {inst.initials}
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-3 h-8 w-28 rounded-t-full border border-b-0 border-current opacity-20"
                          />
                        </div>
                      </div>

                      {/* Smooth bottom gradient fade blending portrait into card body */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#f6f3ec] via-[#f6f3ec]/85 to-transparent dark:from-[#151A17] dark:via-[#151A17]/85 dark:to-transparent"
                      />
                    </div>

                    {/* Lower Card Content — structured like the reference layout */}
                    <div className="relative z-30 -mt-5 flex flex-1 flex-col px-6 pb-6 pt-1">
                      {/* Uppercase tracked role eyebrow */}
                      <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#1c5b48] dark:text-[#7CD4B5] line-clamp-1">
                        {pickText(inst.role)}
                      </p>

                      {/* Large Serif Trainer Name */}
                      <h2 className="mt-1.5 font-serif-display text-[26px] leading-[1.12] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5]">
                        {inst.name}
                      </h2>

                      {/* Stats / Credibility subtitle */}
                      <p className="mt-1 text-[13px] font-medium text-[#6E746F] dark:text-[#9CA39E]">
                        {formatNumber(inst.studentsCount)}{' '}
                        {locale === 'km' ? 'សិស្ស' : 'learners'} ·{' '}
                        {taughtCourses.length || inst.coursesCount}{' '}
                        {locale === 'km' ? 'វគ្គសិក្សា' : 'courses'}
                        {taughtVideos.length > 0 && (
                          <> · {taughtVideos.length} {locale === 'km' ? 'វីដេអូ' : 'videos'}</>
                        )}
                      </p>

                      {/* Concise editorial bio */}
                      <p className="mt-2.5 text-[13.5px] leading-[1.55] text-[#4c4842] dark:text-[#D5D1C8] line-clamp-2">
                        {pickText(inst.bio)}
                      </p>

                      {/* COURSES micro-label & rounded-full pill tags */}
                      <div className="mt-5">
                        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[#6E746F] dark:text-[#9CA39E]">
                          {locale === 'km' ? 'វគ្គសិក្សា' : 'COURSES'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {taughtCourses.slice(0, 3).map((course) => (
                            <Link
                              key={course.id}
                              to={`/courses/${course.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex max-w-full items-center rounded-full border border-line bg-surface px-3 py-[5px] text-[12px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong hover:!border-accent hover:!text-accent dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51] dark:hover:!border-[#7CD4B5] dark:hover:!text-[#7CD4B5]"
                            >
                              <span className="truncate max-w-[200px]">
                                {pickText(course.title)}
                              </span>
                            </Link>
                          ))}
                          {taughtCourses.length > 3 && (
                            <span className="inline-flex items-center rounded-full border border-line bg-surface-strong px-2.5 py-[5px] text-[11px] font-mono text-muted transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#1B221E] dark:text-[#9CA39E] dark:group-hover:border-[#495B51]">
                              +{taughtCourses.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom View Profile Action */}
                      <div className="mt-auto pt-5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrainer(inst);
                          }}
                          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] transition-all group-hover:gap-2"
                        >
                          <span>{locale === 'km' ? 'មើលប្រវត្តិគ្រូ' : 'View profile'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Havenline Architectural Invitation */}
      <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="surface-accent relative overflow-hidden rounded-[24px] p-8 sm:p-12 text-white">
          <span aria-hidden="true" className="deco-ring right-[-180px] top-[-180px] size-[480px] border-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#7CD4B5]">
                {locale === 'km' ? 'ការសិក្សាដោយមានការណែនាំ' : 'STRUCTURED CURRICULUM'}
              </p>
              <h2 className="mt-2 font-serif-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1]">
                {locale === 'km'
                  ? 'ត្រៀមខ្លួនចាប់ផ្តើមរៀនជាមួយគ្រូជំនាញហើយឬនៅ?'
                  : 'Ready to learn from practicing specialists?'}
              </h2>
              <p className="mt-2.5 text-[15px] text-[#E6ECE9]">
                {locale === 'km'
                  ? 'រកមើលវគ្គសិក្សា និងបណ្ណាល័យវីដេអូទាំងអស់ ឬជ្រើសរើសគម្រោងសមាជិកភាពដែលសមនឹងអ្នក។'
                  : 'Browse the full course catalog, inspect video workshops, or unlock every track with a membership plan.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/courses"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#efebe1] px-6 text-[14px] font-semibold whitespace-nowrap text-[#141312] shadow-sm transition-all duration-200 hover:bg-[#e5dfd2] active:translate-y-px"
              >
                <span>{locale === 'km' ? 'រកមើលវគ្គសិក្សា' : 'Explore courses'}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-6 text-[14px] font-semibold whitespace-nowrap text-white transition-all duration-200 hover:border-white/70 hover:bg-white/15 active:translate-y-px"
              >
                {locale === 'km' ? 'មើលតម្លៃ' : 'View pricing'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trainer Profile Modal */}
      <Modal
        open={Boolean(selectedTrainer)}
        onClose={() => setSelectedTrainer(null)}
        title={selectedTrainer ? selectedTrainer.name : ''}
        maxWidthClass="max-w-4xl"
      >
        {selectedTrainer && (
          <div className="space-y-7">
            {/* Trainer Header Summary */}
            <div className="flex flex-col gap-5 rounded-[18px] border border-[#DFDBD2] dark:border-[#242D28] bg-[#f6f3ec] dark:bg-[#101412] p-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] border border-[#1c5b48]/25 bg-[#1c5b48] text-white">
                <span className="font-serif-display text-3xl">
                  {selectedTrainer.initials}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#1c5b48] dark:text-[#7CD4B5]">
                  {pickText(selectedTrainer.role)}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#4c4842] dark:text-[#D5D1C8]">
                  {pickText(selectedTrainer.bio)}
                </p>
              </div>
            </div>

            {/* Trainer Metrics Strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-[14px] border border-[#DFDBD2] dark:border-[#242D28] bg-[#f6f3ec] dark:bg-[#101412] p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#6E746F] dark:text-[#9CA39E]">
                  <Star className="h-3.5 w-3.5 text-[#B8862D]" />
                  {locale === 'km' ? 'ការវាយតម្លៃ' : 'Rating'}
                </p>
                <p className="mt-1 font-serif-display text-2xl text-[#141312] dark:text-[#f6f3ec]">
                  {selectedTrainer.rating.toFixed(1)}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#DFDBD2] dark:border-[#242D28] bg-[#f6f3ec] dark:bg-[#101412] p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#6E746F] dark:text-[#9CA39E]">
                  <Users className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  {locale === 'km' ? 'សិស្សសរុប' : 'Learners'}
                </p>
                <p className="mt-1 font-serif-display text-2xl text-[#141312] dark:text-[#f6f3ec]">
                  {formatNumber(selectedTrainer.studentsCount)}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#DFDBD2] dark:border-[#242D28] bg-[#f6f3ec] dark:bg-[#101412] p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#6E746F] dark:text-[#9CA39E]">
                  <BookOpen className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  {locale === 'km' ? 'វគ្គសិក្សា' : 'Courses'}
                </p>
                <p className="mt-1 font-serif-display text-2xl text-[#141312] dark:text-[#f6f3ec]">
                  {selectedTrainerCourses.length || selectedTrainer.coursesCount}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#DFDBD2] dark:border-[#242D28] bg-[#f6f3ec] dark:bg-[#101412] p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#6E746F] dark:text-[#9CA39E]">
                  <Video className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  {locale === 'km' ? 'វីដេអូ' : 'Workshops'}
                </p>
                <p className="mt-1 font-serif-display text-2xl text-[#141312] dark:text-[#f6f3ec]">
                  {selectedTrainerVideos.length}
                </p>
              </div>
            </div>

            {/* Courses Taught */}
            {selectedTrainerCourses.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-serif-display text-xl text-[#141312] dark:text-[#f6f3ec]">
                    <Award className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
                    {locale === 'km' ? 'វគ្គសិក្សាដែលបង្រៀន' : 'Courses taught'}
                  </h3>
                  <Link
                    to={`/courses?instructor=${selectedTrainer.id}`}
                    onClick={() => setSelectedTrainer(null)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1c5b48] dark:text-[#7CD4B5] hover:underline"
                  >
                    {locale === 'km' ? 'បើកក្នុងបញ្ជីវគ្គសិក្សា' : 'Filter in catalog'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {selectedTrainerCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}

            {/* Video Workshops Taught */}
            {selectedTrainerVideos.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-serif-display text-xl text-[#141312] dark:text-[#f6f3ec]">
                  <Video className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  {locale === 'km' ? 'វីដេអូសិក្ខាសាលា' : 'Video workshops'}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {selectedTrainerVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
