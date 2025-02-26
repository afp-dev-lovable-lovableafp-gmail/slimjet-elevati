
import type { Meta, StoryObj } from '@storybook/react';
import { ServicesList } from '@/components/admin/services/ServicesList';
import type { Service } from '@/types/service';

const meta = {
  title: 'Admin/ServicesList',
  component: ServicesList,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ServicesList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockServices = [
  {
    id: "1",
    name: "Consultoria de TI",
    description: "Consultoria especializada em tecnologia",
    duration: 60,
    price: 500,
    display_order: 1,
    is_active: true,
    service_tags: [
      {
        tag: {
          id: "1",
          name: "TI",
          status: "active"
        }
      }
    ]
  },
  {
    id: "2",
    name: "Desenvolvimento Web",
    description: "Desenvolvimento de aplicações web",
    duration: 120,
    price: 1000,
    display_order: 2,
    is_active: true,
    service_tags: [
      {
        tag: {
          id: "2",
          name: "Web",
          status: "active"
        }
      }
    ]
  }
];

// Mock handlers para ações de serviço
const mockHandlers = {
  onEdit: (service: Service) => {
    console.log('Edit service:', service);
  },
  onDelete: (service: Service) => {
    console.log('Delete service:', service);
  }
};

export const Default: Story = {
  args: {
    services: mockServices,
    isLoading: false,
    ...mockHandlers
  },
};

export const Loading: Story = {
  args: {
    services: [],
    isLoading: true,
    ...mockHandlers
  },
};

export const Empty: Story = {
  args: {
    services: [],
    isLoading: false,
    ...mockHandlers
  },
};

export const WithError: Story = {
  args: {
    services: [],
    isLoading: false,
    error: new Error("Falha ao carregar serviços"),
    ...mockHandlers
  },
};
