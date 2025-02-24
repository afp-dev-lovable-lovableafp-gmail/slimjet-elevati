import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { useAppointments } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const AVAILABLE_TIMES = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
] as const;

const AppointmentForm = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [notes, setNotes] = useState("");
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: services, isLoading } = useServices();
  const { createAppointment } = useAppointments();

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !serviceId || !user) return;

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours, minutes);

    try {
      await createAppointment({
        user_id: user.id,
        service_id: serviceId,
        scheduled_at: scheduledAt.toISOString(),
        notes: notes || undefined
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Agendar Serviço</CardTitle>
        <CardDescription>
          Escolha o serviço e o horário de sua preferência
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium">
              Serviço
            </label>
            <Select value={serviceId} onValueChange={setServiceId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">
              Horário
            </label>
            <Select value={time} onValueChange={setTime} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TIMES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Observações
            </label>
            <Textarea
              id="notes"
              placeholder="Adicione informações importantes aqui"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Agendar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
