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
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <ProfileBalance />
      <ServiceIcon services={services} onClick={handleServiceClick} />
      <PromoBanner banners={banners} />
    </div>
  );
}
