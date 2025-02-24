
import { motion } from "framer-motion";
import { TeamMemberCard } from "./TeamMemberCard";
import type { TeamMember } from "@/types/team";

interface TeamGridProps {
  members: TeamMember[];
}

export const TeamGrid = ({ members }: TeamGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};
