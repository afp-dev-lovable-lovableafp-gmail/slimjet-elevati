
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  name: string;
  description: string;
  value: number;
  trend?: number;
  metricType: string;
}

export const MetricCard = ({ name, description, value, trend, metricType }: MetricCardProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          {trend && (
            <div 
              className={`flex items-center ${
                trend > 0 ? 'text-green-500' : 'text-red-500'
              }`}
              aria-label={`Tendência: ${trend > 0 ? 'positiva' : 'negativa'} ${Math.abs(trend).toFixed(1)}%`}
            >
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold" aria-label={`Valor: ${value.toLocaleString('pt-BR')}`}>
            {value.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Tipo: {metricType}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
