import React from "react";
import AddService from "./components/addService";

// import { redirect } from "next/navigation";
import ShowServices from "./components/showServices";

const AddServicePage = async () => {
  //   if (!session?.user) {
  //     redirect("/sign-in");
  //   }
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Dodawanie usług</h1>
      <p className="text-muted-foreground">
        Tutaj możesz dodać nową usługę do swojego pulpitu.
      </p>
      <AddService />
      <ShowServices />
    </div>
  );
};

export default AddServicePage;
