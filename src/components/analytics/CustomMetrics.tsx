
import { useCustomMetrics } from "@/hooks/useCustomMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/analytics/metrics/MetricCard";

const CustomMetrics = () => {
  const { metrics, isLoading } = useCustomMetrics();
  const navigate = useNavigate();
  
  const activeMetrics = metrics?.filter(metric => metric.is_active) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Métricas Personalizadas</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/manager-admin/custom-metrics")}
        >
          Gerenciar
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            {activeMetrics.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    name={metric.name}
                    description={metric.description || ""}
                    value={Math.round(Math.random() * 100)} // Simulação de valor
                    trend={Math.random() > 0.5 ? Math.random() * 15 : -Math.random() * 15} // Simulação de tendência
                    metricType={metric.metric_type}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChartBar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhuma métrica personalizada configurada</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate("/manager-admin/custom-metrics")}
                >
                  Criar nova métrica
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomMetrics;
