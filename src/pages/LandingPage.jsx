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
  Shield,
  Link,
  FileText,
  Users
} from "@phosphor-icons/react";
import { useAuth } from "@/App";
import RChivezLogo from "@/components/RChivezLogo";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Archive size={28} weight="duotone" />,
      title: "Master Archive & Asset Vault",
      description: "Secure, permanent storage for WAV, FLAC, stems, cover art, and music videos."
    },
    {
      icon: <Shield size={28} weight="duotone" />,
      title: "Rights Ownership Registry",
      description: "Establish verifiable ownership chains with territory and duration controls."
    },
    {
      icon: <Broadcast size={28} weight="duotone" />,
      title: "Distribution Partner Sync",
      description: "Align archive rights data with distributed catalogs across 150+ platforms."
    },
    {
      icon: <Certificate size={28} weight="duotone" />,
      title: "Licensing Engine",
      description: "Enable monetization with sync, NFT, and commercial licensing options."
    },
    {
      icon: <Users size={28} weight="duotone" />,
      title: "Royalty Split Engine",
      description: "Define revenue distribution between artists, producers, and labels."
    },
    {
      icon: <FileText size={28} weight="duotone" />,
      title: "Contract Vault",
      description: "Secure legal documentation with recording agreements and split sheets."
    },
    {
      icon: <Link size={28} weight="duotone" />,
      title: "Metadata Standardization",
      description: "Auto-clean ISRC, UPC, contributor roles with Afro-centric genre taxonomy."
    },
    {
      icon: <ChartLineUp size={28} weight="duotone" />,
      title: "Royalty Transparency",
      description: "Revenue dashboards with real-time reporting and audit trails."
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Artists" },
    { value: "2M+", label: "Tracks Archived" },
    { value: "$10M+", label: "Revenue Distributed" },
    { value: "150+", label: "DSP Partners" }
  ];

  return (
    <div className="min-h-screen bg-[#0F0D1A] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0D1A]/80 backdrop-blur-xl border-b border-[#8B5CF6]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <RChivezLogo size="md" />
          
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                data-testid="nav-dashboard-btn"
                className="bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium rounded-full px-6 py-2.5 shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.5)] transition-all"
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
                  className="bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium rounded-full px-6 py-2.5 shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.5)] transition-all"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#00BFFF] animate-pulse" />
              <span className="text-sm text-[#00BFFF]">Afro-centric Music IP Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-white leading-tight mb-6">
              Archive Your Music.{" "}
              <span className="bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] bg-clip-text text-transparent">
                Own Your Rights.
              </span>{" "}
              Monetize Forever.
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed">
              The complete platform for African artists to securely archive masters, establish ownership chains, and monetize through licensing and distribution.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(user ? '/dashboard/archive' : '/auth?mode=register')}
                data-testid="hero-upload-btn"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium rounded-full px-8 py-4 shadow-[0_0_20px_rgba(0,191,255,0.4)] hover:shadow-[0_0_35px_rgba(0,191,255,0.6)] transition-all text-lg"
              >
                <CloudArrowUp size={24} weight="bold" />
                Upload Masters
              </button>
              
              <button
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                data-testid="hero-dashboard-btn"
                className="inline-flex items-center gap-3 bg-white/5 border border-[#8B5CF6]/30 text-white font-medium rounded-full px-8 py-4 hover:bg-white/10 transition-all text-lg"
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
              <div className="absolute -top-4 -left-4 w-64 bg-[#251E49]/90 backdrop-blur-xl border border-[#8B5CF6]/20 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
                    <ChartLineUp size={20} className="text-[#00BFFF]" weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Total Streams</p>
                    <p className="text-lg font-semibold">2.4M</p>
                  </div>
                </div>
                <div className="h-12 bg-gradient-to-r from-[#00BFFF]/20 to-transparent rounded-lg" />
              </div>

              {/* Main Visual - Vinyl Record */}
              <div className="w-full aspect-square rounded-3xl overflow-hidden border border-[#8B5CF6]/20 shadow-2xl ml-16 bg-gradient-to-br from-[#251E49] to-[#1A1528] flex items-center justify-center">
                <div className="relative">
                  <svg viewBox="0 0 200 200" className="w-64 h-64 animate-spin" style={{ animationDuration: '8s' }}>
                    {/* Outer ring */}
                    <circle cx="100" cy="100" r="95" fill="#4A3A79" />
                    <circle cx="100" cy="100" r="80" fill="#6F5BB2" />
                    <circle cx="100" cy="100" r="65" fill="#8C7EDC" />
                    <circle cx="100" cy="100" r="50" fill="#00BFFF" />
                    <circle cx="100" cy="100" r="35" fill="#8B5CF6" />
                    <circle cx="100" cy="100" r="15" fill="white" />
                    {/* Grooves */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                  </svg>
                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                </div>
              </div>

              {/* Earnings Card */}
              <div className="absolute -bottom-4 -right-4 w-64 bg-[#251E49]/90 backdrop-blur-xl border border-[#8B5CF6]/20 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                    <Wallet size={20} className="text-[#8B5CF6]" weight="fill" />
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
      <section className="py-20 border-t border-[#8B5CF6]/10">
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
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] bg-clip-text text-transparent mb-2">
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
              Complete{" "}
              <span className="bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] bg-clip-text text-transparent">
                Music IP Infrastructure
              </span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Every tool you need to archive, protect, and monetize your music catalog professionally.
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
                className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6 hover:-translate-y-2 hover:border-[#00BFFF]/30 hover:shadow-[0_8px_30px_rgba(0,191,255,0.1)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF]/20 to-[#8B5CF6]/10 flex items-center justify-center text-[#00BFFF] mb-4">
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
            className="bg-gradient-to-br from-[#251E49] to-[#1A1528] border border-[#8B5CF6]/20 rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/5 to-transparent pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 relative z-10">
              Ready to Secure Your Music Legacy?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto relative z-10">
              Join thousands of African artists already using R-CHIVEZ to archive, protect, and monetize their catalogs.
            </p>
            
            <button
              onClick={() => navigate(user ? '/dashboard' : '/auth?mode=register')}
              data-testid="cta-start-btn"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium rounded-full px-10 py-4 shadow-[0_0_25px_rgba(0,191,255,0.4)] hover:shadow-[0_0_40px_rgba(0,191,255,0.6)] transition-all text-lg relative z-10"
            >
              Start Free Today
              <ArrowRight size={20} weight="bold" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#8B5CF6]/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <RChivezLogo size="sm" showText={false} />
            <span className="text-sm text-zinc-500">© 2024 R-CHIVEZ. All rights reserved.</span>
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
