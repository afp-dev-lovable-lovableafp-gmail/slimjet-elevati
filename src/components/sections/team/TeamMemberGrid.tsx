
import { TeamMemberCard } from "./TeamMemberCard";
import type { TeamMember } from "@/types/team";

interface TeamMemberGridProps {
  members: TeamMember[];
}

export const TeamMemberGrid = ({ members }: TeamMemberGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member, index) => (
        <TeamMemberCard 
          key={member.id} 
          member={member} 
          index={index}
        />
      ))}
    </div>
  );
};
