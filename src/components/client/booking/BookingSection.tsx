import { BackButton } from "@/components/ui/back-button";
import AppointmentForm from "./AppointmentForm";

const BookingSection = () => {
  return (
    <div className="flex-grow bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <BackButton />
        </div>
        <AppointmentForm />
      </div>
    </div>
  );
};

export default BookingSection; 