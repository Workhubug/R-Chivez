import { useState } from "react";
import { motion } from "framer-motion";
import {
  Broadcast,
  MusicNote,
  Check,
  SpotifyLogo,
  AppleLogo,
  Globe
} from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DistributionSection = ({ files, onUpdateFile, onSelectFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const platforms = [
    { id: "spotify", name: "Spotify", icon: SpotifyLogo, color: "#1DB954" },
    { id: "apple_music", name: "Apple Music", icon: AppleLogo, color: "#FA243C" },
    { id: "boomplay", name: "Boomplay", icon: Globe, color: "#FF6B00" },
  ];

  const distributedFiles = files.filter(f => f.is_distributed);
  const undistributedFiles = files.filter(f => !f.is_distributed);

  const handleDistribute = async (file, platforms) => {
    if (platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }
    
    setUpdating(true);
    try {
      await onUpdateFile(file.id, {
        is_distributed: true,
        distribution_platforms: platforms
      });
      setSelectedFile(null);
    } catch (error) {
      // handled in parent
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="distribution-section">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Distribution</h1>
        <p className="text-zinc-500 mt-1">Push your music to streaming platforms worldwide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <Broadcast size={22} className="text-[#3B82F6]" weight="fill" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{distributedFiles.length}</p>
          <p className="text-sm text-zinc-500">Distributed Tracks</p>
        </div>
        
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <MusicNote size={22} className="text-zinc-400" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{undistributedFiles.length}</p>
          <p className="text-sm text-zinc-500">Awaiting Distribution</p>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 flex items-center justify-center">
              <Globe size={22} className="text-[#1DB954]" />
            </div>
          </div>
          <p className="text-2xl font-semibold">150+</p>
          <p className="text-sm text-zinc-500">Available Platforms</p>
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Supported Platforms</h2>
        <div className="grid grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-[#0A0A0B] border border-white/5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${platform.color}20` }}
                >
                  <Icon size={24} weight="fill" style={{ color: platform.color }} />
                </div>
                <span className="font-medium">{platform.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Files Ready for Distribution */}
      {undistributedFiles.length > 0 && (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Ready for Distribution</h2>
          <div className="space-y-3">
            {undistributedFiles.map((file, index) => (
              <DistributionCard
                key={file.id}
                file={file}
                platforms={platforms}
                onDistribute={handleDistribute}
                onSelect={() => onSelectFile(file)}
                updating={updating}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Already Distributed */}
      {distributedFiles.length > 0 && (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Distributed Tracks</h2>
          <div className="space-y-3">
            {distributedFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectFile(file)}
                data-testid={`distributed-file-${index}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#0A0A0B] hover:bg-[#1C1C1F] cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                  <Broadcast size={24} className="text-[#3B82F6]" weight="fill" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{file.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {file.distribution_platforms?.map((p) => {
                      const platform = platforms.find(pl => pl.id === p);
                      if (!platform) return null;
                      const Icon = platform.icon;
                      return (
                        <Icon key={p} size={16} style={{ color: platform.color }} />
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#10B981]">
                  <Check size={18} weight="bold" />
                  <span className="text-sm">Live</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#121214] flex items-center justify-center">
            <Broadcast size={32} className="text-zinc-600" />
          </div>
          <p className="text-zinc-500 mb-2">No files to distribute</p>
          <p className="text-sm text-zinc-600">Upload files to your archive first</p>
        </div>
      )}
    </div>
  );
};

const DistributionCard = ({ file, platforms, onDistribute, onSelect, updating, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-testid={`undistributed-file-${index}`}
      className="rounded-xl bg-[#0A0A0B] border border-white/5 overflow-hidden"
    >
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#1C1C1F] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
          <MusicNote size={24} className="text-[#FF6B00]" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{file.title}</p>
          <p className="text-sm text-zinc-500">{file.genre || "Unknown genre"}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="px-4 py-2 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] text-sm font-medium hover:bg-[#FF6B00]/20 transition-colors"
        >
          {expanded ? "Cancel" : "Distribute"}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/5 p-4"
        >
          <p className="text-sm text-zinc-400 mb-4">Select platforms to distribute to:</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  data-testid={`platform-${platform.id}`}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-[#FF6B00] bg-[#FF6B00]/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <Icon size={20} style={{ color: platform.color }} />
                  <span className="text-sm">{platform.name}</span>
                  {isSelected && (
                    <Check size={16} className="ml-auto text-[#FF6B00]" weight="bold" />
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onDistribute(file, selectedPlatforms)}
            disabled={updating || selectedPlatforms.length === 0}
            data-testid="confirm-distribute-btn"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Broadcast size={20} weight="bold" />
                Distribute Now
              </>
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DistributionSection;
