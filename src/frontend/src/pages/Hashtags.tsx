import { useState } from 'react';
import { useGetHashtags, useGetPublicationState } from '../hooks/useQueries';
import HashtagCard from '../components/HashtagCard';
import HashtagForm from '../components/HashtagForm';
import UnpublishedOverlay from '../components/UnpublishedOverlay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Hash, Plus, Search, Loader2 } from 'lucide-react';

export default function Hashtags() {
  const { data: hashtags, isLoading } = useGetHashtags();
  const { data: publicationState, isLoading: isLoadingPublicationState } = useGetPublicationState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHashtags = hashtags?.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUnpublished = publicationState === 'unpublished';

  if (isLoading || isLoadingPublicationState) {
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

  if (isUnpublished) {
    return <UnpublishedOverlay />;
  }

  return (
    <div className="container py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Hashtags</h1>
          <p className="text-muted-foreground mt-1">
            Manage your TikTok hashtag collection
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-glow-orange">
              <Plus className="w-5 h-5 mr-2" />
              Add Hashtag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
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
          placeholder="Search hashtags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Hashtags Grid */}
      {filteredHashtags && filteredHashtags.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHashtags.map((tag, index) => (
            <HashtagCard key={index} hashtag={tag} />
          ))}
        </div>
      ) : (
        <EmptyState
          hasHashtags={!!hashtags && hashtags.length > 0}
          onAddClick={() => setDialogOpen(true)}
        />
      )}
    </div>
  );
}

function EmptyState({ hasHashtags, onAddClick }: { hasHashtags: boolean; onAddClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Hash className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {hasHashtags ? 'No hashtags found' : 'No hashtags yet'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {hasHashtags
          ? 'Try adjusting your search query'
          : 'Start building your hashtag library to boost your TikTok reach'}
      </p>
      {!hasHashtags && (
        <Button onClick={onAddClick} size="lg" className="shadow-glow-orange">
          <Plus className="w-5 h-5 mr-2" />
          Add Your First Hashtag
        </Button>
      )}
    </div>
  );
}
