
export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  report_config: {
    columns: string[];
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    groupBy?: string[];
    filters?: {
      field: string;
      operator: string;
      value: string | number | string[] | number[];
    }[];
  };
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateCustomReportDTO = Omit<CustomReport, 'id' | 'is_active' | 'created_by' | 'created_at' | 'updated_at'>;
