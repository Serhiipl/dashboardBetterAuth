"use client";
import React from "react";
import ServiceForm from "./serviceForm";

import ServiceCategoryForm from "./serviceCategory";

const AddService: React.FC = () => {
  return (
    <div className="w-full bg-slate-100 py-5 px-6 text-zinc-600">
      <p className="text-sm text-zinc-500">Dodaj nową opcje do systemu</p>
      <ServiceCategoryForm
        onSubmit={() => {
          console.log("Form submitted");
        }}
      />
      <ServiceForm />
    </div>
  );
};

export default AddService;
