export interface UnitOptionDto {
  id: number;
  name: string;
  is_active?: boolean;
  isActive?: boolean;
  sort_order?: number;
  sortOrder?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UnitOptionItem {
  id: number;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface UnitOptionPayload {
  name: string;
  is_active: boolean;
  sort_order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function mapUnitOptionDto(dto: UnitOptionDto): UnitOptionItem {
  return {
    id: dto.id,
    name: dto.name || "",
    isActive: dto.isActive ?? dto.is_active ?? true,
    sortOrder: dto.sortOrder ?? dto.sort_order ?? 0,
  };
}
