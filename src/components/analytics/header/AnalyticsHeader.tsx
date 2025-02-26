
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsHeaderProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export const AnalyticsHeader = ({ dateRange, onDateRangeChange }: AnalyticsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Última Semana</SelectItem>
          <SelectItem value="month">Último Mês</SelectItem>
          <SelectItem value="year">Último Ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
