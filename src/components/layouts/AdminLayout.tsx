
import { Helmet } from "@/providers/helmet-provider";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AdminLayout = ({ children, title = "Área Administrativa", description = "Gestão de serviços, time e agendamentos." }: AdminLayoutProps) => {
  const { loading, isAuthenticated, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>ElevaTI - {title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
};

export default AdminLayout;
