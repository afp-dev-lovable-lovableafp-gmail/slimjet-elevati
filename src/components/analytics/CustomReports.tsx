
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface CustomReport {
  id: string;
  name: string;
  description: string | null;
  report_config: any;
  created_at: string;
}

const CustomReports = () => {
  const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  // Redirect if not admin
  if (!profile?.is_admin) {
    return <Navigate to="/" />;
  }

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['custom-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar relatórios",
          description: "Houve um problema ao carregar os relatórios personalizados."
        });
        throw error;
      }

      return data as CustomReport[];
    },
  });

  const renderReportContent = (report: CustomReport) => {
    return (
      <div className="space-y-4 animate-fade-in">
        <p className="text-sm text-muted-foreground">
          {report.description || "Sem descrição disponível"}
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          {JSON.stringify(report.report_config, null, 2)}
        </pre>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">Carregando relatórios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500" role="alert">
            Erro ao carregar relatórios. Por favor, tente novamente mais tarde.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          <FileText className="h-6 w-6" />
          Relatórios Customizados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports?.map((report) => (
            <Card 
              key={report.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800"
              onClick={() => setSelectedReport(
                selectedReport?.id === report.id ? null : report
              )}
              tabIndex={0}
              role="button"
              aria-expanded={selectedReport?.id === report.id}
              aria-controls={`report-content-${report.id}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedReport(selectedReport?.id === report.id ? null : report);
                }
              }}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{report.name}</h3>
                <div
                  id={`report-content-${report.id}`}
                  className={selectedReport?.id === report.id ? 'block' : 'hidden'}
                >
                  {selectedReport?.id === report.id && renderReportContent(report)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {reports?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum relatório personalizado encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomReports;

