import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { motion } from "framer-motion";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export const TeamMemberCard = ({ member, index }: TeamMemberCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="aspect-square mb-4 overflow-hidden rounded-lg">
            <img
              src={member.photo_url || "https://source.unsplash.com/300x300/?portrait"}
              alt={`${member.first_name} ${member.last_name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold mb-1">
            {`${member.first_name} ${member.middle_name || ''} ${member.last_name}`}
          </h2>
          <p className="text-primary mb-2">{member.position}</p>
          <p className="text-gray-600 mb-4">{member.description}</p>
          {member.linkedin_url && (
            <div className="flex space-x-4">
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
                title={`Perfil do LinkedIn de ${member.first_name} ${member.last_name}`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
