import BalanceCard from "./BalanceCard";

interface ProfileBalanceProps {
  userImage?: string;
  userName?: string;
  balance?: number | null;
}

export default function ProfileBalance({
  userImage,
  userName,
  balance,
}: ProfileBalanceProps) {
  return (
    <div className="mb-8 block w-full justify-between gap-8 lg:flex">
      <div className="mx-auto flex flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
        <img
          src={userImage}
          alt="Profile"
          className="mb-4 h-20 w-20 rounded-full object-cover shadow-sm"
        />
        <h1 className="text-center text-xl font-medium text-gray-800 lg:text-left">
          Selamat datang,
        </h1>
        <h2 className="text-center text-2xl font-bold text-gray-900 lg:text-left">
          {userName}
        </h2>
      </div>

      <div className="mt-8 w-full lg:mt-0 lg:w-[650px]">
        <BalanceCard
          balance={balance || 0}
          userName={userName || "Pengguna"}
          showFullName={false}
        />
      </div>
    </div>
  );
}
