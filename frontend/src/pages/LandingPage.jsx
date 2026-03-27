import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CloudArrowUp, 
  ChartLineUp, 
  Wallet, 
  MusicNote,
  Archive,
  Broadcast,
  Certificate,
  ArrowRight,
  Play
} from "@phosphor-icons/react";
import { useAuth } from "@/App";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Archive size={28} weight="duotone" />,
      title: "Archive & Preserve",
      description: "Securely store and organize your music catalog with full ownership rights."
    },
    {
      icon: <Broadcast size={28} weight="duotone" />,
      title: "Distribute Globally",
      description: "Push to Spotify, Apple Music, Boomplay and 150+ platforms with one click."
    },
    {
      icon: <Certificate size={28} weight="duotone" />,
      title: "License & Monetize",
      description: "Set sync, NFT, and commercial licensing terms. Earn from every use."
    },
    {
      icon: <ChartLineUp size={28} weight="duotone" />,
      title: "Analytics & Insights",
      description: "Track streams, revenue, and audience growth across Africa and beyond."
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Artists" },
    { value: "2M+", label: "Tracks Distributed" },
    { value: "$10M+", label: "Revenue Generated" },
    { value: "150+", label: "Platforms" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#D4AF37] flex items-center justify-center">
              <MusicNote size={24} weight="fill" className="text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Ziki Tunes</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                data-testid="nav-dashboard-btn"
                className="bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-full px-6 py-2.5 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  data-testid="nav-login-btn"
                  className="text-zinc-400 hover:text-white transition-colors px-4 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/auth?mode=register')}
                  data-testid="nav-signup-btn"
                  className="bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-full px-6 py-2.5 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-bg relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-sm text-[#FF6B00]">Afro-centric Music Ecosystem</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-white leading-tight mb-6">
              Control Your Music.{" "}
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] bg-clip-text text-transparent">
                Own Your Rights.
              </span>{" "}
              Monetize Everything.
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed">
              The complete platform for African artists to archive, distribute, and license their music globally. Take control of your creative legacy.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(user ? '/dashboard?upload=true' : '/auth?mode=register')}
                data-testid="hero-upload-btn"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-full px-8 py-4 shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_35px_rgba(255,107,0,0.6)] transition-all text-lg"
              >
                <CloudArrowUp size={24} weight="bold" />
                Upload Files
              </button>
              
              <button
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                data-testid="hero-dashboard-btn"
                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white font-medium rounded-full px-8 py-4 hover:bg-white/10 transition-all text-lg"
              >
                Go to Dashboard
                <ArrowRight size={20} weight="bold" />
              </button>
            </div>
          </motion.div>

          {/* Right - Preview Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Analytics Card */}
              <div className="absolute -top-4 -left-4 w-64 bg-[#121214]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
                    <ChartLineUp size={20} className="text-[#FF6B00]" weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Total Streams</p>
                    <p className="text-lg font-semibold">2.4M</p>
                  </div>
                </div>
                <div className="h-12 bg-gradient-to-r from-[#FF6B00]/20 to-transparent rounded-lg" />
              </div>

              {/* Main Image */}
              <div className="w-full aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl ml-16">
                <img
                  src="https://images.unsplash.com/photo-1759771716152-565fca0fb35e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwyfHxibGFjayUyMG1hbGUlMjBtdXNpY2lhbiUyMHBvcnRyYWl0JTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzc0NTU5NDU3fDA&ixlib=rb-4.1.0&q=85"
                  alt="Artist"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Earnings Card */}
              <div className="absolute -bottom-4 -right-4 w-64 bg-[#121214]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <Wallet size={20} className="text-[#D4AF37]" weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">This Month</p>
                    <p className="text-lg font-semibold text-[#10B981]">+$4,280</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">From streaming & licenses</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-zinc-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              A complete toolkit designed for African artists to manage their music business professionally.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#121214] border border-white/5 rounded-2xl p-6 hover:-translate-y-2 hover:border-[#FF6B00]/30 hover:shadow-[0_8px_30px_rgba(255,107,0,0.1)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B00]/20 to-[#D4AF37]/10 flex items-center justify-center text-[#FF6B00] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#121214] to-[#0A0A0B] border border-white/10 rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/5 to-transparent pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 relative z-10">
              Ready to Take Control?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto relative z-10">
              Join thousands of African artists already using Ziki Tunes to manage their music careers.
            </p>
            
            <button
              onClick={() => navigate(user ? '/dashboard' : '/auth?mode=register')}
              data-testid="cta-start-btn"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-full px-10 py-4 shadow-[0_0_25px_rgba(255,107,0,0.4)] hover:shadow-[0_0_40px_rgba(255,107,0,0.6)] transition-all text-lg relative z-10"
            >
              Start Free Today
              <ArrowRight size={20} weight="bold" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#D4AF37] flex items-center justify-center">
              <MusicNote size={18} weight="fill" className="text-white" />
            </div>
            <span className="text-sm text-zinc-500">© 2024 Ziki Tunes. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
