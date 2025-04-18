import React from "react";
import AddService from "./components/addService";

// import { redirect } from "next/navigation";
import ShowServices from "./components/showServices";

const AddServicePage = async () => {
  //   if (!session?.user) {
  //     redirect("/sign-in");
  //   }
  return (
    <div>
      <AddService />
      <ShowServices />
    </div>
  );
};

export default AddServicePage;
