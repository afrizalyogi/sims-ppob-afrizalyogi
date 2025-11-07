import { useEffect } from "react";
// import { useNavigate } from "react-router";
import MainLayout from "../../components/Layout/MainLayout";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getProfile,
  getBalance,
  selectUserProfile,
  selectUserBalance,
} from "../../features/profileSlice";
import {
  getServices,
  getBanners,
  selectServices,
  selectBanners,
} from "../../features/transactionSlice";

import BalanceCard from "../../components/Widget/BalanceCard";
import ServiceIcon from "../../components/Widget/ServiceIcon";
import PromoBanner from "../../components/Widget/PromoBanner";

export default function Home() {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const user = useAppSelector(selectUserProfile);
  const balance = useAppSelector(selectUserBalance);
  const services = useAppSelector(selectServices);
  const banners = useAppSelector(selectBanners);

  const userName = `${user?.first_name || ""} ${user?.last_name || "Pengguna"}`;
  const userImage = user?.profile_image || "/Profile Photo.png";

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);
  useEffect(() => {
    if (balance === null) {
      dispatch(getBalance());
    }
  }, [dispatch, balance]);
  useEffect(() => {
    if (services.length === 0) {
      dispatch(getServices());
    }
  }, [dispatch, services.length]);
  useEffect(() => {
    if (banners.length === 0) {
      dispatch(getBanners());
    }
  }, [dispatch, banners.length]);

  const handleServiceClick = (service) => {
    alert(
      `Anda mengklik layanan: ${service.service_name}. Lanjutkan ke Pembayaran.`,
    );
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="p-8 text-center mx-auto">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex gap-8 mb-8 justify-between">
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <img
              src={userImage}
              alt="Profile"
              className="w-20 h-20  mb-4 rounded-full object-cover shadow-md border-2 border-gray-200"
            />
            <h1 className="text-xl font-medium text-gray-800 text-center lg:text-left">
              Selamat datang,
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 text-center lg:text-left">
              {userName}
            </h2>
          </div>

          <div className="w-[650px]">
            <BalanceCard
              balance={balance}
              userName={userName}
              showFullName={false}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex gap-4 justify-around">
            {services.map((service) => (
              <ServiceIcon
                key={service.service_code}
                service={service}
                onClick={handleServiceClick}
              />
            ))}
          </div>
        </div>

        <PromoBanner banners={banners} />
      </div>
    </MainLayout>
  );
}
