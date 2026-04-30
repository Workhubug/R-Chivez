import { useState } from "react";
import { motion } from "framer-motion";
import {
  Broadcast,
  MusicNote,
  Check,
  Globe
} from "@phosphor-icons/react";
import { toast } from "sonner";

// Distributor logos
const distributorLogos = {
  ziki_tunes: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/e23k3jz7_ziki%20logo2.png",
  omziki: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/n0rdx6ar_Omziki-Logo-Web%20%281%29.png",
  ugatunes: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/zlspw6tv_ugatunes-logo.png",
  kelele: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/s9tywfmy_kelele.png",
};

const DistributionSection = ({ files, onUpdateFile, onSelectFile }) => {
  const [updating, setUpdating] = useState(false);

  const distributors = [
    { id: "ziki_tunes", name: "Ziki Tunes", logo: distributorLogos.ziki_tunes, bgColor: "#0A1628" },
    { id: "omziki", name: "Omziki", logo: distributorLogos.omziki, bgColor: "#000000" },
    { id: "ugatunes", name: "UgaTunes", logo: distributorLogos.ugatunes, bgColor: "#E91E8C" },
    { id: "kelele", name: "Kelele Digital", logo: distributorLogos.kelele, bgColor: "#2A2A2A" },
  ];

  const distributedFiles = files.filter(f => f.is_distributed);
  const undistributedFiles = files.filter(f => !f.is_distributed);

  const handleDistribute = async (file, selectedDistributors) => {
    if (selectedDistributors.length === 0) {
      toast.error("Please select at least one distributor");
      return;
    }
    
    setUpdating(true);
    try {
      await onUpdateFile(file.id, {
        is_distributed: true,
        distribution_platforms: selectedDistributors
      });
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
        <h1 className="text-2xl font-semibold tracking-tight">Distribution Partner Sync</h1>
        <p className="text-zinc-500 mt-1">Connect with African music distributors to reach global audiences</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
              <Broadcast size={22} className="text-[#00BFFF]" weight="fill" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{distributedFiles.length}</p>
          <p className="text-sm text-zinc-500">Distributed Tracks</p>
        </div>
        
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <MusicNote size={22} className="text-zinc-400" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{undistributedFiles.length}</p>
          <p className="text-sm text-zinc-500">Awaiting Distribution</p>
        </div>

        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <Globe size={22} className="text-[#10B981]" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{distributors.length}</p>
          <p className="text-sm text-zinc-500">Partner Distributors</p>
        </div>
      </div>

      {/* Distributors */}
      <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Partner Distributors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {distributors.map((distributor) => (
            <div
              key={distributor.id}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#0F0D1A] border border-[#8B5CF6]/15 hover:border-[#00BFFF]/30 transition-all"
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: distributor.bgColor }}
              >
                <img 
                  src={distributor.logo} 
                  alt={distributor.name}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <span className="font-medium text-sm text-center">{distributor.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Files Ready for Distribution */}
      {undistributedFiles.length > 0 && (
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Ready for Distribution</h2>
          <div className="space-y-3">
            {undistributedFiles.map((file, index) => (
              <DistributionCard
                key={file.id}
                file={file}
                distributors={distributors}
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
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6">
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
                className="flex items-center gap-4 p-4 rounded-xl bg-[#0F0D1A] hover:bg-[#322A5C] cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
                  <Broadcast size={24} className="text-[#00BFFF]" weight="fill" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{file.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {file.distribution_platforms?.map((p) => {
                      const distributor = distributors.find(d => d.id === p);
                      if (!distributor) return null;
                      return (
                        <div 
                          key={p} 
                          className="w-6 h-6 rounded overflow-hidden"
                          style={{ backgroundColor: distributor.bgColor }}
                        >
                          <img 
                            src={distributor.logo} 
                            alt={distributor.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#251E49] flex items-center justify-center">
            <Broadcast size={32} className="text-zinc-600" />
          </div>
          <p className="text-zinc-500 mb-2">No files to distribute</p>
          <p className="text-sm text-zinc-600">Upload files to your archive first</p>
        </div>
      )}
    </div>
  );
};

const DistributionCard = ({ file, distributors, onDistribute, onSelect, updating, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedDistributors, setSelectedDistributors] = useState([]);

  const toggleDistributor = (distributorId) => {
    setSelectedDistributors((prev) =>
      prev.includes(distributorId)
        ? prev.filter((id) => id !== distributorId)
        : [...prev, distributorId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-testid={`undistributed-file-${index}`}
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
          className="px-4 py-2 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] text-sm font-medium hover:bg-[#00BFFF]/20 transition-colors"
        >
          {expanded ? "Cancel" : "Distribute"}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-[#8B5CF6]/15 p-4"
        >
          <p className="text-sm text-zinc-400 mb-4">Select distributors:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {distributors.map((distributor) => {
              const isSelected = selectedDistributors.includes(distributor.id);
              return (
                <button
                  key={distributor.id}
                  onClick={() => toggleDistributor(distributor.id)}
                  data-testid={`distributor-${distributor.id}`}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-[#00BFFF] bg-[#00BFFF]/10"
                      : "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40"
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: distributor.bgColor }}
                  >
                    <img 
                      src={distributor.logo} 
                      alt={distributor.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium">{distributor.name}</span>
                  {isSelected && (
                    <Check size={14} className="text-[#00BFFF]" weight="bold" />
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onDistribute(file, selectedDistributors)}
            disabled={updating || selectedDistributors.length === 0}
            data-testid="confirm-distribute-btn"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
