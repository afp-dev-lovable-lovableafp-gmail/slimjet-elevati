import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import ClientNavbar from "./ClientNavbar";
import ClientFooter from "./ClientFooter";

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientNavbar />
      <main className="flex-grow pt-16">
        <Suspense fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <ClientFooter />
    </div>
  );
};

export default ClientLayout; 