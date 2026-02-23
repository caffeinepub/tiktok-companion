import { useState } from 'react';
import { useGetVideoIdeas, useDeleteDraft, useGetPublicationState } from '../hooks/useQueries';
import VideoIdeaCard from '../components/VideoIdeaCard';
import VideoIdeaForm from '../components/VideoIdeaForm';
import UnpublishedOverlay from '../components/UnpublishedOverlay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2, Lightbulb } from 'lucide-react';
import { VideoIdea, VideoStatus } from '../backend';

export default function Dashboard() {
  const { data: videoIdeas, isLoading } = useGetVideoIdeas();
  const { data: publicationState, isLoading: isLoadingPublicationState } = useGetPublicationState();
  const deleteDraftMutation = useDeleteDraft();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<VideoIdea | null>(null);

  const handleEdit = (idea: VideoIdea) => {
    setEditingIdea(idea);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingIdea(null);
  };

  const handleDelete = async (title: string) => {
    await deleteDraftMutation.mutateAsync(title);
  };

  const filterByStatus = (status: VideoStatus | 'all') => {
    if (!videoIdeas) return [];
    if (status === 'all') return videoIdeas;
    return videoIdeas.filter((idea) => idea.status === status);
  };

  const draftIdeas = filterByStatus(VideoStatus.draft);
  const scheduledIdeas = filterByStatus(VideoStatus.scheduled);
  const publishedIdeas = filterByStatus(VideoStatus.published);

  const isUnpublished = publicationState === 'unpublished';

  if (isLoading || isLoadingPublicationState) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your ideas...</p>
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
          <h1 className="text-3xl md:text-4xl font-display font-bold">Video Ideas</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your TikTok content ideas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-glow-coral">
              <Plus className="w-5 h-5 mr-2" />
              New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIdea ? 'Edit Video Idea' : 'Create New Video Idea'}</DialogTitle>
            </DialogHeader>
            <VideoIdeaForm editingIdea={editingIdea} onSuccess={handleCloseDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">
            All ({videoIdeas?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({draftIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduledIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({publishedIdeas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-8">
          {videoIdeas && videoIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoIdeas.map((idea, index) => (
                <VideoIdeaCard key={index} idea={idea} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <EmptyState onCreateClick={() => setDialogOpen(true)} />
          )}
        </TabsContent>

        <TabsContent value="draft" className="mt-8">
          {draftIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftIdeas.map((idea, index) => (
                <VideoIdeaCard key={index} idea={idea} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <EmptyState message="No draft ideas yet" onCreateClick={() => setDialogOpen(true)} />
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="mt-8">
          {scheduledIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledIdeas.map((idea, index) => (
                <VideoIdeaCard key={index} idea={idea} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <EmptyState message="No scheduled ideas yet" onCreateClick={() => setDialogOpen(true)} />
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-8">
          {publishedIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedIdeas.map((idea, index) => (
                <VideoIdeaCard key={index} idea={idea} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <EmptyState message="No published ideas yet" onCreateClick={() => setDialogOpen(true)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message = "No video ideas yet", onCreateClick }: { message?: string; onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Lightbulb className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start creating amazing TikTok content by adding your first video idea
      </p>
      <Button onClick={onCreateClick} size="lg" className="shadow-glow-coral">
        <Plus className="w-5 h-5 mr-2" />
        Create Your First Idea
      </Button>
    </div>
  );
}
