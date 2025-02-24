
import { Loader2 } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { TeamHeader } from "./team/TeamHeader";
import { TeamGrid } from "./team/TeamGrid";

const TeamSection = () => {
  const { members, isLoading } = useTeamMembers();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <TeamHeader 
          title="Nosso Time"
          description="Conheça nossa equipe de especialistas em tecnologia, 
            prontos para ajudar sua empresa a alcançar o próximo nível. 
            Nossos profissionais são dedicados e trabalham diariamente 
            para entregar as melhores soluções em tecnologia."
        />
        <TeamGrid members={members || []} />
      </div>
    </section>
  );
};

export default TeamSection;
