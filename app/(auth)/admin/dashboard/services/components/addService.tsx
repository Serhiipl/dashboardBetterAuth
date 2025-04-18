"use client";
import React from "react";
import ServiceForm from "./serviceForm";

import ServiceCategoryForm from "./serviceCategory";

const AddService: React.FC = () => {
  return (
    <div className="w-full bg-slate-100 py-5 px-6 text-zinc-600">
      <h1 className="text-2xl my-4 font-sans">Usługi</h1>
      <p className="text-sm text-zinc-500">Dodaj nową usługę do systemu</p>
      <div className="flex flex-col items-center justify-center gap-2 my-4 w-full">
        <span className="text-sm text-zinc-500">Typ usługi:</span>
        <h2>Opcja usługi</h2>
        <ServiceCategoryForm
          onSubmit={() => {
            console.log("Form submitted");
          }}
        />
      </div>
      <div>
        <h2 className="text-2xl my-4 font-sans">Dodaj nową usługe</h2>
        <ServiceForm />
      </div>
    </div>
  );
};

export default AddService;
