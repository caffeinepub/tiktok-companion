import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPublicationState } from '../hooks/useQueries';
import UnpublishedOverlay from '../components/UnpublishedOverlay';
import { Button } from '@/components/ui/button';
import { Lightbulb, Calendar, Hash, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useEffect } from 'react';

export default function Landing() {
  const { identity } = useInternetIdentity();
  const { data: publicationState } = useGetPublicationState();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Lightbulb,
      title: 'Video Ideas',
      description: 'Capture and organize all your creative video concepts in one place',
    },
    {
      icon: Calendar,
      title: 'Content Calendar',
      description: 'Plan and schedule your content strategy with an intuitive calendar view',
    },
    {
      icon: Hash,
      title: 'Hashtag Tracker',
      description: 'Save and manage trending hashtags to boost your content reach',
    },
  ];

  const isUnpublished = publicationState === 'unpublished';

  return (
    <>
      {isUnpublished && <UnpublishedOverlay />}
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
          <div className="container relative py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Your TikTok Content Companion
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                Plan, Create, and{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Dominate
                </span>{' '}
                TikTok
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Organize your video ideas, schedule your content, and track trending hashtags—all in one beautiful, easy-to-use platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 shadow-glow-coral">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Banner Image */}
        <section className="container py-12">
          <div className="rounded-2xl overflow-hidden shadow-2xl border">
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="TikTok Companion Dashboard"
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for TikTok content creators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border bg-card hover:shadow-glow-coral transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-20 md:py-32">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary p-12 md:p-20 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                Ready to Level Up Your TikTok Game?
              </h2>
              <p className="text-xl text-white/90">
                Join creators who are already using TikTok Companion to streamline their content creation process.
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 shadow-xl">
                <Zap className="w-5 h-5 mr-2" />
                Start Creating Now
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
