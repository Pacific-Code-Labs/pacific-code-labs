import { useTranslation } from "react-i18next";
import { ArrowUpRight, BookOpen, Check, Terminal } from "lucide-react";
import coursesData from "@/content/courses.json";
import { listActiveCourses } from "@/services/courses.service";

export function CoursesSection() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "es";
  const courses = listActiveCourses();

  return (
    <section
      id="courses"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] py-24"
      aria-labelledby="courses-title"
      data-testid="courses-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <BookOpen
            className="w-6 h-6 mx-auto mb-4 text-[#2563EB] dark:text-[#06B6D4]"
            aria-hidden="true"
          />
          <h2
            id="courses-title"
            className="text-3xl sm:text-4xl text-[#0F172A] dark:text-white mb-4"
          >
            {coursesData.title[lang]}
          </h2>
          <p className="text-[#64748B] dark:text-white/60 max-w-xl mx-auto">
            {coursesData.subtitle[lang]}
          </p>
        </div>
        <div className="grid gap-6">
          {courses.map((course) => {
            const tr = course.translations[lang] ?? course.translations.es;
            return (
              <article
                key={course.id}
                className="grid md:grid-cols-[1.4fr_1fr] overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/4"
                data-testid={`course-card-${course.id}`}
              >
                <div className="p-6 sm:p-8 flex flex-col items-start">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="p-3 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#06B6D4]">
                      <Terminal className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-[#10B981]/10 text-[#047857] dark:text-[#6EE7B7] px-3 py-1 text-xs font-medium">
                      {tr.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl text-[#0F172A] dark:text-white mb-2">
                    {tr.name}
                  </h3>
                  <p className="text-[#2563EB] dark:text-[#06B6D4] font-medium mb-4">
                    {tr.tagline}
                  </p>
                  <p className="text-sm leading-relaxed text-[#64748B] dark:text-white/60 mb-6">
                    {tr.description}
                  </p>
                  <a
                    href={course.externalUrl}
                    className="hero-primary mt-auto"
                    data-testid={`course-visit-${course.id}`}
                  >
                    {coursesData.visitLabel[lang]}
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
                <div className="p-6 sm:p-8 border-t md:border-t-0 md:border-l border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-white/3 flex flex-col justify-center">
                  <ul className="space-y-4">
                    {tr.topics.map((topic) => (
                      <li
                        key={topic}
                        className="flex items-center gap-3 text-sm text-[#334155] dark:text-white/80"
                      >
                        <Check
                          className="w-4 h-4 shrink-0 text-[#059669] dark:text-[#6EE7B7]"
                          aria-hidden="true"
                        />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 pt-6 border-t border-[#E2E8F0] dark:border-white/10 text-xs leading-relaxed text-[#64748B] dark:text-white/60">
                    {tr.note}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
