import { useState } from "react";
import { motion } from "framer-motion";
import {
  Certificate,
  MusicNote,
  Coins,
  ShoppingCart,
  FilmStrip,
  CurrencyDollar,
  Check
} from "@phosphor-icons/react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const LicensingSection = ({ files, onUpdateFile, onSelectFile }) => {
  const licensedFiles = files.filter(f => f.is_licensed);
  const unlicensedFiles = files.filter(f => !f.is_licensed);

  const licenseTypes = [
    { id: "sync", name: "Sync License", icon: FilmStrip, description: "For TV, film, and advertising" },
    { id: "nft", name: "NFT/Token", icon: Coins, description: "Blockchain-based ownership" },
    { id: "commercial", name: "Commercial Use", icon: ShoppingCart, description: "For business applications" },
  ];

  return (
    <div className="space-y-6" data-testid="licensing-section">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Licensing & Commercialization</h1>
        <p className="text-zinc-500 mt-1">Enable monetization through sync, NFT, and commercial licensing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
              <Certificate size={22} className="text-[#8B5CF6]" weight="fill" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{licensedFiles.length}</p>
          <p className="text-sm text-zinc-500">Licensed Tracks</p>
        </div>
        
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <MusicNote size={22} className="text-zinc-400" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{unlicensedFiles.length}</p>
          <p className="text-sm text-zinc-500">Not Licensed</p>
        </div>

        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <CurrencyDollar size={22} className="text-[#10B981]" />
            </div>
          </div>
          <p className="text-2xl font-semibold">3</p>
          <p className="text-sm text-zinc-500">License Types</p>
        </div>
      </div>

      {/* License Types Info */}
      <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">License Types</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {licenseTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                className="p-4 rounded-xl bg-[#0F0D1A] border border-[#8B5CF6]/15"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-3">
                  <Icon size={22} className="text-[#8B5CF6]" />
                </div>
                <p className="font-medium mb-1">{type.name}</p>
                <p className="text-sm text-zinc-500">{type.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Files Ready for Licensing */}
      {unlicensedFiles.length > 0 && (
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Available for Licensing</h2>
          <div className="space-y-3">
            {unlicensedFiles.map((file, index) => (
              <LicensingCard
                key={file.id}
                file={file}
                licenseTypes={licenseTypes}
                onUpdateFile={onUpdateFile}
                onSelect={() => onSelectFile(file)}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Already Licensed */}
      {licensedFiles.length > 0 && (
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Licensed Tracks</h2>
          <div className="space-y-3">
            {licensedFiles.map((file, index) => {
              const licenseType = licenseTypes.find(t => t.id === file.license_type);
              const Icon = licenseType?.icon || Certificate;
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectFile(file)}
                  data-testid={`licensed-file-${index}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0F0D1A] hover:bg-[#322A5C] cursor-pointer transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                    <Icon size={24} className="text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{file.title}</p>
                    <p className="text-sm text-zinc-500">
                      {licenseType?.name || "Licensed"} • ${file.license_price || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[#10B981]">
                    <Check size={18} weight="bold" />
                    <span className="text-sm">Active</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#251E49] flex items-center justify-center">
            <Certificate size={32} className="text-zinc-600" />
          </div>
          <p className="text-zinc-500 mb-2">No files to license</p>
          <p className="text-sm text-zinc-600">Upload files to your archive first</p>
        </div>
      )}
    </div>
  );
};

const LicensingCard = ({ file, licenseTypes, onUpdateFile, onSelect, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [price, setPrice] = useState([100]);
  const [updating, setUpdating] = useState(false);

  const handleLicense = async () => {
    if (!selectedType) {
      toast.error("Please select a license type");
      return;
    }
    
    setUpdating(true);
    try {
      await onUpdateFile(file.id, {
        is_licensed: true,
        license_type: selectedType,
        license_price: price[0]
      });
      setExpanded(false);
    } catch (error) {
      // handled in parent
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-testid={`unlicensed-file-${index}`}
      className="rounded-xl bg-[#0F0D1A] border border-[#8B5CF6]/15 overflow-hidden"
    >
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#322A5C] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
          <MusicNote size={24} className="text-[#00BFFF]" />
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
          className="px-4 py-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm font-medium hover:bg-[#8B5CF6]/20 transition-colors"
        >
          {expanded ? "Cancel" : "Set License"}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-[#8B5CF6]/15 p-4 space-y-4"
        >
          <div>
            <p className="text-sm text-zinc-400 mb-3">Select license type:</p>
            <div className="grid grid-cols-3 gap-3">
              {licenseTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    data-testid={`license-type-${type.id}`}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "border-[#8B5CF6] bg-[#8B5CF6]/10"
                        : "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40"
                    }`}
                  >
                    <Icon size={24} className={isSelected ? "text-[#8B5CF6]" : "text-zinc-400"} />
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-zinc-400">Set your price:</p>
              <span className="text-lg font-semibold text-[#8B5CF6]">${price[0]}</span>
            </div>
            <Slider
              value={price}
              onValueChange={setPrice}
              max={1000}
              min={10}
              step={10}
              className="w-full"
              data-testid="price-slider"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>$10</span>
              <span>$1000</span>
            </div>
          </div>

          <button
            onClick={handleLicense}
            disabled={updating || !selectedType}
            data-testid="confirm-license-btn"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#00BFFF] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Certificate size={20} weight="bold" />
                Enable Licensing
              </>
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LicensingSection;
