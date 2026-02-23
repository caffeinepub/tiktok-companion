import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface StaffCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export default function StaffCodeDialog({ open, onOpenChange, onVerified }: StaffCodeDialogProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Verify the staff code
    if (code === '2807') {
      setTimeout(() => {
        setIsVerifying(false);
        onVerified();
        onOpenChange(false);
        setCode('');
      }, 500);
    } else {
      setTimeout(() => {
        setIsVerifying(false);
        setError('Invalid staff code. Please try again.');
      }, 500);
    }
  };

  const handleCancel = () => {
    setCode('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Staff Access Verification
          </DialogTitle>
          <DialogDescription>
            Enter the staff code to access moderation controls
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staff-code">Staff Code</Label>
              <Input
                id="staff-code"
                type="password"
                placeholder="Enter staff code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                disabled={isVerifying}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isVerifying}>
              Cancel
            </Button>
            <Button type="submit" disabled={isVerifying || !code}>
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
