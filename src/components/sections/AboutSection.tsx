
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAboutSettings } from "@/hooks/useAboutSettings";
import { Skeleton } from "@/components/ui/skeleton";

const AboutSection = () => {
  const { settings, isLoading } = useAboutSettings();

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            {settings.page_title}
          </h1>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {settings.history_title}
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {settings.history_content}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {settings.mission_title}
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {settings.mission_content}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {settings.values_title}
              </h2>
              <ul className="space-y-2 text-gray-600">
                {settings.values_content.map((value, index) => (
                  <li key={index}>• {value}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
