import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const BookingCTA = ({ onBookingClick }: { onBookingClick: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agende sua Consultoria</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Marque uma conversa com nossos especialistas e impulsione seu negócio.
        </p>
        <Button className="mt-4" onClick={onBookingClick}>
          Agendar Agora
        </Button>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bem-vindo(a), {user?.user_metadata?.full_name || "Usuário"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gerencie sua conta e veja seus agendamentos.
          </p>
          <Button className="mt-4" onClick={() => navigate("/perfil")}>
            Editar Perfil
          </Button>
          <Button variant="destructive" className="mt-4 ml-2" onClick={signOut}>
            Sair
          </Button>
        </CardContent>
      </Card>
      
      <BookingCTA onBookingClick={() => navigate("/booking")} />
      
      <Card>
        <CardHeader>
          <CardTitle>Meus Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Acompanhe seus horários e veja o status dos seus agendamentos.
          </p>
          <Button className="mt-4" onClick={() => navigate("/appointments")}>
            Ver Agendamentos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
