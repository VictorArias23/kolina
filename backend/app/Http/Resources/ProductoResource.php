<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->codigo,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'categoria' => new CategoriaResource($this->whenLoaded('categoria')),
            'precio_compra' => number_format($this->precio_compra, 2),
            'precio_venta' => number_format($this->precio_venta, 2),
            'stock' => $this->stock,
            'stock_minimo' => $this->stock_minimo,
            'stock_maximo' => $this->stock_maximo,
            'unidad_medida' => $this->unidad_medida,
            'peso' => $this->peso,
            'volumen' => $this->volumen,
            'ubicacion' => $this->ubicacion,
            'fecha_vencimiento' => $this->fecha_vencimiento?->format('Y-m-d'),
            'lote' => $this->lote,
            'activo' => $this->activo,
            'estado_stock' => $this->getEstadoStock(),
            'movimientos' => MovimientoInventarioResource::collection($this->whenLoaded('movimientos')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function getEstadoStock(): string
    {
        if ($this->stock <= 0) return 'SIN_STOCK';
        if ($this->stock <= $this->stock_minimo) return 'STOCK_BAJO';
        return 'STOCK_OK';
    }
}