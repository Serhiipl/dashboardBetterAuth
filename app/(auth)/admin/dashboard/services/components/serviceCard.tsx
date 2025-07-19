import { ServiceProps } from "@/lib/serviceStore";
import CellAction from "./cellAction";

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
}> = ({ service, categoryName }) => (
  <li className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
    <div className="p-4 relative">
      <CellAction
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        data={service}
      />

      {/* Заголовок */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">
          {service.name}
        </h3>
        <p className="bg-cyan-50 text-indigo-800 text-sm max-w-fit px-4 rounded-full mt-1">
          {categoryName || (
            <span className="italic text-gray-400">Brak kategorii</span>
          )}
        </p>
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
);
export default ServiceCard;
