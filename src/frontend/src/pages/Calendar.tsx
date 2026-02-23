import { useState, useMemo } from 'react';
import { useGetVideosByDateRange, useGetPublicationState } from '../hooks/useQueries';
import CalendarView from '../components/CalendarView';
import ScheduleDialog from '../components/ScheduleDialog';
import UnpublishedOverlay from '../components/UnpublishedOverlay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { VideoIdea } from '../backend';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);
  const { data: publicationState, isLoading: isLoadingPublicationState } = useGetPublicationState();

  // Calculate start and end of month
  const { startDate, endDate } = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
    return {
      startDate: BigInt(start.getTime() * 1_000_000),
      endDate: BigInt(end.getTime() * 1_000_000),
    };
  }, [currentDate]);

  const { data: scheduledVideos, isLoading } = useGetVideosByDateRange(startDate, endDate);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleDateClick = (date: Date) => {
    setPreselectedDate(date);
    setScheduleDialogOpen(true);
  };

  const handleScheduleSuccess = () => {
    setScheduleDialogOpen(false);
    setPreselectedDate(null);
  };

  const isUnpublished = publicationState === 'unpublished';

  if (isLoading || isLoadingPublicationState) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isUnpublished) {
    return <UnpublishedOverlay />;
  }

  return (
    <div className="container py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Content Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Plan and schedule your TikTok content
          </p>
        </div>
        <Button size="lg" onClick={() => setScheduleDialogOpen(true)} className="shadow-glow-teal">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Schedule Video
        </Button>
      </div>

      {/* Calendar */}
      <CalendarView
        currentDate={currentDate}
        onDateChange={handleDateChange}
        scheduledVideos={scheduledVideos || []}
        onDateClick={handleDateClick}
      />

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Video</DialogTitle>
          </DialogHeader>
          <ScheduleDialog
            preselectedDate={preselectedDate}
            onSuccess={handleScheduleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
