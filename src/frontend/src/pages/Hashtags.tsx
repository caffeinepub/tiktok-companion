import { useState } from 'react';
import { useGetHashtags, useGetPublicationState } from '../hooks/useQueries';
import HashtagCard from '../components/HashtagCard';
import HashtagForm from '../components/HashtagForm';
import UnpublishedOverlay from '../components/UnpublishedOverlay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Hash, Loader2, Plus, Search } from 'lucide-react';

export default function Hashtags() {
  const { data: hashtags, isLoading } = useGetHashtags();
  const { data: publicationState } = useGetPublicationState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHashtags = hashtags?.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUnpublished = publicationState === 'unpublished';

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading hashtags...</p>
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
            <h1 className="text-3xl md:text-4xl font-display font-bold">Hashtag Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Save and organize hashtags for your content
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-glow-coral">
                <Plus className="w-5 h-5 mr-2" />
                Add Hashtag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Hashtag</DialogTitle>
              </DialogHeader>
              <HashtagForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Hashtags Grid */}
        {filteredHashtags && filteredHashtags.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredHashtags.map((hashtag, index) => (
              <HashtagCard key={index} hashtag={hashtag} />
            ))}
          </div>
        ) : (
          <EmptyState
            hasHashtags={!!hashtags && hashtags.length > 0}
            onCreateClick={() => setDialogOpen(true)}
          />
        )}
      </div>
    </>
  );
}

function EmptyState({ hasHashtags, onCreateClick }: { hasHashtags: boolean; onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
        <Hash className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {hasHashtags ? 'No hashtags found' : 'No hashtags yet'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {hasHashtags
          ? 'Try adjusting your search query'
          : 'Start building your hashtag collection to boost your content reach'}
      </p>
      {!hasHashtags && (
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Hashtag
        </Button>
      )}
    </div>
  );
}
