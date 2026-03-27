import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  MusicNote,
  Archive,
  Broadcast,
  Certificate,
  Trash,
  Info,
  SpotifyLogo,
  AppleLogo,
  Globe,
  Check
} from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const FileDetailPanel = ({ file, onClose, onUpdate, onDelete }) => {
  const [localFile, setLocalFile] = useState(file);
  const [saving, setSaving] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(file.distribution_platforms || []);
  const [licensePrice, setLicensePrice] = useState([file.license_price || 100]);
  const [licenseType, setLicenseType] = useState(file.license_type || "");

  const platforms = [
    { id: "spotify", name: "Spotify", icon: SpotifyLogo, color: "#1DB954" },
    { id: "apple_music", name: "Apple Music", icon: AppleLogo, color: "#FA243C" },
    { id: "boomplay", name: "Boomplay", icon: Globe, color: "#FF6B00" },
  ];

  const licenseTypes = [
    { id: "sync", name: "Sync License" },
    { id: "nft", name: "NFT/Token" },
    { id: "commercial", name: "Commercial Use" },
  ];

  const handleToggle = (field, value) => {
    setLocalFile({ ...localFile, [field]: value });
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        is_archived: localFile.is_archived,
        is_distributed: localFile.is_distributed,
        is_licensed: localFile.is_licensed,
      };

      if (localFile.is_distributed) {
        updates.distribution_platforms = selectedPlatforms;
      }

      if (localFile.is_licensed) {
        updates.license_type = licenseType;
        updates.license_price = licensePrice[0];
      }

      await onUpdate(file.id, updates);
    } catch (error) {
      // handled in parent
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(file.id);
    onClose();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-screen w-96 bg-black/60 backdrop-blur-2xl border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 flex flex-col"
      data-testid="file-detail-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <h2 className="text-lg font-semibold">File Details</h2>
        <button
          onClick={onClose}
          data-testid="close-panel-btn"
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* File Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF6B00]/20 to-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
            <MusicNote size={32} className="text-[#FF6B00]" weight="duotone" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-medium truncate">{file.title}</h3>
            <p className="text-sm text-zinc-500">{file.genre || "Unknown genre"}</p>
            <p className="text-sm text-zinc-500">{formatDuration(file.duration)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Streams</p>
            <p className="text-xl font-semibold">{(file.streams || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Earnings</p>
            <p className="text-xl font-semibold text-[#10B981]">
              ${(file.earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          {/* Archive Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Archive size={20} className="text-[#10B981]" />
              <div>
                <p className="font-medium">Archive</p>
                <p className="text-xs text-zinc-500">Store in your catalog</p>
              </div>
            </div>
            <Switch
              checked={localFile.is_archived}
              onCheckedChange={(checked) => handleToggle("is_archived", checked)}
              data-testid="archive-toggle"
            />
          </div>

          {/* Distribute Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Broadcast size={20} className="text-[#3B82F6]" />
                <div className="flex items-center gap-2">
                  <p className="font-medium">Distribute</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#121214] border-white/10">
                        <p className="text-sm">Push to streaming platforms worldwide</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Switch
                checked={localFile.is_distributed}
                onCheckedChange={(checked) => handleToggle("is_distributed", checked)}
                data-testid="distribute-toggle"
              />
            </div>

            {/* Platform Selection */}
            {localFile.is_distributed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-4 space-y-2"
              >
                <p className="text-sm text-zinc-400">Select platforms:</p>
                <div className="space-y-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        data-testid={`panel-platform-${platform.id}`}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "border-[#FF6B00] bg-[#FF6B00]/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <Icon size={20} style={{ color: platform.color }} />
                        <span className="text-sm flex-1 text-left">{platform.name}</span>
                        {isSelected && (
                          <Check size={16} className="text-[#FF6B00]" weight="bold" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* License Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Certificate size={20} className="text-[#D4AF37]" />
                <div className="flex items-center gap-2">
                  <p className="font-medium">License</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#121214] border-white/10">
                        <p className="text-sm">Allow others to license your music</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Switch
                checked={localFile.is_licensed}
                onCheckedChange={(checked) => handleToggle("is_licensed", checked)}
                data-testid="license-toggle"
              />
            </div>

            {/* License Options */}
            {localFile.is_licensed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-4 space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">License type:</p>
                  <div className="flex flex-wrap gap-2">
                    {licenseTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLicenseType(type.id)}
                        data-testid={`panel-license-${type.id}`}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          licenseType === type.id
                            ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400">Price:</p>
                    <span className="font-semibold text-[#D4AF37]">${licensePrice[0]}</span>
                  </div>
                  <Slider
                    value={licensePrice}
                    onValueChange={setLicensePrice}
                    max={1000}
                    min={10}
                    step={10}
                    data-testid="panel-price-slider"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 space-y-3">
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="save-changes-btn"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Save Changes"
          )}
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              data-testid="delete-file-btn"
              className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-medium hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Trash size={18} />
              Delete File
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#121214] border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete File?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This will permanently delete "{file.title}" from your archive. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default FileDetailPanel;
