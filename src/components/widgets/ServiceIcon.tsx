import type { Service } from "../../features/transactionSlice";

interface ServiceIconProps {
  services: Service[];
  onClick: (service: Service) => void;
}

export default function ServiceIcon({ services, onClick }: ServiceIconProps) {
  return (
    <div className="mt-8">
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-sm p-2 transition hover:bg-gray-100"
            onClick={() => onClick(service)}
            title={service.service_name}
          >
            <img
              src={service.service_icon}
              alt={service.service_name}
              className="item-center h-16 w-16 transform object-cover transition hover:scale-105"
            />
            <span className="text-center text-xs leading-tight text-gray-600">
              {service.service_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
