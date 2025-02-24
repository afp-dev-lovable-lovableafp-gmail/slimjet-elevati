
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import type { TeamMember } from "@/types/team";

interface MemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

export const MemberCard = ({ member, onEdit, onDelete }: MemberCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="aspect-square w-24 mb-4 overflow-hidden rounded-lg">
            <img
              src={member.photo_url || "https://via.placeholder.com/150"}
              alt={member.first_name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold">
            {`${member.first_name} ${member.middle_name || ''} ${member.last_name}`}
          </h3>
          <p className="text-sm text-primary">{member.position}</p>
          <p className="text-sm text-gray-600 mt-2">{member.description}</p>
          {member.team_member_specialties?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Especialidades:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {member.team_member_specialties.map((spec) => (
                  <span
                    key={spec.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {spec.specialties.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(member)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(member)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
