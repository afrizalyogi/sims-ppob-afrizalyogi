import { useEffect, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getHistory,
  selectTransactionHistory,
  selectHistoryStatus,
} from "../../../features/transactionSlice";
import {
  selectUserProfile,
  selectUserBalance,
  getBalance,
} from "../../../features/profileSlice";

import HistoryItem from "../../../components/widgets/HistoryItem";
import ProfileBalance from "../../../components/widgets/ProfileBalance";

const LIMIT = 5;

export default function History() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUserProfile);
  const balance = useAppSelector(selectUserBalance);
  const history = useAppSelector(selectTransactionHistory);
  const historyStatus = useAppSelector(selectHistoryStatus);

  const userName = `${user?.first_name || "Pengguna"} ${user?.last_name || ""}`;
  const userImage =
    user?.profile_image ===
    "https://minio.nutech-integrasi.com/take-home-test/null"
      ? "/Profile Photo.png"
      : user?.profile_image || "/Profile Photo.png";

  const isLoading = historyStatus === "loading";
  const isFirstLoad = historyStatus === "idle" && history.length === 0;

  const loadHistory = useCallback(
    (newOffset: number) => {
      if (isLoading) return;
      dispatch(getHistory({ limit: LIMIT, offset: newOffset }));
    },
    [isLoading, dispatch],
  );

  useEffect(() => {
    if (isFirstLoad) {
      loadHistory(0);
    }
    if (balance === null) {
      dispatch(getBalance());
    }
  }, [isFirstLoad, dispatch, balance, loadHistory]);

  const handleShowMore = () => {
    const newOffset = history.length;
    loadHistory(newOffset);
  };

  if (isFirstLoad && isLoading) {
    return (
      <div className="mx-auto p-8 text-center">Memuat Riwayat Transaksi...</div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <ProfileBalance
        userImage={userImage}
        userName={userName}
        balance={balance}
      />
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Semua Transaksi
        </h2>

        {history.length > 0 ? (
          <>
            <div className="space-y-4">
              {history.map((item, index) => (
                <HistoryItem key={index} item={item} />
              ))}
            </div>

            <div className="mt-6 text-center">
              {historyStatus === "succeeded" && history.length % LIMIT !== 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  Semua riwayat sudah ditampilkan
                </p>
              ) : (
                <button
                  onClick={handleShowMore}
                  disabled={
                    isLoading ||
                    (historyStatus === "succeeded" &&
                      history.length % LIMIT !== 0)
                  }
                  className="w-full cursor-pointer text-red-500 hover:text-red-700"
                >
                  {isLoading ? "Memuat..." : "Lihat lainnya"}
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="py-10 text-center text-gray-500">
            Belum ada riwayat transaksi
          </p>
        )}
      </div>
    </div>
  );
}
