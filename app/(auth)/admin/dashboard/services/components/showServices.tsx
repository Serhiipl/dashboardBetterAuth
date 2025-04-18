"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState } from "react";
import CellAction from "./cellAction";

const ShowServices: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false); // added last
  // const [key] = useState(0);

  const { services, fetchServices } = useServiceStore();
  useEffect(() => {
    fetchServices();
    setIsMounted(true); //added last
  }, [fetchServices]);

  if (!isMounted) {
    //added last
    return null;
  }
  return (
    <div className="service-list bg-slate-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Available {services.length} Services
      </h2>
      {services.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <li
              key={service.serviceId}
              className="service-item p-4 bg-white rounded-lg shadow-md relative"
            >
              <CellAction className="absolute right-3" data={service} />
              <h3 className="sm:text-lg text-base text-gray-900 font-semibold">
                {service.name}
              </h3>
              <p className="text-gray-600 sm:text-base text-sm">
                {service.description}
              </p>
              <p className="text-gray-800 sm:text-lg text-sm font-bold">
                Cena: {service.price} zł.
              </p>
              <p className="text-gray-600">Time: {service.duration} min.</p>
              <p
                className={`${
                  service.active ? "text-green-600" : "text-red-600"
                } font-bold`}
              >
                {service.active ? "Active" : "Inactive"}
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
