// "use client";

// import useServiceStore from "@/lib/serviceStore";
// import React, { useEffect, useState } from "react";
// import CellAction from "./cellAction";

// const ShowServices: React.FC = () => {
//   const [isMounted, setIsMounted] = useState(false); // added last

//   const { services, fetchServices } = useServiceStore();
//   useEffect(() => {
//     fetchServices();
//     setIsMounted(true); //added last
//   }, [fetchServices]);
//   console.log(services);
//   if (!isMounted) {
//     //added last
//     return null;
//   }
//   return (
//     <div className="service-list bg-slate-100 p-4 rounded-lg">
//       <h2 className="text-2xl font-bold mb-4 text-gray-700">
//         Available {services.length} Services
//       </h2>
//       {services.length > 0 ? (
//         <ul className="w-full  grid grid-cols-1 md:grid-cols-2 gap-4">
//           {services.map((service) => (
//             <li
//               key={service.serviceId}
//               className="w-full md:w-full p-4 bg-white rounded-lg shadow-md relative"
//             >
//               <CellAction className="absolute right-3" data={service} />
//               <h3 className="sm:text-lg text-base text-gray-900 font-semibold">
//                 {service.name}
//               </h3>
//               <p className="text-gray-600 sm:text-base text-sm">
//                 {service.description}
//               </p>
//               <p className="text-gray-600 sm:text-base text-sm">
//                 {service.category.name}
//               </p>
//               <p className="text-gray-800 sm:text-lg text-sm font-bold">
//                 Cena: {service.price} zł.
//               </p>
//               <p className="text-gray-600">Time: {service.duration} min.</p>
//               <p
//                 className={`${
//                   service.active ? "text-green-600" : "text-red-600"
//                 } font-bold`}
//               >
//                 {service.active ? "Active" : "Inactive"}
//               </p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No services available.</p>
//       )}
//     </div>
//   );
// };

// export default ShowServices;
"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState } from "react";
import CellAction from "./cellAction";

const ShowServices: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { services, fetchServices } = useServiceStore();
  useEffect(() => {
    fetchServices();
    setIsMounted(true);
  }, [fetchServices]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="service-list bg-slate-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Available {services.length} Services
      </h2>
      {services.length > 0 ? (
        <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <li
              key={service.serviceId}
              className="w-full p-4 bg-white rounded-lg shadow-md relative"
            >
              <CellAction className="absolute right-3" data={service} />
              <h3 className="sm:text-lg text-base text-gray-900 font-semibold truncate">
                {service.name}
              </h3>
              {service.category ? (
                <p className="text-gray-600 sm:text-base text-sm truncate">
                  Kategoria :{service.category.name}
                </p>
              ) : (
                <p className="text-gray-400 sm:text-base text-sm italic">
                  Без категорії
                </p>
              )}
              <div className="flex justify-between items-center">
                <p className="text-gray-800 sm:text-lg text-sm font-bold">
                  Cena: {service.price} zł.
                </p>
                <p className="text-gray-600">Czas: {service.duration} min.</p>
              </div>
              <p
                className={`${
                  service.active ? "text-green-600" : "text-red-600"
                } font-bold`}
              >
                {service.active ? "Aktywna" : "Nieaktywna"}
              </p>
              <p className="text-gray-600 sm:text-base text-sm ">
                {service.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No services available.</p>
      )}
    </div>
  );
};

export default ShowServices;
