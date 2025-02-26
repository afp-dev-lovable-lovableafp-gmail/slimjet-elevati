
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight } from "lucide-react";
import { useCustomReports } from "@/hooks/useCustomReports";
import { useNavigate } from "react-router-dom";

const CustomReports = () => {
  const { reports, isLoading } = useCustomReports();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  const displayReports = expanded ? reports : reports?.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Relatórios Personalizados</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/manager-admin/custom-reports")}
        >
          Ver todos
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayReports?.map((report) => (
                <Card key={report.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {report.description || "Sem descrição"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {reports?.length > 3 && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Ver menos" : `Ver mais ${reports.length - 3} relatórios`}
              </Button>
            )}

            {reports?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum relatório personalizado encontrado
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomReports;
