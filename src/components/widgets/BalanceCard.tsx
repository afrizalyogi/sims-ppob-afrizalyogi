import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getBalance,
  selectIsBalanceVisible,
  setIsBalanceVisibility,
} from "../../features/profileSlice";

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
  const isBalanceVisible = useAppSelector(selectIsBalanceVisible);

  const formatBalance = (num: number) => num.toLocaleString("id-ID");

  const handleHidden = () => {
    if (!isBalanceVisible) {
      dispatch(getBalance());
    }
    dispatch(setIsBalanceVisibility(!isBalanceVisible));
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl text-white shadow-xl">
      <div className="absolute top-0 right-0">
        <img
          src="/Background Saldo.png"
          alt=""
          className="hidden h-full w-full lg:block"
        />
      </div>

      <div className="z-10 flex flex-col items-start gap-2 bg-red-500 p-6 lg:bg-transparent">
        <p className="text-sm font-light">Saldo anda</p>
        <h2 className="text-4xl font-bold tracking-wide">
          {!isBalanceVisible || balance === null
            ? "Rp •••••••"
            : `Rp ${formatBalance(balance || 0)}`}
        </h2>

        <button
          className="mt-3 cursor-pointer text-xs opacity-80 transition hover:opacity-100"
          onClick={handleHidden}
        >
          Lihat Saldo
        </button>
      </div>

      {showFullName && (
        <p className="z-10 text-sm font-medium">Selamat datang, {userName}</p>
      )}
    </div>
  );
}
