
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { MetricTrend } from "@/types/analytics";

interface MetricsCardProps {
  title: string;
  value: string | number;
  trend?: MetricTrend;
  description?: string;
}

const MetricsCard = ({ title, value, trend, description }: MetricsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
          {trend && trend !== "neutral" && (
            <div className={`flex items-center ${trend === "up" ? 'text-green-500' : 'text-red-500'}`}>
              {trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="ml-1 text-sm">{Math.abs(Number(value))}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
