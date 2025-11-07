import { useAppDispatch } from "../../store/hooks";
import { useState, useEffect } from "react";
import { getBalance } from "../../features/profileSlice";

interface BalanceCardProps {
  balance: number | null;
  userName: string;
  showFullName?: boolean;
}

export default function BalanceCard({
  balance,
  userName,
  showFullName = true,
}: BalanceCardProps) {
  const dispatch = useAppDispatch();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  useEffect(() => {
    if (balance !== null) {
      setIsBalanceVisible(true);
    }
  }, [balance]);

  const formatBalance = (num: number) => num.toLocaleString("id-ID");

  const handleHidden = () => {
    if (!isBalanceVisible) {
      // Only fetch balance if it's currently hidden and we are about to show it
      dispatch(getBalance());
    }
    setIsBalanceVisible((prev) => !prev);
  };

  return (
    <div className="w-full h-full text-white p-6 rounded-xl shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="absolute right-0 top-0">
        <img src="/Background Saldo.png" alt="" className="w-full h-full" />
      </div>

      <div className="z-10 flex flex-col gap-2 items-start">
        <p className="text-sm font-light">Saldo anda</p>
        <h2 className="text-4xl font-bold tracking-wide">
          {!isBalanceVisible || balance === null
            ? "Rp •••••••"
            : `Rp ${formatBalance(balance || 0)}`}
        </h2>

        <button
          className="text-xs mt-3 opacity-80 hover:opacity-100 cursor-pointer transition"
          onClick={handleHidden}
        >
          Lihat Saldo
        </button>
      </div>

      {showFullName && (
        <p className="text-sm z-10 font-medium">Selamat datang, {userName}</p>
      )}
    </div>
  );
}
