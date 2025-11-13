"use client";
import { useFormatter, useTranslations } from "next-intl";
import { LessonType } from "@/db/schema/lessons";
import { getLessonsForDate } from "./utils";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface DayNavigationProps {
  lessons: LessonType[];
  selectedDayOffset: number;
  onDaySelect: (dayOffset: number) => void;
}

export default function DayNavigation({
  lessons,
  selectedDayOffset,
  onDaySelect,
}: DayNavigationProps) {
  const format = useFormatter();
  const t = useTranslations("common");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get next 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Scroll to center the selected day
  useEffect(() => {
    const selectedButton = dayButtonRefs.current[selectedDayOffset];
    const container = scrollContainerRef.current;

    if (selectedButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();

      // Calculate button position relative to container
      const buttonLeftRelative =
        buttonRect.left - containerRect.left + container.scrollLeft;
      const containerWidth = containerRect.width;
      const buttonWidth = buttonRect.width;

      // Calculate scroll position to center the button
      const scrollLeft =
        buttonLeftRelative - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedDayOffset]);

  return (
    <div
      ref={scrollContainerRef}
      className="bg-slate-200 rounded-lg p-2 overflow-x-auto hidden-scrollbar scroll-smooth"
    >
      <div className="flex gap-2 min-w-max">
        {days.map((date, index) => {
          const dayOffset = index;
          const isSelected = dayOffset === selectedDayOffset;
          const lessonsCount = getLessonsForDate(lessons, date).length || 0;

          return (
            <button
              key={date.toISOString()}
              ref={(el) => {
                dayButtonRefs.current[index] = el;
              }}
              onClick={() => onDaySelect(dayOffset)}
              className={cn(
                "cursor-pointer min-w-[70px] flex flex-col items-center justify-center py-3 px-3 rounded-lg transition-all flex-shrink-0",
                "hover:bg-muted/50",
                isSelected
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isSelected && "text-white"
                )}
              >
                {format.dateTime(date, {
                  weekday: "short",
                })}
              </span>
              <span
                className={cn(
                  "text-lg font-semibold mt-1",
                  isSelected ? "text-white" : "text-foreground"
                )}
              >
                {format.dateTime(date, {
                  day: "numeric",
                })}
              </span>
              <span
                className={cn(
                  "text-xs mt-1",
                  isSelected ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {lessonsCount > 0 && (
                  <span>
                    {lessonsCount}{" "}
                    {lessonsCount === 1 ? t("lesson") : t("lessons")}
                  </span>
                )}
                {lessonsCount === 0 && <span>-</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
