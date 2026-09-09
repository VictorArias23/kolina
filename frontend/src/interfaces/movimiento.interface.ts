// Usar type para importar solo tipos
import type { Producto } from './producto.interface';

export interface MovimientoInventario {
    id: number;
    producto_id: number;
    producto?: Producto;
    tipo_movimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'DEVOLUCION' | 'TRANSFERENCIA';
    cantidad: number;
    costo_unitario: number;
    costo_total: number;
    stock_anterior: number;
    stock_nuevo: number;
    motivo?: string;
    documento_referencia?: string;
    usuario_id?: number;
    usuario?: {
        id: number;
        name: string;
    };
    venta_id?: number;
    venta?: {
        id: number;
        numero_factura: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface CreateMovimientoDTO {
    producto_id: number;
    tipo_movimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'DEVOLUCION' | 'TRANSFERENCIA';
    cantidad: number;
    costo_unitario?: number;
    costo_total?: number;
    motivo?: string;
    documento_referencia?: string;
    usuario_id?: number;
    venta_id?: number;
}

export interface ResumenInventario {
    total_productos: number;
    stock_total: number;
    stock_bajo: number;
    sin_stock: number;
    valor_inventario: string;
    ultimos_movimientos: MovimientoInventario[];
}