
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
