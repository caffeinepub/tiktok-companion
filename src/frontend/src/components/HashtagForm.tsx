import { useState } from 'react';
import { useAddHashtag } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface HashtagFormProps {
  onSuccess: () => void;
}

export default function HashtagForm({ onSuccess }: HashtagFormProps) {
  const [hashtag, setHashtag] = useState('');
  const addHashtag = useAddHashtag();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hashtag.trim()) {
      toast.error('Please enter a hashtag');
      return;
    }

    const formattedHashtag = hashtag.trim().startsWith('#') ? hashtag.trim() : `#${hashtag.trim()}`;

    try {
      await addHashtag.mutateAsync(formattedHashtag);
      toast.success('Hashtag added successfully!');
      setHashtag('');
      onSuccess();
    } catch (error) {
      console.error('Error adding hashtag:', error);
      toast.error('Failed to add hashtag. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="hashtag">Hashtag</Label>
        <Input
          id="hashtag"
          type="text"
          placeholder="#trending"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          disabled={addHashtag.isPending}
        />
        <p className="text-xs text-muted-foreground"># symbol is optional</p>
      </div>

      <Button type="submit" disabled={addHashtag.isPending} className="w-full">
        {addHashtag.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Hashtag'
        )}
      </Button>
    </form>
  );
}
