import { motion } from "framer-motion";
import {
  ChartLineUp,
  TrendUp,
  Globe,
  Users,
  CurrencyDollar
} from "@phosphor-icons/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

const AnalyticsSection = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121214] border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-zinc-500 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
              {p.name}: {typeof p.value === 'number' && p.name.includes('$') 
                ? `$${p.value.toLocaleString()}` 
                : p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" data-testid="analytics-section">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-zinc-500 mt-1">Track your music performance and revenue</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#121214] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
              <TrendUp size={22} className="text-[#FF6B00]" weight="fill" />
            </div>
          </div>
          <p className="text-2xl font-semibold">
            {(analytics?.total_streams || 0).toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500">Total Streams</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#121214] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <CurrencyDollar size={22} className="text-[#10B981]" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[#10B981]">
            ${(analytics?.total_earnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-zinc-500">Total Earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#121214] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <Users size={22} className="text-[#3B82F6]" />
            </div>
          </div>
          <p className="text-2xl font-semibold">
            {analytics?.streams_by_country?.length || 0}
          </p>
          <p className="text-sm text-zinc-500">Countries Reached</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#121214] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <ChartLineUp size={22} className="text-[#D4AF37]" weight="fill" />
            </div>
          </div>
          <p className="text-2xl font-semibold">+12.5%</p>
          <p className="text-sm text-zinc-500">Growth Rate</p>
        </motion.div>
      </div>

      {/* Streams Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#121214] border border-white/5 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Streams Over Time</h2>
            <p className="text-sm text-zinc-500">Last 30 days</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.streams_by_day || []}>
              <defs>
                <linearGradient id="streamsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="streams" 
                name="Streams"
                stroke="#FF6B00" 
                strokeWidth={2}
                fill="url(#streamsGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Revenue & Geographic */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#121214] border border-white/5 rounded-2xl p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p className="text-sm text-zinc-500">Last 30 days</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.earnings_by_day || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric' })}
                />
                <YAxis 
                  stroke="#71717a"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  name="$ Earnings"
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#121214] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe size={22} className="text-[#FF6B00]" />
            <div>
              <h2 className="text-lg font-semibold">Top Countries</h2>
              <p className="text-sm text-zinc-500">By streams</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={analytics?.streams_by_country || []} 
                layout="vertical"
                margin={{ left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#71717a"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                />
                <YAxis 
                  type="category" 
                  dataKey="country" 
                  stroke="#71717a"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="streams" 
                  name="Streams"
                  fill="#FF6B00" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
