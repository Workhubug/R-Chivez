import { motion } from "framer-motion";
import {
  Files,
  Archive,
  Broadcast,
  Certificate,
  Wallet,
  TrendUp,
  MusicNote,
  Sparkle
} from "@phosphor-icons/react";

const DashboardHome = ({ files, analytics, user, loading, onSeedDemo, onSelectFile }) => {
  const metrics = [
    {
      icon: Files,
      label: "Total Files",
      value: analytics?.total_files || 0,
      color: "#00BFFF",
      bgColor: "rgba(0, 191, 255, 0.1)"
    },
    {
      icon: Archive,
      label: "Archived",
      value: analytics?.archived_files || 0,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
      icon: Broadcast,
      label: "Distributed",
      value: analytics?.distributed_files || 0,
      color: "#00BFFF",
      bgColor: "rgba(0, 191, 255, 0.1)"
    },
    {
      icon: Certificate,
      label: "Licensed",
      value: analytics?.licensed_files || 0,
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.1)"
    },
    {
      icon: Wallet,
      label: "Balance",
      value: `$${(user?.wallet_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)"
    }
  ];

  const recentFiles = files.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="dashboard-home">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Welcome back, <span className="text-[#00BFFF]">{user?.artist_name}</span>
          </h1>
          <p className="text-zinc-500 mt-1">Here's what's happening with your catalog</p>
        </div>
        
        {files.length === 0 && (
          <button
            onClick={onSeedDemo}
            data-testid="seed-demo-btn"
            className="inline-flex items-center gap-2 bg-[#251E49] border border-[#8B5CF6]/20 text-white font-medium rounded-xl px-5 py-2.5 hover:bg-[#322A5C] transition-all"
          >
            <Sparkle size={20} className="text-[#8B5CF6]" />
            Load Demo Data
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              data-testid={`metric-${metric.label.toLowerCase().replace(' ', '-')}`}
              className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-5 hover:-translate-y-1 hover:border-[#00BFFF]/30 hover:shadow-[0_8px_30px_rgba(0,191,255,0.1)] transition-all duration-300"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: metric.bgColor }}
              >
                <Icon size={24} weight="duotone" style={{ color: metric.color }} />
              </div>
              <p className="text-2xl font-semibold">{metric.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Total Streams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 flex items-center justify-center">
                <TrendUp size={22} className="text-[#00BFFF]" weight="fill" />
              </div>
              <span className="text-zinc-400">Total Streams</span>
            </div>
            <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-md">+12.5%</span>
          </div>
          <p className="text-3xl font-bold">
            {(analytics?.total_streams || 0).toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 mt-1">All time plays across platforms</p>
        </motion.div>

        {/* Total Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gradient-to-br from-[#251E49] to-[#1A1528] border border-[#8B5CF6]/20 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                  <Wallet size={22} className="text-[#8B5CF6]" weight="fill" />
                </div>
                <span className="text-zinc-400">Total Earnings</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#8B5CF6]">
              ${(analytics?.total_earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-zinc-500 mt-1">From streams & licensing</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Files */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="bg-[#251E49] border border-[#8B5CF6]/15 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Files</h2>
          {files.length > 5 && (
            <button className="text-sm text-[#00BFFF] hover:text-[#8B5CF6] transition-colors">
              View All
            </button>
          )}
        </div>

        {recentFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#322A5C] flex items-center justify-center">
              <MusicNote size={32} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 mb-2">No files yet</p>
            <p className="text-sm text-zinc-600">Upload your first track to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => onSelectFile(file)}
                data-testid={`recent-file-${index}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#8B5CF6]/5 cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF]/20 to-[#8B5CF6]/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MusicNote size={24} className="text-[#00BFFF]" weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.title}</p>
                  <p className="text-sm text-zinc-500">{file.genre || "Unknown genre"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {file.is_archived && (
                    <span className="text-xs px-2 py-1 rounded-md bg-[#10B981]/10 text-[#10B981]">
                      Archived
                    </span>
                  )}
                  {file.is_distributed && (
                    <span className="text-xs px-2 py-1 rounded-md bg-[#00BFFF]/10 text-[#00BFFF]">
                      Distributed
                    </span>
                  )}
                  {file.is_licensed && (
                    <span className="text-xs px-2 py-1 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6]">
                      Licensed
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{file.streams?.toLocaleString() || 0}</p>
                  <p className="text-xs text-zinc-500">streams</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;
