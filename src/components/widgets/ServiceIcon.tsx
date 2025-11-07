import type { Service } from "../../features/transactionSlice";

interface ServiceIconProps {
  service: Service;
  onClick: (service: Service) => void;
}

export default function ServiceIcon({ service, onClick }: ServiceIconProps) {
  return (
    <div
      className="flex flex-col items-center p-2 gap-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
      onClick={() => onClick(service)}
      title={service.service_name}
    >
      <img
        src={service.service_icon}
        alt={service.service_name}
        className="w-16 h-16 object-cover item-center transition transform hover:scale-105 "
      />
      <span className="text-xs text-center text-gray-600 leading-tight">
        {service.service_name}
      </span>
    </div>
  );
}
