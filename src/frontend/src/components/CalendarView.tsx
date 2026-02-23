import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VideoIdea } from '../backend';
import { ReactElement } from 'react';

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  scheduledVideos: VideoIdea[];
  onDateClick: (date: Date) => void;
}

export default function CalendarView({
  currentDate,
  onDateChange,
  scheduledVideos,
  onDateClick,
}: CalendarViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const getVideosForDate = (day: number) => {
    const date = new Date(year, month, day);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime() * 1000000;
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime() * 1000000;

    return scheduledVideos.filter((video) => {
      if (!video.scheduledDate) return false;
      const videoDate = Number(video.scheduledDate);
      return videoDate >= startOfDay && videoDate <= endOfDay;
    });
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days: ReactElement[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const videosOnDay = getVideosForDate(day);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    days.push(
      <button
        key={day}
        onClick={() => onDateClick(new Date(year, month, day))}
        className={`aspect-square p-2 rounded-lg border transition-all hover:border-primary hover:shadow-md ${
          isToday ? 'bg-primary/10 border-primary' : 'bg-card'
        }`}
      >
        <div className="flex flex-col h-full">
          <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>{day}</span>
          {videosOnDay.length > 0 && (
            <div className="mt-auto space-y-1">
              {videosOnDay.slice(0, 2).map((video, index) => (
                <div
                  key={index}
                  className="text-xs truncate px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
                >
                  {video.title}
                </div>
              ))}
              {videosOnDay.length > 2 && (
                <div className="text-xs text-muted-foreground">+{videosOnDay.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-xl overflow-hidden bg-card">
        {/* Day Names */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-border p-px">{days}</div>
      </div>
    </div>
  );
}
