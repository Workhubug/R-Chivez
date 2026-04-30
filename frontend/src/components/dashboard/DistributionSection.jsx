import { useState } from "react";
import { motion } from "framer-motion";
import {
  Broadcast,
  MusicNote,
  Check,
  Globe,
  Warning,
  CheckCircle,
  Info
} from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Distributor logos
const distributorLogos = {
  ziki_tunes: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/e23k3jz7_ziki%20logo2.png",
  omziki: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/n0rdx6ar_Omziki-Logo-Web%20%281%29.png",
  ugatunes: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/zlspw6tv_ugatunes-logo.png",
  kelele: "https://customer-assets.emergentagent.com/job_ziki-artist-admin/artifacts/s9tywfmy_kelele.png",
};

// Distributor-specific metadata requirements
const distributorRequirements = {
  ziki_tunes: {
    name: "Ziki Tunes",
    requirements: [
      { field: "isrc", label: "ISRC Code", required: true },
      { field: "primary_artist", label: "Primary Artist", required: true },
      { field: "genre", label: "Genre", required: true },
      { field: "release_date", label: "Release Date", required: true },
    ],
    specs: "Minimum 320kbps MP3 or lossless WAV/FLAC. Cover art: 3000x3000px JPG",
  },
  omziki: {
    name: "Omziki",
    requirements: [
      { field: "isrc", label: "ISRC Code", required: true },
      { field: "upc", label: "UPC/EAN", required: true },
      { field: "primary_artist", label: "Primary Artist", required: true },
      { field: "label", label: "Record Label", required: true },
      { field: "copyright_owner", label: "Copyright Owner", required: true },
    ],
    specs: "Lossless WAV/FLAC only. Cover art: 3000x3000px, no logos or text",
  },
  ugatunes: {
    name: "UgaTunes",
    requirements: [
      { field: "isrc", label: "ISRC Code", required: true },
      { field: "primary_artist", label: "Primary Artist", required: true },
      { field: "genre", label: "Genre", required: true },
      { field: "territories", label: "Territory Rights", required: true },
    ],
    specs: "Minimum 256kbps. Artist verification required for first release",
  },
  kelele: {
    name: "Kelele Digital",
    requirements: [
      { field: "isrc", label: "ISRC Code", required: true },
      { field: "upc", label: "UPC/EAN", required: true },
      { field: "primary_artist", label: "Primary Artist", required: true },
      { field: "producers", label: "Producer Credits", required: true },
      { field: "writers", label: "Writer Credits", required: true },
      { field: "copyright_owner", label: "Copyright Owner", required: true },
    ],
    specs: "WAV 24-bit/48kHz preferred. Distribution agreement required",
  },
};

const DistributionSection = ({ files, onUpdateFile, onSelectFile }) => {
  const [updating, setUpdating] = useState(false);

  const distributors = [
    { id: "ziki_tunes", name: "Ziki Tunes", logo: distributorLogos.ziki_tunes, bgColor: "#251E49", useBlendMode: true },
    { id: "omziki", name: "Omziki", logo: distributorLogos.omziki, bgColor: "#000000" },
    { id: "ugatunes", name: "UgaTunes", logo: distributorLogos.ugatunes, bgColor: "#E91E8C" },
    { id: "kelele", name: "Kelele Digital", logo: distributorLogos.kelele, bgColor: "#2A2A2A" },
  ];

  const distributedFiles = files.filter(f => f.is_distributed);
  const undistributedFiles = files.filter(f => !f.is_distributed);

  // Check if file meets distributor requirements
  const checkRequirements = (file, distributorId) => {
    const reqs = distributorRequirements[distributorId];
    if (!reqs) return { met: true, missing: [] };
    
    const missing = [];
    reqs.requirements.forEach(req => {
      const value = file.metadata?.[req.field] || file[req.field];
      if (req.required && !value) {
        missing.push(req.label);
      }
    });
    
    return { met: missing.length === 0, missing };
  };

  const handleDistribute = async (file, selectedDistributors) => {
    if (selectedDistributors.length === 0) {
      toast.error("Please select at least one distributor");
      return;
    }

    // Check requirements for all selected distributors
    const allMissing = [];
    selectedDistributors.forEach(distId => {
      const check = checkRequirements(file, distId);
      if (!check.met) {
        const distName = distributorRequirements[distId]?.name || distId;
        allMissing.push(`${distName}: ${check.missing.join(", ")}`);
      }
    });

    if (allMissing.length > 0) {
      toast.error(
        <div>
          <p className="font-medium mb-1">Missing required metadata:</p>
          {allMissing.map((m, i) => (
            <p key={i} className="text-sm">{m}</p>
          ))}
        </div>,
        { duration: 5000 }
      );
      return;
    }
    
    setUpdating(true);
    try {
      await onUpdateFile(file.id, {
        is_distributed: true,
        distribution_platforms: selectedDistributors
      });
      toast.success("Distribution initiated successfully!");
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

      {/* Distributors with Requirements */}
      <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Partner Distributors & Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {distributors.map((distributor) => {
            const reqs = distributorRequirements[distributor.id];
            return (
              <div
                key={distributor.id}
                className="flex gap-4 p-4 rounded-xl bg-[#0F0D1A] border border-[#8B5CF6]/15 hover:border-[#00BFFF]/30 transition-all"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: distributor.bgColor }}
                >
                  <img 
                    src={distributor.logo} 
                    alt={distributor.name}
                    className="w-14 h-14 object-contain"
                    style={distributor.useBlendMode ? { mixBlendMode: 'multiply' } : {}}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1">{distributor.name}</h3>
                  <p className="text-xs text-zinc-500 mb-2">{reqs?.specs}</p>
                  <div className="flex flex-wrap gap-1">
                    {reqs?.requirements.slice(0, 3).map((req, i) => (
                      <span 
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]"
                      >
                        {req.label}
                      </span>
                    ))}
                    {reqs?.requirements.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        +{reqs.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
                checkRequirements={checkRequirements}
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
                          className="w-6 h-6 rounded overflow-hidden flex items-center justify-center"
                          style={{ backgroundColor: distributor.bgColor }}
                        >
                          <img 
                            src={distributor.logo} 
                            alt={distributor.name}
                            className="w-5 h-5 object-contain"
                            style={distributor.useBlendMode ? { mixBlendMode: 'multiply' } : {}}
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

const DistributionCard = ({ file, distributors, onDistribute, onSelect, updating, index, checkRequirements }) => {
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
          <p className="text-sm text-zinc-400 mb-4">Select distributors (requirements checked automatically):</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {distributors.map((distributor) => {
              const isSelected = selectedDistributors.includes(distributor.id);
              const reqCheck = checkRequirements(file, distributor.id);
              const reqs = distributorRequirements[distributor.id];
              
              return (
                <TooltipProvider key={distributor.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleDistributor(distributor.id)}
                        data-testid={`distributor-${distributor.id}`}
                        className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "border-[#00BFFF] bg-[#00BFFF]/10"
                            : "border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40"
                        }`}
                      >
                        {/* Requirement status indicator */}
                        <div className="absolute top-2 right-2">
                          {reqCheck.met ? (
                            <CheckCircle size={14} className="text-[#10B981]" weight="fill" />
                          ) : (
                            <Warning size={14} className="text-yellow-500" weight="fill" />
                          )}
                        </div>
                        
                        <div 
                          className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center"
                          style={{ backgroundColor: distributor.bgColor }}
                        >
                          <img 
                            src={distributor.logo} 
                            alt={distributor.name}
                            className="w-8 h-8 object-contain"
                            style={distributor.useBlendMode ? { mixBlendMode: 'multiply' } : {}}
                          />
                        </div>
                        <span className="text-xs font-medium">{distributor.name}</span>
                        {isSelected && (
                          <Check size={14} className="text-[#00BFFF]" weight="bold" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#251E49] border-[#8B5CF6]/20 max-w-xs">
                      <div className="text-sm">
                        <p className="font-medium mb-1">{distributor.name} Requirements:</p>
                        <p className="text-xs text-zinc-400 mb-2">{reqs?.specs}</p>
                        <div className="space-y-1">
                          {reqs?.requirements.map((req, i) => {
                            const value = file.metadata?.[req.field] || file[req.field];
                            const hasValue = !!value;
                            return (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                {hasValue ? (
                                  <CheckCircle size={12} className="text-[#10B981]" weight="fill" />
                                ) : (
                                  <Warning size={12} className="text-yellow-500" weight="fill" />
                                )}
                                <span className={hasValue ? "text-zinc-300" : "text-yellow-500"}>
                                  {req.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          
          {/* Missing metadata warning */}
          {selectedDistributors.length > 0 && (
            <div className="mb-4">
              {selectedDistributors.some(id => !checkRequirements(file, id).met) && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
                  <Warning size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-500 font-medium">Missing metadata for some distributors</p>
                    <p className="text-zinc-400 text-xs mt-1">
                      Edit this file in Archive to add the required metadata before distributing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
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
