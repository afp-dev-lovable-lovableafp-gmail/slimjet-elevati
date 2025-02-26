
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomReportsList } from "@/components/admin/custom-reports/CustomReportsList";
import { BackButton } from "@/components/ui/back-button";

const CustomReportsPage = () => {
  return (
    <div className="space-y-6">
      <BackButton />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Relatórios Personalizados</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomReportsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReportsPage;
