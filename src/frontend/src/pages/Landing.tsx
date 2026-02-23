import { Link } from '@tanstack/react-router';
import { useGetPublicationState } from '../hooks/useQueries';
import UnpublishedOverlay from '../components/UnpublishedOverlay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Calendar, Hash, Sparkles, TrendingUp, Zap, Loader2 } from 'lucide-react';

export default function Landing() {
  const { data: publicationState, isLoading: isLoadingPublicationState } = useGetPublicationState();

  const isUnpublished = publicationState === 'unpublished';

  if (isLoadingPublicationState) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isUnpublished) {
    return <UnpublishedOverlay />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Your TikTok Content Companion
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Create, Plan & Organize Your{' '}
              <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent">
                TikTok Content
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your content creation workflow with powerful tools for brainstorming ideas, scheduling posts, and managing hashtags.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/dashboard">
                <Button size="lg" className="shadow-glow-coral text-lg px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/calendar">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help you create engaging TikTok content consistently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Video Ideas</CardTitle>
                <CardDescription>
                  Capture and organize your creative ideas with detailed descriptions and status tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Draft, schedule, and publish workflow
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Rich descriptions and metadata
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Easy editing and management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>
                  Plan your posting schedule with an intuitive calendar view and scheduling tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Visual monthly calendar
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Drag-and-drop scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Never miss a posting date
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Hash className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Hashtag Manager</CardTitle>
                <CardDescription>
                  Build and organize your hashtag library for maximum reach and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Searchable hashtag collection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Usage tracking and analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Quick copy to clipboard
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Start Creating Today
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Ready to Level Up Your TikTok Game?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join creators who are already using TikTok Companion to streamline their content workflow and grow their audience.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="shadow-glow-coral text-lg px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
