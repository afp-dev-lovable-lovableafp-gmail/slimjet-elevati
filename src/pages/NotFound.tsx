
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotFoundSection from "@/components/sections/NotFoundSection";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>ElevaTI - Página não encontrada</title>
        <meta name="description" content="A página que você está procurando não foi encontrada." />
      </Helmet>
      <NotFoundSection />
    </>
  );
};

export default NotFound;
