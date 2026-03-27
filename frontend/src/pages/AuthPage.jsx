import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MusicNote, Eye, EyeSlash, Envelope, Lock, User, ArrowLeft } from "@phosphor-icons/react";
import { useAuth } from "@/App";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    artistName: ""
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.artistName.trim()) {
          toast.error("Please enter your artist name");
          setLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.artistName);
      }
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            data-testid="auth-back-btn"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to home
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#D4AF37] flex items-center justify-center">
              <MusicNote size={28} weight="fill" className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Ziki Tunes</h1>
              <p className="text-sm text-zinc-500">Artist Admin Portal</p>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-zinc-500 mb-8">
            {isLogin 
              ? "Sign in to access your dashboard" 
              : "Start managing your music career today"
            }
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="artistName" className="text-zinc-400">Artist Name</Label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="artistName"
                    type="text"
                    placeholder="Your stage name"
                    value={formData.artistName}
                    onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                    className="pl-12 h-12 bg-[#121214] border-white/10 focus:border-[#FF6B00] rounded-xl"
                    data-testid="auth-artist-name-input"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400">Email</Label>
              <div className="relative">
                <Envelope size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 h-12 bg-[#121214] border-white/10 focus:border-[#FF6B00] rounded-xl"
                  data-testid="auth-email-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400">Password</Label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 pr-12 h-12 bg-[#121214] border-white/10 focus:border-[#FF6B00] rounded-xl"
                  data-testid="auth-password-input"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="auth-submit-btn"
              className="w-full h-12 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-zinc-500 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              data-testid="auth-toggle-btn"
              className="text-[#FF6B00] hover:text-[#D4AF37] transition-colors font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/10 to-[#D4AF37]/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF6B00]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[100px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 text-center max-w-lg"
        >
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#D4AF37] flex items-center justify-center shadow-[0_0_60px_rgba(255,107,0,0.4)]">
            <MusicNote size={48} weight="fill" className="text-white" />
          </div>
          
          <h2 className="text-3xl font-semibold mb-4">
            Your Music, Your Rules
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Join the premier platform for African artists. Archive your catalog, distribute to global platforms, and monetize through licensing.
          </p>

          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#FF6B00]">50K+</p>
              <p className="text-sm text-zinc-500">Artists</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#D4AF37]">2M+</p>
              <p className="text-sm text-zinc-500">Tracks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#10B981]">$10M+</p>
              <p className="text-sm text-zinc-500">Earned</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
