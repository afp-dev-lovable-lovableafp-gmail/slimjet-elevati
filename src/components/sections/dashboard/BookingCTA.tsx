
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface BookingCTAProps {
  onBookNow: () => void;
}

export const BookingCTA = ({ onBookNow }: BookingCTAProps) => {
  return (
    <Card className="mt-8 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Agende uma Reunião
          </h2>
          <p className="text-blue-100">
            Converse com nossos especialistas e descubra como podemos ajudar seu negócio
          </p>
        </div>
        <Button
          onClick={onBookNow}
          variant="secondary"
          size="lg"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Agendar Agora
        </Button>
      </div>
    </Card>
  );
};
