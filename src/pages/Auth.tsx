
import { Helmet } from "react-helmet";
import AuthSection from "@/components/sections/AuthSection";

const Auth = () => {
  return (
    <>
      <Helmet>
        <title>ElevaTI - Acesso</title>
        <meta name="description" content="Acesse sua conta na ElevaTI ou crie uma nova conta." />
      </Helmet>
      <AuthSection />
    </>
  );
};

export default Auth;
