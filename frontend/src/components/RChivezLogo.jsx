// R-CHIVEZ Logo Component - Vinyl Record with Soundwave
const RChivezLogo = ({ size = "md", showText = true, animate = false }) => {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-lg" },
    md: { container: "w-10 h-10", text: "text-xl" },
    lg: { container: "w-12 h-12", text: "text-2xl" },
    xl: { container: "w-16 h-16", text: "text-3xl" },
  };

  const { container, text } = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-3">
      {/* Vinyl Record */}
      <div className={`${container} relative`}>
        <svg viewBox="0 0 40 40" className={`w-full h-full ${animate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
          {/* Outer ring - dark purple */}
          <circle cx="20" cy="20" r="19" fill="#4A3A79" />
          {/* Middle ring - medium purple */}
          <circle cx="20" cy="20" r="15" fill="#6F5BB2" />
          {/* Inner ring - light purple */}
          <circle cx="20" cy="20" r="11" fill="#8C7EDC" />
          {/* Cyan section */}
          <circle cx="20" cy="20" r="7" fill="#00BFFF" />
          {/* Center hole */}
          <circle cx="20" cy="20" r="3" fill="white" />
          {/* Groove lines */}
          <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="13" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="9" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        </svg>
        
        {/* Soundwave emanating from record */}
        <svg viewBox="0 0 20 10" className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-3">
          <path
            d="M0,5 Q2,2 4,5 T8,5 T12,5 T16,5 T20,5"
            fill="none"
            stroke="url(#soundwaveGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="soundwaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00BFFF" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-semibold tracking-tight ${text}`}>
          <span className="text-white">R-</span>
          <span className="bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] bg-clip-text text-transparent">CHIVEZ</span>
        </span>
      )}
    </div>
  );
};

export default RChivezLogo;
