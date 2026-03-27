import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  Bank,
  DeviceMobile,
  PaypalLogo,
  Check,
  Clock,
  X
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const WalletSection = ({ user, transactions, onWithdraw }) => {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const withdrawMethods = [
    { id: "mobile_money", name: "Mobile Money", icon: DeviceMobile, description: "M-Pesa, MTN Mobile Money" },
    { id: "bank", name: "Bank Transfer", icon: Bank, description: "Direct to bank account" },
    { id: "paypal", name: "PayPal", icon: PaypalLogo, description: "PayPal account" },
  ];

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > (user?.wallet_balance || 0)) {
      toast.error("Insufficient balance");
      return;
    }
    if (!withdrawMethod) {
      toast.error("Please select a withdrawal method");
      return;
    }

    setWithdrawing(true);
    try {
      await onWithdraw(amount, withdrawMethod, {});
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setWithdrawMethod("");
    } catch (error) {
      // handled in parent
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <Check size={16} className="text-[#10B981]" weight="bold" />;
      case "pending": return <Clock size={16} className="text-[#FF6B00]" />;
      case "failed": return <X size={16} className="text-red-500" weight="bold" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-[#10B981] bg-[#10B981]/10";
      case "pending": return "text-[#FF6B00] bg-[#FF6B00]/10";
      case "failed": return "text-red-500 bg-red-500/10";
      default: return "text-zinc-400 bg-zinc-800";
    }
  };

  return (
    <div className="space-y-6" data-testid="wallet-section">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Wallet</h1>
        <p className="text-zinc-500 mt-1">Manage your earnings and withdrawals</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0B] border border-[#D4AF37]/20 rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6B00]/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Wallet size={32} className="text-[#D4AF37]" weight="fill" />
            </div>
            <div>
              <p className="text-zinc-400">Available Balance</p>
              <p className="text-4xl font-bold text-[#D4AF37]" data-testid="wallet-balance">
                ${(user?.wallet_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <button
                data-testid="withdraw-btn"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-xl px-6 py-3 shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-all"
              >
                <ArrowUp size={20} weight="bold" />
                Withdraw Funds
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#121214] border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Withdraw Funds</DialogTitle>
                <DialogDescription className="text-zinc-500">Transfer your earnings to your preferred payment method</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-5 mt-4">
                {/* Amount */}
                <div className="space-y-2">
                  <Label className="text-zinc-400">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-8 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#FF6B00] text-lg"
                      data-testid="withdraw-amount-input"
                      max={user?.wallet_balance || 0}
                    />
                  </div>
                  <p className="text-xs text-zinc-500">
                    Available: ${(user?.wallet_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Method Selection */}
                <div className="space-y-3">
                  <Label className="text-zinc-400">Withdrawal Method</Label>
                  <div className="space-y-2">
                    {withdrawMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = withdrawMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setWithdrawMethod(method.id)}
                          data-testid={`method-${method.id}`}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                            isSelected
                              ? "border-[#FF6B00] bg-[#FF6B00]/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-[#FF6B00]/20" : "bg-zinc-800"
                          }`}>
                            <Icon size={22} className={isSelected ? "text-[#FF6B00]" : "text-zinc-400"} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-zinc-500">{method.description}</p>
                          </div>
                          {isSelected && (
                            <Check size={20} className="text-[#FF6B00]" weight="bold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing || !withdrawAmount || !withdrawMethod}
                  data-testid="confirm-withdraw-btn"
                  className="w-full h-12 bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] text-white font-medium rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {withdrawing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowUp size={20} weight="bold" />
                      Withdraw ${withdrawAmount || "0.00"}
                    </>
                  )}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Transactions */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <Wallet size={28} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx, index) => {
              const isEarning = tx.transaction_type === "earning";
              const isWithdrawal = tx.transaction_type === "withdrawal";
              
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  data-testid={`transaction-${index}`}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isEarning ? "bg-[#10B981]/10" : "bg-[#FF6B00]/10"
                  }`}>
                    {isEarning ? (
                      <ArrowDown size={20} className="text-[#10B981]" />
                    ) : (
                      <ArrowUp size={20} className="text-[#FF6B00]" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tx.description}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(tx.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold ${isEarning ? "text-[#10B981]" : "text-zinc-300"}`}>
                      {isEarning ? "+" : ""}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md ${getStatusColor(tx.status)}`}>
                      {getStatusIcon(tx.status)}
                      {tx.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSection;
