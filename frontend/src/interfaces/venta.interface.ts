export interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    documento: string;
    tipo_documento: string;
    nombre_completo?: string;
}

export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    precio_compra: number;
    precio_venta: number;
    stock: number;
    stock_minimo: number;
    categoria?: string;
    activo: boolean;
}

export interface DetalleVenta {
    id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    descuento: number;
    total: number;
    producto?: Producto;
}

export interface Venta {
    id: number;
    numero_factura: string;
    fecha_venta: string;
    cliente_id: number;
    cliente?: Cliente;
    subtotal: number;
    igv: number;
    descuento: number;
    total: number;
    metodo_pago: string;
    estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
    observaciones?: string;
    detalles: DetalleVenta[];
    created_at: string;
    updated_at: string;
}

export interface CreateVentaDTO {
    cliente_id: number;
    subtotal: number;
    igv?: number;
    descuento?: number;
    total: number;
    metodo_pago: string;
    observaciones?: string;
    detalles: Omit<DetalleVenta, 'id' | 'producto'>[];
}

export interface UpdateVentaDTO {
    metodo_pago?: string;
    observaciones?: string;
    estado?: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
}