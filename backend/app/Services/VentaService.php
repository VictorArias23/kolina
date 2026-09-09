<?php

namespace App\Services;

use App\Models\Venta;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\DetalleVenta;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class VentaService
{
    public function getAll(): Collection
    {
        return Venta::with(['cliente', 'detalles.producto'])->get();
    }

    public function getById(int $id): Venta
    {
        return Venta::with(['cliente', 'detalles.producto'])->findOrFail($id);
    }

    public function create(array $data): Venta
    {
        return DB::transaction(function () use ($data) {
            // Crear la venta
            $venta = Venta::create([
                'cliente_id' => $data['cliente_id'],
                'numero_factura' => $this->generateInvoiceNumber(),
                'fecha_venta' => now(),
                'subtotal' => $data['subtotal'],
                'igv' => $data['igv'] ?? 0,
                'descuento' => $data['descuento'] ?? 0,
                'total' => $data['total'],
                'metodo_pago' => $data['metodo_pago'],
                'estado' => 'COMPLETADA',
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            // Crear detalles y actualizar stock
            foreach ($data['detalles'] as $detalle) {
                $producto = Producto::findOrFail($detalle['producto_id']);
                
                // Validar stock
                if ($producto->stock < $detalle['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}");
                }

                // Crear detalle
                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal' => $detalle['subtotal'],
                    'descuento' => $detalle['descuento'] ?? 0,
                    'total' => $detalle['total'],
                ]);

                // Actualizar stock
                $producto->stock -= $detalle['cantidad'];
                $producto->save();
            }

            return $venta->load(['cliente', 'detalles.producto']);
        });
    }

    public function update(int $id, array $data): Venta
    {
        $venta = Venta::findOrFail($id);
        $venta->update($data);
        return $venta->load(['cliente', 'detalles.producto']);
    }

    public function delete(int $id): bool
    {
        $venta = Venta::findOrFail($id);
        return $venta->delete();
    }

    public function cambiarEstado(int $id, string $estado): Venta
    {
        $venta = Venta::findOrFail($id);
        $venta->estado = $estado;
        $venta->save();
        return $venta;
    }

    private function generateInvoiceNumber(): string
    {
        $lastVenta = Venta::orderBy('id', 'desc')->first();
        $number = $lastVenta ? intval(substr($lastVenta->numero_factura, -8)) + 1 : 1;
        return 'FAC-' . str_pad($number, 8, '0', STR_PAD_LEFT);
    }
}