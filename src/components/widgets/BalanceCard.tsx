import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getBalance,
  selectIsBalanceVisible,
  setIsBalanceVisibility,
} from "../../features/profileSlice";

interface BalanceCardProps {
  balance: number | null;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
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
      <div className="absolute top-0 right-0 h-full w-full">
        <img
          src="/Background Saldo.png"
          alt=""
          className="h-full w-full object-cover object-right"
        />
      </div>

      <div className="z-10 flex flex-col items-start gap-2 p-6 lg:bg-transparent">
        <p className="text-sm font-light">Saldo anda</p>
        <h2 className="text-2xl font-bold sm:text-4xl">
          {!isBalanceVisible || balance === null
            ? "Rp •••••••"
            : `Rp ${formatBalance(balance || 0)}`}
        </h2>

        <button
          className="cursor-pointer text-xs opacity-80 transition hover:opacity-100 sm:mt-3"
          onClick={handleHidden}
        >
          {!isBalanceVisible ? "Lihat Saldo" : "Sembunyikan Saldo"}
        </button>
      </div>
    </div>
  );
}
