import { useState } from "react";
import { motion } from "framer-motion";
import {
  CloudArrowUp,
  MusicNote,
  VideoCamera,
  Image,
  Trash,
  DotsThree,
  GridFour,
  List,
  Plus,
  X,
  FileAudio,
  Waveform,
  Tag,
  User,
  Globe,
  Calendar,
  Hash
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const ArchiveSection = ({ files, onCreateFile, onSelectFile, onDeleteFile }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Enhanced form data based on Archive Functional Spec
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    file_type: "audio",
    duration: "",
    genre: "",
    
    // Metadata (ISRC, UPC)
    isrc: "",
    upc: "",
    
    // Contributors
    primary_artist: "",
    featured_artists: "",
    producers: "",
    writers: "",
    
    // Additional metadata
    release_date: "",
    label: "",
    copyright_owner: "",
    
    // Rights info
    territories: "global",
    rights_type: "master",
    
    // Asset types
    has_stems: false,
    has_instrumental: false,
    has_acapella: false,
  });

  // Afro-centric genre taxonomy
  const genres = [
    "Afrobeats", "Afro-House", "Afropop", "Amapiano", "Afro-Soul",
    "Highlife", "Juju", "Fuji", "Afro-Fusion", "Afro-R&B",
    "Afro-Gospel", "Afro-Jazz", "Kuduro", "Kwaito", "Gqom",
    "Bongo Flava", "Gengetone", "Hiplife", "Azonto", "Dancehall",
    "Reggae", "Hip-Hop", "R&B", "Gospel", "World"
  ];

  const fileTypes = [
    { value: "audio", label: "Master Audio (WAV/FLAC)", icon: FileAudio },
    { value: "stems", label: "Stems/Session Files", icon: Waveform },
    { value: "video", label: "Music Video", icon: VideoCamera },
    { value: "image", label: "Cover Art/Visuals", icon: Image },
  ];

  const territories = [
    { value: "global", label: "Global (Worldwide)" },
    { value: "africa", label: "Africa Only" },
    { value: "nigeria", label: "Nigeria" },
    { value: "south_africa", label: "South Africa" },
    { value: "kenya", label: "Kenya" },
    { value: "ghana", label: "Ghana" },
    { value: "custom", label: "Custom Territories" },
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setUploading(true);
    try {
      await onCreateFile({
        title: formData.title,
        file_type: formData.file_type,
        duration: formData.duration ? parseInt(formData.duration) : null,
        genre: formData.genre || null,
        metadata: {
          isrc: formData.isrc || null,
          upc: formData.upc || null,
          primary_artist: formData.primary_artist || null,
          featured_artists: formData.featured_artists || null,
          producers: formData.producers || null,
          writers: formData.writers || null,
          release_date: formData.release_date || null,
          label: formData.label || null,
          copyright_owner: formData.copyright_owner || null,
          territories: formData.territories,
          rights_type: formData.rights_type,
          has_stems: formData.has_stems,
          has_instrumental: formData.has_instrumental,
          has_acapella: formData.has_acapella,
        }
      });
      
      // Reset form
      setFormData({
        title: "", file_type: "audio", duration: "", genre: "",
        isrc: "", upc: "", primary_artist: "", featured_artists: "",
        producers: "", writers: "", release_date: "", label: "",
        copyright_owner: "", territories: "global", rights_type: "master",
        has_stems: false, has_instrumental: false, has_acapella: false,
      });
      setUploadDialogOpen(false);
    } catch (error) {
      // Error handled in parent
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "video": return VideoCamera;
      case "stems": return Waveform;
      case "image": return Image;
      default: return MusicNote;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6" data-testid="archive-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Master Archive & Asset Vault</h1>
          <p className="text-zinc-500 mt-1">Secure, permanent storage for your music IP assets</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[#251E49] rounded-xl p-1 border border-[#8B5CF6]/15">
            <button
              onClick={() => setViewMode("grid")}
              data-testid="view-grid-btn"
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" 
                  ? "bg-[#00BFFF]/10 text-[#00BFFF]" 
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <GridFour size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              data-testid="view-list-btn"
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" 
                  ? "bg-[#00BFFF]/10 text-[#00BFFF]" 
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Upload Button */}
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <button
                data-testid="upload-btn"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium rounded-xl px-5 py-2.5 shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.5)] transition-all"
              >
                <Plus size={20} weight="bold" />
                Upload Asset
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1528] border-[#8B5CF6]/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Upload New Asset</DialogTitle>
                <DialogDescription className="text-zinc-500">Add a master recording, stems, or visual assets to your vault</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-[#251E49]">
                    <TabsTrigger value="basic" className="data-[state=active]:bg-[#00BFFF]/20 data-[state=active]:text-[#00BFFF]">Basic Info</TabsTrigger>
                    <TabsTrigger value="metadata" className="data-[state=active]:bg-[#00BFFF]/20 data-[state=active]:text-[#00BFFF]">Metadata</TabsTrigger>
                    <TabsTrigger value="rights" className="data-[state=active]:bg-[#00BFFF]/20 data-[state=active]:text-[#00BFFF]">Rights</TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="form-section">
                      <div className="form-section-title">Asset Information</div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-400">Title *</Label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Track or asset title"
                            className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                            data-testid="upload-title-input"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-zinc-400">Asset Type</Label>
                            <Select
                              value={formData.file_type}
                              onValueChange={(value) => setFormData({ ...formData, file_type: value })}
                            >
                              <SelectTrigger className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20" data-testid="upload-type-select">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#251E49] border-[#8B5CF6]/20">
                                {fileTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <type.icon size={16} />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-zinc-400">Duration (seconds)</Label>
                            <Input
                              type="number"
                              value={formData.duration}
                              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                              placeholder="180"
                              className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                              data-testid="upload-duration-input"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-zinc-400">Genre (Afro-centric Taxonomy)</Label>
                          <Select
                            value={formData.genre}
                            onValueChange={(value) => setFormData({ ...formData, genre: value })}
                          >
                            <SelectTrigger className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20" data-testid="upload-genre-select">
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#251E49] border-[#8B5CF6]/20 max-h-60">
                              {genres.map((genre) => (
                                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Assets Checkboxes */}
                    <div className="form-section">
                      <div className="form-section-title">Related Assets</div>
                      <div className="grid grid-cols-3 gap-3">
                        <label className="flex items-center gap-2 p-3 rounded-lg bg-[#0F0D1A] border border-[#8B5CF6]/15 cursor-pointer hover:border-[#00BFFF]/30 transition-all">
                          <input
                            type="checkbox"
                            checked={formData.has_stems}
                            onChange={(e) => setFormData({ ...formData, has_stems: e.target.checked })}
                            className="w-4 h-4 rounded border-[#8B5CF6]/30 bg-[#0F0D1A] text-[#00BFFF] focus:ring-[#00BFFF]"
                          />
                          <span className="text-sm">Has Stems</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 rounded-lg bg-[#0F0D1A] border border-[#8B5CF6]/15 cursor-pointer hover:border-[#00BFFF]/30 transition-all">
                          <input
                            type="checkbox"
                            checked={formData.has_instrumental}
                            onChange={(e) => setFormData({ ...formData, has_instrumental: e.target.checked })}
                            className="w-4 h-4 rounded border-[#8B5CF6]/30 bg-[#0F0D1A] text-[#00BFFF] focus:ring-[#00BFFF]"
                          />
                          <span className="text-sm">Instrumental</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 rounded-lg bg-[#0F0D1A] border border-[#8B5CF6]/15 cursor-pointer hover:border-[#00BFFF]/30 transition-all">
                          <input
                            type="checkbox"
                            checked={formData.has_acapella}
                            onChange={(e) => setFormData({ ...formData, has_acapella: e.target.checked })}
                            className="w-4 h-4 rounded border-[#8B5CF6]/30 bg-[#0F0D1A] text-[#00BFFF] focus:ring-[#00BFFF]"
                          />
                          <span className="text-sm">Acapella</span>
                        </label>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Metadata Tab */}
                  <TabsContent value="metadata" className="space-y-4 mt-4">
                    <div className="form-section">
                      <div className="form-section-title">Identifiers</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-400">ISRC Code</Label>
                          <div className="relative">
                            <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <Input
                              value={formData.isrc}
                              onChange={(e) => setFormData({ ...formData, isrc: e.target.value.toUpperCase() })}
                              placeholder="USRC12345678"
                              className="h-11 pl-10 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF] uppercase"
                              data-testid="upload-isrc-input"
                              maxLength={12}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-400">UPC/EAN</Label>
                          <div className="relative">
                            <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <Input
                              value={formData.upc}
                              onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
                              placeholder="0123456789012"
                              className="h-11 pl-10 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                              data-testid="upload-upc-input"
                              maxLength={13}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="form-section-title">Contributor Roles</div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-400">Primary Artist *</Label>
                          <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <Input
                              value={formData.primary_artist}
                              onChange={(e) => setFormData({ ...formData, primary_artist: e.target.value })}
                              placeholder="Main performing artist"
                              className="h-11 pl-10 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                              data-testid="upload-artist-input"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-zinc-400">Featured Artists</Label>
                          <Input
                            value={formData.featured_artists}
                            onChange={(e) => setFormData({ ...formData, featured_artists: e.target.value })}
                            placeholder="Comma-separated: Artist 1, Artist 2"
                            className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-zinc-400">Producer(s)</Label>
                            <Input
                              value={formData.producers}
                              onChange={(e) => setFormData({ ...formData, producers: e.target.value })}
                              placeholder="Producer names"
                              className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-zinc-400">Writer(s)</Label>
                            <Input
                              value={formData.writers}
                              onChange={(e) => setFormData({ ...formData, writers: e.target.value })}
                              placeholder="Songwriter names"
                              className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="form-section-title">Release Information</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-400">Release Date</Label>
                          <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <Input
                              type="date"
                              value={formData.release_date}
                              onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                              className="h-11 pl-10 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-400">Label</Label>
                          <Input
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            placeholder="Record label name"
                            className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Rights Tab */}
                  <TabsContent value="rights" className="space-y-4 mt-4">
                    <div className="form-section">
                      <div className="form-section-title">Ownership</div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-400">Copyright Owner</Label>
                          <Input
                            value={formData.copyright_owner}
                            onChange={(e) => setFormData({ ...formData, copyright_owner: e.target.value })}
                            placeholder="Legal copyright holder"
                            className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20 focus:border-[#00BFFF]"
                            data-testid="upload-copyright-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-zinc-400">Rights Type</Label>
                          <Select
                            value={formData.rights_type}
                            onValueChange={(value) => setFormData({ ...formData, rights_type: value })}
                          >
                            <SelectTrigger className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#251E49] border-[#8B5CF6]/20">
                              <SelectItem value="master">Master Recording Rights</SelectItem>
                              <SelectItem value="publishing">Publishing Rights</SelectItem>
                              <SelectItem value="both">Master + Publishing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="form-section-title">Territory Rights</div>
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Territories</Label>
                        <Select
                          value={formData.territories}
                          onValueChange={(value) => setFormData({ ...formData, territories: value })}
                        >
                          <SelectTrigger className="h-11 bg-[#0F0D1A] border-[#8B5CF6]/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#251E49] border-[#8B5CF6]/20">
                            {territories.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                <div className="flex items-center gap-2">
                                  <Globe size={16} />
                                  {t.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <p className="text-xs text-zinc-500 mt-2">
                        Territory rights define where this asset can be distributed and licensed.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <button
                  type="submit"
                  disabled={uploading || !formData.title.trim()}
                  data-testid="upload-submit-btn"
                  className="w-full h-12 bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] text-white font-medium rounded-xl shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CloudArrowUp size={20} weight="bold" />
                      Upload to Vault
                    </>
                  )}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="drop-zone"
        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
          isDragging
            ? "border-[#00BFFF]/50 bg-[#00BFFF]/5"
            : "border-[#8B5CF6]/30 bg-[#251E49] hover:border-[#00BFFF]/30"
        }`}
        onClick={() => setUploadDialogOpen(true)}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00BFFF]/20 to-[#8B5CF6]/10 flex items-center justify-center mb-4">
          <CloudArrowUp size={32} className="text-[#00BFFF]" weight="duotone" />
        </div>
        <p className="text-lg font-medium mb-1">
          {isDragging ? "Drop your files here" : "Drag & drop master files here"}
        </p>
        <p className="text-sm text-zinc-500">WAV, FLAC, stems, session files, cover art</p>
      </div>

      {/* Files */}
      {files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">No assets in your vault yet</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file, index) => {
            const Icon = getFileIcon(file.file_type);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() => onSelectFile(file)}
                data-testid={`file-card-${index}`}
                className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-4 cursor-pointer hover:-translate-y-1 hover:border-[#00BFFF]/30 hover:shadow-[0_8px_30px_rgba(0,191,255,0.1)] transition-all duration-300 group"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#8B5CF6]/5 flex items-center justify-center mb-3 group-hover:from-[#00BFFF]/20 transition-all">
                  <Icon size={40} className="text-[#00BFFF]" weight="duotone" />
                </div>
                <p className="font-medium truncate mb-1">{file.title}</p>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{file.genre || "Unknown"}</span>
                  <span>{formatDuration(file.duration)}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {file.is_archived && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981]">
                      Archived
                    </span>
                  )}
                  {file.is_distributed && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00BFFF]/10 text-[#00BFFF]">
                      Distributed
                    </span>
                  )}
                  {file.is_licensed && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">
                      Licensed
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#8B5CF6]/10">
                <th className="text-left text-xs text-zinc-500 font-medium p-4">Title</th>
                <th className="text-left text-xs text-zinc-500 font-medium p-4 hidden md:table-cell">Genre</th>
                <th className="text-left text-xs text-zinc-500 font-medium p-4 hidden md:table-cell">Duration</th>
                <th className="text-left text-xs text-zinc-500 font-medium p-4">Status</th>
                <th className="text-right text-xs text-zinc-500 font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => {
                const Icon = getFileIcon(file.file_type);
                return (
                  <tr
                    key={file.id}
                    onClick={() => onSelectFile(file)}
                    data-testid={`file-row-${index}`}
                    className="border-b border-[#8B5CF6]/10 last:border-0 hover:bg-[#8B5CF6]/5 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
                          <Icon size={20} className="text-[#00BFFF]" />
                        </div>
                        <span className="font-medium">{file.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 hidden md:table-cell">{file.genre || "—"}</td>
                    <td className="p-4 text-zinc-400 hidden md:table-cell">{formatDuration(file.duration)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {file.is_archived && (
                          <span className="text-xs px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981]">
                            Archived
                          </span>
                        )}
                        {file.is_distributed && (
                          <span className="text-xs px-2 py-1 rounded bg-[#00BFFF]/10 text-[#00BFFF]">
                            Distributed
                          </span>
                        )}
                        {file.is_licensed && (
                          <span className="text-xs px-2 py-1 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">
                            Licensed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-[#8B5CF6]/10 transition-colors"
                          >
                            <DotsThree size={20} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#251E49] border-[#8B5CF6]/20">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFile(file.id);
                            }}
                            className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                          >
                            <Trash size={16} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArchiveSection;
