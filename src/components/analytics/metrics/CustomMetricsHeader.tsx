
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomMetricsHeaderProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  metricTypes: string[];
}

const CustomMetricsHeader = ({ selectedType, setSelectedType, metricTypes }: CustomMetricsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
        Métricas Personalizadas
      </h2>
      <Select
        value={selectedType}
        onValueChange={setSelectedType}
        aria-label="Filtrar por tipo de métrica"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          {metricTypes?.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomMetricsHeader;

