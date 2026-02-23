import { useState, useEffect } from 'react';
import { useAddVideoIdea } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { VideoIdea } from '../backend';

interface VideoIdeaFormProps {
  editingIdea?: VideoIdea | null;
  onSuccess: () => void;
}

export default function VideoIdeaForm({ editingIdea, onSuccess }: VideoIdeaFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const addVideoIdea = useAddVideoIdea();

  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title);
      setDescription(editingIdea.description);
      setHashtags(editingIdea.hashtags.join(' '));
    }
  }, [editingIdea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const hashtagsList = hashtags
      .split(/\s+/)
      .filter((tag) => tag.trim())
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));

    try {
      await addVideoIdea.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        hashtagsList,
      });
      toast.success(editingIdea ? 'Video idea updated!' : 'Video idea created!');
      setTitle('');
      setDescription('');
      setHashtags('');
      onSuccess();
    } catch (error) {
      console.error('Error saving video idea:', error);
      toast.error('Failed to save video idea. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter video title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={addVideoIdea.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your video idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={addVideoIdea.isPending}
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hashtags">Hashtags</Label>
        <Input
          id="hashtags"
          type="text"
          placeholder="#trending #viral #fyp"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          disabled={addVideoIdea.isPending}
        />
        <p className="text-xs text-muted-foreground">
          Separate hashtags with spaces. # symbol is optional.
        </p>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="submit" disabled={addVideoIdea.isPending} className="min-w-[120px]">
          {addVideoIdea.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : editingIdea ? (
            'Update Idea'
          ) : (
            'Create Idea'
          )}
        </Button>
      </div>
    </form>
  );
}
