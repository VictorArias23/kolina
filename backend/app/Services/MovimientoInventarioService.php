<?php

namespace App\Services;

use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class MovimientoInventarioService
{
    // Obtener todos los movimientos
    public function getAll(): Collection
    {
        return MovimientoInventario::with(['producto', 'usuario', 'venta'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Obtener movimientos por producto
    public function getByProducto(int $productoId): Collection
    {
        return MovimientoInventario::with(['producto', 'usuario'])
            ->where('producto_id', $productoId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Obtener movimientos por tipo
    public function getByTipo(string $tipo): Collection
    {
        return MovimientoInventario::with(['producto', 'usuario'])
            ->where('tipo_movimiento', $tipo)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Registrar movimiento
    public function registrarMovimiento(array $data): MovimientoInventario
    {
        return DB::transaction(function () use ($data) {
            $producto = Producto::findOrFail($data['producto_id']);
            
            // Validar stock para salidas
            if (in_array($data['tipo_movimiento'], ['SALIDA', 'TRANSFERENCIA'])) {
                if (!$producto->tieneStockSuficiente($data['cantidad'])) {
                    throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}");
                }
            }

            // Calcular stock anterior y nuevo
            $stockAnterior = $producto->stock;
            $stockNuevo = $stockAnterior + ($data['tipo_movimiento'] === 'ENTRADA' ? $data['cantidad'] : -$data['cantidad']);

            // Crear movimiento
            $movimiento = MovimientoInventario::create([
                'producto_id' => $data['producto_id'],
                'tipo_movimiento' => $data['tipo_movimiento'],
                'cantidad' => $data['cantidad'],
                'costo_unitario' => $data['costo_unitario'] ?? $producto->precio_compra,
                'costo_total' => $data['costo_total'] ?? ($data['cantidad'] * ($data['costo_unitario'] ?? $producto->precio_compra)),
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $stockNuevo,
                'motivo' => $data['motivo'] ?? null,
                'documento_referencia' => $data['documento_referencia'] ?? null,
                'usuario_id' => $data['usuario_id'] ?? null,
                'venta_id' => $data['venta_id'] ?? null,
            ]);

            // Actualizar stock del producto
            $producto->stock = $stockNuevo;
            $producto->save();

            return $movimiento;
        });
    }

    // Obtener resumen de inventario
    public function getResumenInventario(): array
    {
        $totalProductos = Producto::count();
        $stockTotal = Producto::sum('stock');
        $stockBajo = Producto::stockBajo()->count();
        $sinStock = Producto::sinStock()->count();
        $valorInventario = Producto::sum(DB::raw('stock * precio_compra'));

        return [
            'total_productos' => $totalProductos,
            'stock_total' => $stockTotal,
            'stock_bajo' => $stockBajo,
            'sin_stock' => $sinStock,
            'valor_inventario' => number_format($valorInventario, 2),
            'ultimos_movimientos' => $this->getUltimosMovimientos(10),
        ];
    }

    // Obtener últimos movimientos
    public function getUltimosMovimientos(int $limit = 10): Collection
    {
        return MovimientoInventario::with(['producto', 'usuario'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}