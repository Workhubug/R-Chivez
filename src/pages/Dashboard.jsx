import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  House,
  Archive,
  Broadcast,
  Certificate,
  Wallet,
  ChartLineUp,
  SignOut,
  Shield,
  FileText,
  Gear
} from "@phosphor-icons/react";
import { useAuth } from "@/App";
import { toast } from "sonner";
import RChivezLogo from "@/components/RChivezLogo";

// Mock data functions
import {
  mockGetFiles,
  mockGetAnalytics,
  mockGetTransactions,
  mockCreateFile,
  mockUpdateFile,
  mockDeleteFile,
  mockWithdraw,
  mockSeedDemoData,
  mockGetWalletBalance,
} from "@/lib/mockData";

// Dashboard Sections
import DashboardHome from "@/components/dashboard/DashboardHome";
import ArchiveSection from "@/components/dashboard/ArchiveSection";
import DistributionSection from "@/components/dashboard/DistributionSection";
import LicensingSection from "@/components/dashboard/LicensingSection";
import WalletSection from "@/components/dashboard/WalletSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import FileDetailPanel from "@/components/dashboard/FileDetailPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { path: "/dashboard", icon: House, label: "Dashboard" },
    { path: "/dashboard/archive", icon: Archive, label: "Archive" },
    { path: "/dashboard/distribution", icon: Broadcast, label: "Distribution" },
    { path: "/dashboard/licensing", icon: Certificate, label: "Licensing" },
    { path: "/dashboard/analytics", icon: ChartLineUp, label: "Analytics" },
    { path: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  ];

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesData, analyticsData, transactionsData] = await Promise.all([
          mockGetFiles(user.id),
          mockGetAnalytics(user.id),
          mockGetTransactions(user.id),
        ]);
        
        setFiles(filesData);
        setAnalytics(analyticsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  // Seed demo data if no files
  const seedDemoData = async () => {
    try {
      const response = await mockSeedDemoData(user.id);
      setFiles(response.files);
      
      // Refresh analytics and user data
      const [analyticsData] = await Promise.all([
        mockGetAnalytics(user.id),
      ]);
      setAnalytics(analyticsData);
      
      toast.success("Demo data loaded!");
    } catch (error) {
      toast.error("Failed to load demo data");
    }
  };

  // Create file
  const createFile = async (fileData) => {
    try {
      const newFile = await mockCreateFile(fileData, user.id);
      setFiles([...files, newFile]);
      toast.success("Asset uploaded successfully!");
      return newFile;
    } catch (error) {
      toast.error("Failed to upload asset");
      throw error;
    }
  };

  // Update file
  const updateFile = async (fileId, updates) => {
    try {
      const updatedFile = await mockUpdateFile(fileId, updates, user.id);
      setFiles(files.map(f => f.id === fileId ? updatedFile : f));
      if (selectedFile?.id === fileId) {
        setSelectedFile(updatedFile);
      }
      toast.success("Asset updated!");
      return updatedFile;
    } catch (error) {
      toast.error("Failed to update asset");
      throw error;
    }
  };

  // Delete file
  const deleteFile = async (fileId) => {
    try {
      await mockDeleteFile(fileId, user.id);
      setFiles(files.filter(f => f.id !== fileId));
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      toast.success("Asset deleted");
    } catch (error) {
      toast.error("Failed to delete asset");
    }
  };

  // Withdraw
  const withdraw = async (amount, method, details) => {
    try {
      const response = await mockWithdraw(amount, method, details, user.id);
      updateUser({ wallet_balance: response.new_balance });
      
      // Refresh transactions
      const transactionsData = await mockGetTransactions(user.id);
      setTransactions(transactionsData);
      
      toast.success("Withdrawal initiated!");
      return response;
    } catch (error) {
      toast.error(error.message || "Withdrawal failed");
      throw error;
    }
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0F0D1A] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#8B5CF6]/10 bg-[#0F0D1A] hidden md:flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-[#8B5CF6]/10">
          <RChivezLogo size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-[#00BFFF]/10 text-[#00BFFF] border-l-3 border-[#00BFFF]"
                    : "text-zinc-400 hover:bg-[#8B5CF6]/10 hover:text-white"
                }`}
              >
                <Icon size={22} weight={active ? "fill" : "regular"} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#8B5CF6]/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#251E49] mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
              {user?.artist_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.artist_name}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            data-testid="logout-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-[#8B5CF6]/10 hover:text-white transition-all"
          >
            <SignOut size={22} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <Routes>
            <Route 
              index 
              element={
                <DashboardHome 
                  files={files}
                  analytics={analytics}
                  user={user}
                  loading={loading}
                  onSeedDemo={seedDemoData}
                  onSelectFile={setSelectedFile}
                />
              } 
            />
            <Route 
              path="archive" 
              element={
                <ArchiveSection 
                  files={files}
                  onCreateFile={createFile}
                  onSelectFile={setSelectedFile}
                  onDeleteFile={deleteFile}
                />
              } 
            />
            <Route 
              path="distribution" 
              element={
                <DistributionSection 
                  files={files}
                  onUpdateFile={updateFile}
                  onSelectFile={setSelectedFile}
                />
              } 
            />
            <Route 
              path="licensing" 
              element={
                <LicensingSection 
                  files={files}
                  onUpdateFile={updateFile}
                  onSelectFile={setSelectedFile}
                />
              } 
            />
            <Route 
              path="analytics" 
              element={
                <AnalyticsSection 
                  analytics={analytics}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="wallet" 
              element={
                <WalletSection 
                  user={user}
                  transactions={transactions}
                  onWithdraw={withdraw}
                />
              } 
            />
          </Routes>
        </div>
      </main>

      {/* File Detail Panel */}
      <AnimatePresence>
        {selectedFile && (
          <FileDetailPanel
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onUpdate={updateFile}
            onDelete={deleteFile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
