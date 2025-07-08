import { ServiceProps } from "@/lib/serviceStore";
import CellAction from "../app/(auth)/admin/dashboard/services/components/cellAction";
import Image from "next/image";
import { useIsAdmin } from "@/hooks/user-role";
// import ServiceModal from "./ServiceModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ServiceModalPopup from "./modals/serviceModalPopup";

const ShownCellAction: React.FC<{ data: ServiceProps; className?: string }> = ({
  data,
  className,
}) => {
  const isAdmin = useIsAdmin();
  if (!isAdmin) {
    return null;
  }

  return <CellAction data={data} className={className} />;
};
// Компонент для відображення статусу послуги
const ServiceStatus: React.FC<{ active: boolean }> = ({ active }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    <span
      className={`w-2 h-2 rounded-full mr-1 ${
        active ? "bg-green-400" : "bg-red-400"
      }`}
    />
    {active ? "Aktywna" : "Nieaktywna"}
  </span>
);

const ServiceCard: React.FC<{
  service: ServiceProps;
  categoryName?: string;
}> = ({ service, categoryName }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (isMobile) {
      router.push(`/services/${service.serviceId}`);
    } else {
      setShowModal(true);
    }
  };
  return (
    <>
      <li
        onClick={handleClick}
        className="group bg-white  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      >
        <div className="p-4 relative">
          {/* <CellAction */}
          <ShownCellAction
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            data={service}
          />
          <div className="mb-4 pr-5 w-full flex flex-row justify-between space-y-2">
            {/* Заголовок */}
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate ">
                {service.name}
              </h3>
              <p className="bg-cyan-50 text-indigo-800 text-sm max-w-fit  rounded-full mt-1">
                {categoryName || (
                  <span className="italic text-gray-400">Brak kategorii</span>
                )}
              </p>
            </div>
            {/* Зображення послуги */}
            {service.images.length > 0 && (
              <div
                className="mb-3 mr-6 overflow-hidden rounded-lg aspect-square  h-10 object-cover
            group-hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={service.images[0].url}
                  alt={service.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
          </div>
          {/* Основна інформація */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-4">
              <p className="text-sm font-normal text-slate-950">
                Cena: <span className="font-bold">{service.price}</span> zł
              </p>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {service.duration} min
              </span>
            </div>
            <ServiceStatus active={service.active} />
          </div>

          {/* Опис */}
          {service.description && (
            <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed">
              {service.description}
            </p>
          )}
        </div>
      </li>
      {/* Pop-up для десктопу */}
      {!isMobile && showModal && (
        <ServiceModalPopup
          service={service}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
export default ServiceCard;
