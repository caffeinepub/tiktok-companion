import { useState } from 'react';
import { useGetVideosByDateRange, useGetPublicationState } from '../hooks/useQueries';
import CalendarView from '../components/CalendarView';
import ScheduleDialog from '../components/ScheduleDialog';
import UnpublishedOverlay from '../components/UnpublishedOverlay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Loader2, Plus } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: scheduledVideos, isLoading } = useGetVideosByDateRange(
    BigInt(startOfMonth.getTime() * 1000000),
    BigInt(endOfMonth.getTime() * 1000000)
  );
  const { data: publicationState } = useGetPublicationState();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };

  const isUnpublished = publicationState === 'unpublished';

  if (isLoading) {
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

  return (
    <>
      {isUnpublished && <UnpublishedOverlay />}
      <div className="container py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Content Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Plan and schedule your TikTok content
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-glow-teal">
                <Plus className="w-5 h-5 mr-2" />
                Schedule Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Video Idea</DialogTitle>
              </DialogHeader>
              <ScheduleDialog preselectedDate={selectedDate} onSuccess={handleCloseDialog} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scheduledVideos?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <CalendarView
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          scheduledVideos={scheduledVideos || []}
          onDateClick={handleDateClick}
        />
      </div>
    </>
  );
}
