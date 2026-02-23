import { useState, useEffect } from 'react';
import { useGetVideoIdeas, useScheduleVideoIdea } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { VideoStatus } from '../backend';

interface ScheduleDialogProps {
  preselectedDate?: Date | null;
  onSuccess: () => void;
}

export default function ScheduleDialog({ preselectedDate, onSuccess }: ScheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(preselectedDate || undefined);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const { data: videoIdeas } = useGetVideoIdeas();
  const scheduleVideo = useScheduleVideoIdea();

  const unscheduledIdeas = videoIdeas?.filter((idea) => idea.status === VideoStatus.draft) || [];

  useEffect(() => {
    if (preselectedDate) {
      setSelectedDate(preselectedDate);
    }
  }, [preselectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!selectedVideoTitle) {
      toast.error('Please select a video idea');
      return;
    }

    try {
      const scheduledTimestamp = BigInt(selectedDate.getTime() * 1000000);
      await scheduleVideo.mutateAsync({
        title: selectedVideoTitle,
        scheduledDate: scheduledTimestamp,
      });
      toast.success('Video scheduled successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error scheduling video:', error);
      toast.error('Failed to schedule video. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Select Video Idea</Label>
        <Select value={selectedVideoTitle} onValueChange={setSelectedVideoTitle}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a video idea..." />
          </SelectTrigger>
          <SelectContent>
            {unscheduledIdeas.length > 0 ? (
              unscheduledIdeas.map((idea, index) => (
                <SelectItem key={index} value={idea.title}>
                  {idea.title}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">No unscheduled ideas available</div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Select Date</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </div>

      <Button type="submit" disabled={scheduleVideo.isPending} className="w-full">
        {scheduleVideo.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Scheduling...
          </>
        ) : (
          'Schedule Video'
        )}
      </Button>
    </form>
  );
}
