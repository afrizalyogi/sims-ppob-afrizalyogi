import { useEffect } from "react";
import { useNavigate } from "react-router";

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
import type { Service } from "../../features/transactionSlice";

import ProfileBalance from "../../components/widgets/ProfileBalance";
import ServiceIcon from "../../components/widgets/ServiceIcon";
import PromoBanner from "../../components/widgets/PromoBanner";

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUserProfile);
  const balance = useAppSelector(selectUserBalance);
  const services = useAppSelector(selectServices);
  const banners = useAppSelector(selectBanners);

  const userName = `${user?.first_name || ""} ${user?.last_name || "Pengguna"}`;
  const userImage =
    user?.profile_image ===
    "https://minio.nutech-integrasi.com/take-home-test/null"
      ? "/Profile Photo.png"
      : user?.profile_image || "/Profile Photo.png";

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

  const handleServiceClick = (service: Service) => {
    navigate(`/transaction/payment/${service.service_code}`);
  };

  if (!user) {
    return <div className="mx-auto p-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <ProfileBalance
        userImage={userImage}
        userName={userName}
        balance={balance}
      />

      <div className="mt-8">
        <div className="flex justify-around gap-4">
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
  );
}
