<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovimientoInventarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'producto' => new ProductoResource($this->whenLoaded('producto')),
            'tipo_movimiento' => $this->tipo_movimiento,
            'tipo_icono' => $this->getTipoIcono(),
            'cantidad' => $this->cantidad,
            'costo_unitario' => number_format($this->costo_unitario, 2),
            'costo_total' => number_format($this->costo_total, 2),
            'stock_anterior' => $this->stock_anterior,
            'stock_nuevo' => $this->stock_nuevo,
            'motivo' => $this->motivo,
            'documento_referencia' => $this->documento_referencia,
            'usuario' => $this->usuario ? [
                'id' => $this->usuario->id,
                'name' => $this->usuario->name,
            ] : null,
            'venta' => $this->venta ? [
                'id' => $this->venta->id,
                'numero_factura' => $this->venta->numero_factura,
            ] : null,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function getTipoIcono(): string
    {
        return match ($this->tipo_movimiento) {
            'ENTRADA' => '📥',
            'SALIDA' => '📤',
            'AJUSTE' => '🔄',
            'DEVOLUCION' => '↩️',
            'TRANSFERENCIA' => '🚚',
            default => '📊',
        };
    }
}