
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomFieldsList } from "@/components/admin/custom-fields/CustomFieldsList";
import { BackButton } from "@/components/ui/back-button";
import AdminLayout from "@/components/layouts/AdminLayout";

const CustomFieldsPage = () => {
  return (
    <AdminLayout title="Campos Personalizados">
      <div className="space-y-6">
        <BackButton />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Campos Personalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomFieldsList />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CustomFieldsPage;
