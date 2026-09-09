// Asegurar que todas las interfaces estén exportadas
export interface Categoria {
    id: number;
    nombre: string;
    codigo: string;
}

export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoria_id?: number;
    categoria?: Categoria;
    precio_compra: number;
    precio_venta: number;
    stock: number;
    stock_minimo: number;
    stock_maximo: number;
    unidad_medida: string;
    peso?: number;
    volumen?: number;
    ubicacion?: string;
    fecha_vencimiento?: string;
    lote?: string;
    activo: boolean;
    estado_stock: 'SIN_STOCK' | 'STOCK_BAJO' | 'STOCK_OK';
    created_at?: string;
    updated_at?: string;
}

export interface CreateProductoDTO {
    codigo?: string;
    nombre: string;
    descripcion?: string;
    categoria_id?: number;
    precio_compra: number;
    precio_venta: number;
    stock?: number;
    stock_inicial?: number;
    stock_minimo?: number;
    stock_maximo?: number;
    unidad_medida?: string;
    peso?: number;
    volumen?: number;
    ubicacion?: string;
    fecha_vencimiento?: string;
    lote?: string;
    activo?: boolean;
}

export interface UpdateProductoDTO extends Partial<CreateProductoDTO> {}

export interface ProductoFilters {
    search?: string;
    categoria_id?: number;
    activo?: boolean;
    stock_bajo?: boolean;
    sin_stock?: boolean;
}