import { useAppSelector } from "../../store/hooks";
import {
  selectUserProfile,
  selectUserBalance,
} from "../../features/profileSlice";
import BalanceCard from "./BalanceCard";

export default function ProfileBalance() {
  const user = useAppSelector(selectUserProfile);
  const balance = useAppSelector(selectUserBalance);

  const userName = `${user?.first_name || "Pengguna"} ${user?.last_name || ""}`;
  const userImage =
    user?.profile_image ===
    "https://minio.nutech-integrasi.com/take-home-test/null"
      ? "/Profile Photo.png"
      : user?.profile_image || "/Profile Photo.png";

  return (
    <div className="mb-8 block w-full justify-between gap-8 lg:flex">
      <div className="mx-auto flex flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 sm:h-32 sm:w-32">
          <img
            src={userImage}
            alt="Profile"
            className="mb-4 h-20 w-20 rounded-full object-cover shadow-sm sm:h-32 sm:w-32"
          />
        </div>
        <h1 className="text-center text-lg font-medium text-gray-800 sm:text-xl lg:text-left">
          Selamat datang,
        </h1>
        <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl lg:text-left">
          {userName}
        </h2>
      </div>

      <div className="mt-8 w-full lg:mt-0 lg:w-[650px]">
        <BalanceCard balance={balance || 0} />
      </div>
    </div>
  );
}
