
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomMetricsList } from "@/components/admin/custom-metrics/CustomMetricsList";
import { BackButton } from "@/components/ui/back-button";

const CustomMetricsPage = () => {
  return (
    <div className="space-y-6">
      <BackButton />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Métricas Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomMetricsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomMetricsPage;
