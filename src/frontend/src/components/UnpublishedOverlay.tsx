import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnpublishedOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-2">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <CardTitle className="text-2xl">App Temporarily Unavailable</CardTitle>
          <CardDescription className="text-base">
            This application is currently under maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            We're performing some updates to improve your experience. Please check back shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
