import { useState, useRef } from "react";
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
  X
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ArchiveSection = ({ files, onCreateFile, onSelectFile, onDeleteFile }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    file_type: "audio",
    duration: "",
    genre: ""
  });

  const genres = [
    "Afrobeats", "Afro-House", "Afropop", "Amapiano", "Highlife",
    "Juju", "Fuji", "Reggae", "Gospel", "Hip-Hop", "R&B", "World"
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
    // In mock mode, just open the dialog
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
        genre: formData.genre || null
      });
      setFormData({ title: "", file_type: "audio", duration: "", genre: "" });
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
          <h1 className="text-2xl font-semibold tracking-tight">Archive</h1>
          <p className="text-zinc-500 mt-1">Manage and organize your music catalog</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[#121214] rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setViewMode("grid")}
              data-testid="view-grid-btn"
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" 
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]" 
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
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]" 
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-xl px-5 py-2.5 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all"
              >
                <Plus size={20} weight="bold" />
                Upload File
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#121214] border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Upload New File</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Track title"
                    className="h-11 bg-[#0A0A0B] border-white/10 focus:border-[#FF6B00]"
                    data-testid="upload-title-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Type</Label>
                    <Select
                      value={formData.file_type}
                      onValueChange={(value) => setFormData({ ...formData, file_type: value })}
                    >
                      <SelectTrigger className="h-11 bg-[#0A0A0B] border-white/10" data-testid="upload-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121214] border-white/10">
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
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
                      className="h-11 bg-[#0A0A0B] border-white/10 focus:border-[#FF6B00]"
                      data-testid="upload-duration-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400">Genre</Label>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) => setFormData({ ...formData, genre: value })}
                  >
                    <SelectTrigger className="h-11 bg-[#0A0A0B] border-white/10" data-testid="upload-genre-select">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121214] border-white/10">
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !formData.title.trim()}
                  data-testid="upload-submit-btn"
                  className="w-full h-11 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CloudArrowUp size={20} weight="bold" />
                      Upload File
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
            ? "border-[#FF6B00]/50 bg-[#FF6B00]/5"
            : "border-white/20 bg-[#121214] hover:border-[#FF6B00]/30"
        }`}
        onClick={() => setUploadDialogOpen(true)}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-[#D4AF37]/10 flex items-center justify-center mb-4">
          <CloudArrowUp size={32} className="text-[#FF6B00]" weight="duotone" />
        </div>
        <p className="text-lg font-medium mb-1">
          {isDragging ? "Drop your files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-zinc-500">or click to browse</p>
      </div>

      {/* Files */}
      {files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">No files in your archive yet</p>
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
                className="bg-[#121214] border border-white/5 rounded-2xl p-4 cursor-pointer hover:-translate-y-1 hover:border-[#FF6B00]/30 hover:shadow-[0_8px_30px_rgba(255,107,0,0.1)] transition-all duration-300 group"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FF6B00]/10 to-[#D4AF37]/5 flex items-center justify-center mb-3 group-hover:from-[#FF6B00]/20 transition-all">
                  <Icon size={40} className="text-[#FF6B00]" weight="duotone" />
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6]">
                      Distributed
                    </span>
                  )}
                  {file.is_licensed && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37]">
                      Licensed
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
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
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
                          <Icon size={20} className="text-[#FF6B00]" />
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
                          <span className="text-xs px-2 py-1 rounded bg-[#3B82F6]/10 text-[#3B82F6]">
                            Distributed
                          </span>
                        )}
                        {file.is_licensed && (
                          <span className="text-xs px-2 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37]">
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
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <DotsThree size={20} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#121214] border-white/10">
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
