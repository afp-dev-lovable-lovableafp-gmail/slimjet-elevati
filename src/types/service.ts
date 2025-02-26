
/**
 * Representa um serviço no sistema
 */
export interface Service {
  /** Identificador único do serviço */
  id: string;
  
  /** Nome do serviço */
  name: string;
  
  /** Descrição detalhada do serviço (opcional) */
  description?: string | null;
  
  /** Duração do serviço em minutos */
  duration: number;
  
  /** Preço do serviço em reais */
  price: number;
  
  /** Ordem de exibição do serviço na listagem */
  display_order: number;
  
  /** Indica se o serviço está ativo */
  is_active?: boolean;
  
  /** Data de criação do registro */
  created_at?: string | null;
  
  /** Data da última atualização do registro */
  updated_at?: string | null;
}

/**
 * Interface para operações com serviços
 */
export interface ServiceOperations {
  // Estado do diálogo
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;

  // Estado do serviço selecionado
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;

  // Operações
  handleCreateOrUpdate: (service: Partial<Service>) => Promise<boolean>;
  handleDelete: (serviceId: string) => Promise<boolean>;
  toggleStatus: (service: Service) => Promise<void>;
}

/**
 * DTO para criação de um novo serviço
 */
export interface CreateServiceDTO extends Omit<Service, 'id' | 'created_at' | 'updated_at'> {
  /** Nome do serviço (obrigatório) */
  name: string;
  
  /** Duração do serviço em minutos (obrigatório) */
  duration: number;
  
  /** Preço do serviço em reais (obrigatório) */
  price: number;
  
  /** Ordem de exibição do serviço (obrigatório) */
  display_order: number;
}

/**
 * DTO para atualização de um serviço existente
 */
export interface UpdateServiceDTO extends Partial<CreateServiceDTO> {
  /** Identificador único do serviço a ser atualizado */
  id: string;
}

/**
 * Interface para representar a relação entre serviços e tags
 */
export interface ServiceTag {
  /** ID do serviço */
  service_id: string;
  
  /** ID da tag */
  tag_id: string;
}
