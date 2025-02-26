
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentTemplatesList } from "@/components/admin/document-templates/DocumentTemplatesList";
import { BackButton } from "@/components/ui/back-button";
import AdminLayout from "@/components/layouts/AdminLayout";

const DocumentTemplatesPage = () => {
  return (
    <AdminLayout title="Templates de Documentos">
      <div className="space-y-6">
        <BackButton />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Templates de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentTemplatesList />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DocumentTemplatesPage;
