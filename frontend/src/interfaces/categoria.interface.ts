export interface Categoria {
    id: number;
    nombre: string;
    codigo: string;
    descripcion?: string;
    color: string;
    icono?: string;
    activo: boolean;
    total_productos?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateCategoriaDTO {
    nombre: string;
    codigo?: string;
    descripcion?: string;
    color?: string;
    icono?: string;
    activo?: boolean;
}

export interface UpdateCategoriaDTO extends Partial<CreateCategoriaDTO> {}