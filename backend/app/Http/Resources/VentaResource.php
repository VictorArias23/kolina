<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VentaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_factura' => $this->numero_factura,
            'fecha_venta' => $this->fecha_venta->format('Y-m-d H:i:s'),
            'cliente' => [
                'id' => $this->cliente->id,
                'nombre_completo' => $this->cliente->nombre . ' ' . $this->cliente->apellido,
                'documento' => $this->cliente->documento,
            ],
            'subtotal' => number_format($this->subtotal, 2),
            'igv' => number_format($this->igv, 2),
            'descuento' => number_format($this->descuento, 2),
            'total' => number_format($this->total, 2),
            'metodo_pago' => $this->metodo_pago,
            'estado' => $this->estado,
            'observaciones' => $this->observaciones,
            'detalles' => DetalleVentaResource::collection($this->detalles),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}