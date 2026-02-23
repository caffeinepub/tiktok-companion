import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Lock, Power } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StaffCodeDialog from '@/components/StaffCodeDialog';
import { useGetPublicationState, useTogglePublicationState } from '@/hooks/useQueries';
import { Loader2 } from 'lucide-react';

export default function Settings() {
  const [staffCodeDialogOpen, setStaffCodeDialogOpen] = useState(false);
  const [isStaffVerified, setIsStaffVerified] = useState(false);
  
  const { data: publicationState, isLoading: isLoadingState } = useGetPublicationState();
  const togglePublicationMutation = useTogglePublicationState();

  // Check sessionStorage for staff verification status
  useEffect(() => {
    const verified = sessionStorage.getItem('staffVerified') === 'true';
    setIsStaffVerified(verified);
  }, []);

  const handleStaffVerified = () => {
    setIsStaffVerified(true);
    sessionStorage.setItem('staffVerified', 'true');
  };

  const handleTogglePublication = async () => {
    await togglePublicationMutation.mutateAsync();
  };

  const isPublished = publicationState === 'published';
  const isToggling = togglePublicationMutation.isPending;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure your TikTok Companion experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Additional settings and moderation features will be available here in future updates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation</CardTitle>
            <CardDescription>
              Manage content and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isStaffVerified ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Staff access required to manage moderation controls.
                </p>
                <Button onClick={() => setStaffCodeDialogOpen(true)} variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  Staff Access
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Power className="w-4 h-4 text-primary" />
                      <p className="font-medium">Publication Status</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isLoadingState ? (
                        'Loading status...'
                      ) : isPublished ? (
                        'App is currently published and accessible to all users'
                      ) : (
                        'App is currently unpublished and showing maintenance notice'
                      )}
                    </p>
                  </div>
                  {isLoadingState ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Button
                      onClick={handleTogglePublication}
                      disabled={isToggling}
                      variant={isPublished ? 'destructive' : 'default'}
                      className="min-w-[140px]"
                    >
                      {isToggling ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isPublished ? 'Unpublishing...' : 'Republishing...'}
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          {isPublished ? 'Unpublish App' : 'Republish App'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <StaffCodeDialog
        open={staffCodeDialogOpen}
        onOpenChange={setStaffCodeDialogOpen}
        onVerified={handleStaffVerified}
      />
    </div>
  );
}
