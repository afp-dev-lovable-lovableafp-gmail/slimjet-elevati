
import type { Meta, StoryObj } from "@storybook/react";
import { MemberCard } from "@/components/admin/team/MemberCard";
import type { TeamMember } from "@/types/team";

const meta = {
  title: "Admin/Team/MemberCard",
  component: MemberCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MemberCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMember: TeamMember = {
  id: "1",
  first_name: "João",
  last_name: "Silva",
  position: "Desenvolvedor Senior",
  description: "Especialista em React e TypeScript",
  photo_url: "https://via.placeholder.com/150",
  team_member_specialties: [
    {
      id: "1",
      team_member_id: "1",
      specialty_id: "1",
      specialties: {
        id: "1",
        name: "React"
      }
    },
    {
      id: "2",
      team_member_id: "1",
      specialty_id: "2",
      specialties: {
        id: "2",
        name: "TypeScript"
      }
    }
  ]
};

export const Default: Story = {
  args: {
    member: mockMember,
    onEdit: () => console.log("Edit clicked"),
    onDelete: () => console.log("Delete clicked")
  }
};

export const WithoutPhoto: Story = {
  args: {
    member: { ...mockMember, photo_url: undefined },
    onEdit: () => console.log("Edit clicked"),
    onDelete: () => console.log("Delete clicked")
  }
};

export const WithoutSpecialties: Story = {
  args: {
    member: { ...mockMember, team_member_specialties: [] },
    onEdit: () => console.log("Edit clicked"),
    onDelete: () => console.log("Delete clicked")
  }
};
