import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Hashtag } from '../backend';

interface HashtagCardProps {
  hashtag: Hashtag;
}

export default function HashtagCard({ hashtag }: HashtagCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hashtag.name);
      setCopied(true);
      toast.success('Hashtag copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy hashtag');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-secondary/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-lg font-semibold text-secondary break-all">{hashtag.name}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Used {Number(hashtag.usageCount)}x</span>
          <span>{formatDate(hashtag.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
