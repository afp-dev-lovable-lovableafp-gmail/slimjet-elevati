
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BackButton } from "@/components/ui/back-button";
import { AnalyticsOverview } from "@/components/analytics/data-display/AnalyticsOverview";
import PredictiveAnalytics from "@/components/analytics/PredictiveAnalytics";
import SatisfactionSurveys from "@/components/analytics/SatisfactionSurveys";
import CustomReports from "@/components/analytics/CustomReports";
import CustomMetrics from "@/components/analytics/CustomMetrics";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("month");
  const analytics = useAnalytics(dateRange);

  return (
    <>
      <Helmet>
        <title>ElevaTI - Analytics</title>
        <meta 
          name="description" 
          content="Analytics e métricas da plataforma ElevaTI" 
        />
      </Helmet>

      <BackButton />

      <div className="p-8 space-y-8">
        <AnalyticsOverview
          analytics={analytics}
          isLoading={analytics.isLoading}
          isError={analytics.isError}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <CustomMetrics />
          <CustomReports />
        </div>

        <PredictiveAnalytics />

        <SatisfactionSurveys feedbacks={analytics.feedbacks || []} />
      </div>
    </>
  );
};

export default Analytics;
