import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import {
  Sparkles,
  Video,
  Zap,
  Target,
  Users,
  ArrowRight,
  Check,
  Play,
} from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'AI-Powered UGC',
    description:
      'Generate authentic-looking UGC videos with AI actors that perfectly showcase your products.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Get your videos in minutes, not days. Perfect for rapid testing and scaling your ads.',
  },
  {
    icon: Target,
    title: 'Platform Optimized',
    description:
      'Videos automatically formatted for TikTok, Instagram Reels, YouTube Shorts, and more.',
  },
  {
    icon: Users,
    title: 'Diverse Creators',
    description:
      'AI-generated creators matched to your target audience demographics and style.',
  },
];

const pricingTiers = [
  { name: 'Starter', credits: 25, price: 9.99, videos: '~5' },
  { name: 'Creator', credits: 75, price: 24.99, videos: '~15', popular: true },
  { name: 'Pro', credits: 200, price: 49.99, videos: '~40' },
  { name: 'Business', credits: 500, price: 99.99, videos: '~100' },
];

const steps = [
  {
    step: 1,
    title: 'Upload Your Product',
    description: 'Add your product image and describe what makes it special.',
  },
  {
    step: 2,
    title: 'Choose Your Style',
    description: 'Select your target audience, platform, and UGC style.',
  },
  {
    step: 3,
    title: 'Get Your Video',
    description: 'AI generates a professional UGC video in minutes.',
  },
];

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300">
                AI-Powered Video Generation
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Create Viral{' '}
              <span className="gradient-text">UGC Videos</span>
              <br />
              with AI
            </h1>

            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto mb-10">
              Generate authentic user-generated content videos in minutes.
              Perfect for TikTok, Instagram Reels, and YouTube Shorts. No
              actors, no filming, just AI magic.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="px-8">
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <p className="mt-6 text-sm text-[#64748b]">
              10 free credits on signup. No credit card required.
            </p>
          </div>

          {/* Demo Video Placeholder */}
          <div className="mt-16 relative">
            <div className="aspect-video max-w-4xl mx-auto bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] rounded-2xl border border-[#2d2d4a] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 pulse-glow">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-[#94a3b8]">See AI UGC in action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">AI UGC</span>?
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              Skip the hassle of finding creators, negotiating rates, and
              waiting for deliverables. Get professional UGC videos instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-[#1a1a2e] border border-[#2d2d4a] rounded-xl hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#94a3b8] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Create Videos in <span className="gradient-text">3 Steps</span>
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              From product image to viral-ready video in just minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#94a3b8]">{item.description}</p>
                </div>
                {item.step < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-[#2d2d4a]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#0a0a18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-6 rounded-xl border ${
                  tier.popular
                    ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/50'
                    : 'bg-[#1a1a2e] border-[#2d2d4a]'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                  </div>
                  <div className="text-[#94a3b8] text-sm mb-6">
                    <span className="text-indigo-400 font-medium">
                      {tier.credits} credits
                    </span>
                    <br />~{tier.videos} videos
                  </div>
                  <Link to="/auth?mode=signup">
                    <Button
                      variant={tier.popular ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Create Your First{' '}
              <span className="gradient-text">AI UGC Video</span>?
            </h2>
            <p className="text-[#94a3b8] mb-8 max-w-2xl mx-auto">
              Join thousands of marketers and brands creating viral-ready UGC
              content with AI. Start with 10 free credits.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="px-8">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-[#64748b]">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-400" />
                10 free credits
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-400" />
                No credit card
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-400" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
