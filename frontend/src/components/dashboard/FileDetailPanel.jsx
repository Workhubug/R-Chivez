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
  Check
} from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
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

// Distributor logos
const distributorLogos = {
  ziki_tunes: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/e23k3jz7_ziki%20logo2.png",
  omziki: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/n0rdx6ar_Omziki-Logo-Web%20%281%29.png",
  ugatunes: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/zlspw6tv_ugatunes-logo.png",
  kelele: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/s9tywfmy_kelele.png",
};

const FileDetailPanel = ({ file, onClose, onUpdate, onDelete }) => {
  const [localFile, setLocalFile] = useState(file);
  const [saving, setSaving] = useState(false);
  const [selectedDistributors, setSelectedDistributors] = useState(file.distribution_platforms || []);
  const [licensePrice, setLicensePrice] = useState([file.license_price || 100]);
  const [licenseType, setLicenseType] = useState(file.license_type || "");

  const distributors = [
    { id: "ziki_tunes", name: "Ziki Tunes", logo: distributorLogos.ziki_tunes, bgColor: "#0A1628" },
    { id: "omziki", name: "Omziki", logo: distributorLogos.omziki, bgColor: "#000000" },
    { id: "ugatunes", name: "UgaTunes", logo: distributorLogos.ugatunes, bgColor: "#E91E8C" },
    { id: "kelele", name: "Kelele Digital", logo: distributorLogos.kelele, bgColor: "#2A2A2A" },
  ];

  const licenseTypes = [
    { id: "sync", name: "Sync License" },
    { id: "nft", name: "NFT/Token" },
    { id: "commercial", name: "Commercial Use" },
  ];

  const handleToggle = (field, value) => {
    setLocalFile({ ...localFile, [field]: value });
  };

  const toggleDistributor = (distributorId) => {
    setSelectedDistributors((prev) =>
      prev.includes(distributorId)
        ? prev.filter((id) => id !== distributorId)
        : [...prev, distributorId]
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
        updates.distribution_platforms = selectedDistributors;
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
      className="fixed right-0 top-0 h-screen w-96 bg-[#0F0D1A]/95 backdrop-blur-2xl border-l border-[#8B5CF6]/20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 flex flex-col"
      data-testid="file-detail-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#8B5CF6]/15">
        <h2 className="text-lg font-semibold">Asset Details</h2>
        <button
          onClick={onClose}
          data-testid="close-panel-btn"
          className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center hover:bg-[#8B5CF6]/20 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* File Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00BFFF]/20 to-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
            <MusicNote size={32} className="text-[#00BFFF]" weight="duotone" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-medium truncate">{file.title}</h3>
            <p className="text-sm text-zinc-500">{file.genre || "Unknown genre"}</p>
            <p className="text-sm text-zinc-500">{formatDuration(file.duration)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#8B5CF6]/10 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Streams</p>
            <p className="text-xl font-semibold">{(file.streams || 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#8B5CF6]/10 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Earnings</p>
            <p className="text-xl font-semibold text-[#10B981]">
              ${(file.earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          {/* Archive Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#8B5CF6]/10 rounded-xl">
            <div className="flex items-center gap-3">
              <Archive size={20} className="text-[#10B981]" />
              <div>
                <p className="font-medium">Archive</p>
                <p className="text-xs text-zinc-500">Store in your vault</p>
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
            <div className="flex items-center justify-between p-4 bg-[#8B5CF6]/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Broadcast size={20} className="text-[#00BFFF]" />
                <div className="flex items-center gap-2">
                  <p className="font-medium">Distribute</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#251E49] border-[#8B5CF6]/20">
                        <p className="text-sm">Send to partner distributors</p>
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

            {/* Distributor Selection */}
            {localFile.is_distributed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-4 space-y-2"
              >
                <p className="text-sm text-zinc-400">Select distributors:</p>
                <div className="grid grid-cols-2 gap-2">
                  {distributors.map((distributor) => {
                    const isSelected = selectedDistributors.includes(distributor.id);
                    return (
                      <button
                        key={distributor.id}
                        onClick={() => toggleDistributor(distributor.id)}
                        data-testid={`panel-distributor-${distributor.id}`}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          isSelected
                            ? "border-[#00BFFF] bg-[#00BFFF]/10"
                            : "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40"
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: distributor.bgColor }}
                        >
                          <img 
                            src={distributor.logo} 
                            alt={distributor.name}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <span className="text-xs flex-1 text-left truncate">{distributor.name}</span>
                        {isSelected && (
                          <Check size={14} className="text-[#00BFFF] flex-shrink-0" weight="bold" />
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
            <div className="flex items-center justify-between p-4 bg-[#8B5CF6]/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Certificate size={20} className="text-[#8B5CF6]" />
                <div className="flex items-center gap-2">
                  <p className="font-medium">License</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#251E49] border-[#8B5CF6]/20">
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
                            ? "border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]"
                            : "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40"
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
                    <span className="font-semibold text-[#8B5CF6]">${licensePrice[0]}</span>
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
      <div className="p-6 border-t border-[#8B5CF6]/15 space-y-3">
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="save-changes-btn"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
              Delete Asset
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1A1528] border-[#8B5CF6]/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Asset?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This will permanently delete "{file.title}" from your vault. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-white hover:bg-[#8B5CF6]/20">
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
