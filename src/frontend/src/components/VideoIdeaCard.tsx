import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Calendar, Hash, Trash2 } from 'lucide-react';
import { VideoIdea, VideoStatus } from '../backend';
import { useState } from 'react';

interface VideoIdeaCardProps {
  idea: VideoIdea;
  onEdit: (idea: VideoIdea) => void;
  onDelete?: (title: string) => void;
}

export default function VideoIdeaCard({ idea, onEdit, onDelete }: VideoIdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const statusColors: Record<VideoStatus, string> = {
    [VideoStatus.draft]: 'bg-muted text-muted-foreground',
    [VideoStatus.scheduled]: 'bg-secondary text-secondary-foreground',
    [VideoStatus.published]: 'bg-primary text-primary-foreground',
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(idea.title);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDraft = idea.status === VideoStatus.draft;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
          <Badge className={statusColors[idea.status]} variant="secondary">
            {idea.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3">{idea.description}</p>

        {idea.hashtags.length > 0 && (
          <div className="flex items-start gap-2">
            <Hash className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {idea.hashtags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs text-primary">
                  {tag}
                </span>
              ))}
              {idea.hashtags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{idea.hashtags.length - 3}</span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {idea.scheduledDate ? formatDate(idea.scheduledDate) : formatDate(idea.createdAt)}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(idea)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {isDraft && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                className="w-full mt-2"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Draft'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the draft "{idea.title}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
