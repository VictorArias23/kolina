<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\MovimientoInventario;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductoService
{
    // Obtener todos los productos con paginación
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Producto::with(['categoria', 'movimientos'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    // Obtener productos con stock bajo
    public function getStockBajo(): Collection
    {
        return Producto::with('categoria')
            ->stockBajo()
            ->get();
    }

    // Obtener productos sin stock
    public function getSinStock(): Collection
    {
        return Producto::with('categoria')
            ->sinStock()
            ->get();
    }

    // Obtener producto por ID
    public function getById(int $id): Producto
    {
        return Producto::with(['categoria', 'movimientos' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }])->findOrFail($id);
    }

    // Crear producto
    public function create(array $data): Producto
    {
        return DB::transaction(function () use ($data) {
            // Generar código si no viene
            if (!isset($data['codigo'])) {
                $data['codigo'] = $this->generateProductCode();
            }

            // Crear el producto
            $producto = Producto::create($data);

            // Si tiene stock inicial, crear movimiento de entrada
            if (isset($data['stock_inicial']) && $data['stock_inicial'] > 0) {
                $this->registrarMovimiento([
                    'producto_id' => $producto->id,
                    'tipo_movimiento' => 'ENTRADA',
                    'cantidad' => $data['stock_inicial'],
                    'costo_unitario' => $data['precio_compra'],
                    'costo_total' => $data['stock_inicial'] * $data['precio_compra'],
                    'stock_anterior' => 0,
                    'stock_nuevo' => $data['stock_inicial'],
                    'motivo' => 'Inventario inicial',
                    'documento_referencia' => 'INICIAL-' . $producto->codigo,
                ]);
            }

            return $producto;
        });
    }

    // Actualizar producto
    public function update(int $id, array $data): Producto
    {
        $producto = Producto::findOrFail($id);
        $producto->update($data);
        return $producto;
    }

    // Eliminar producto
    public function delete(int $id): bool
    {
        $producto = Producto::findOrFail($id);
        
        // Verificar si tiene movimientos
        if ($producto->movimientos()->count() > 0) {
            throw new \Exception('No se puede eliminar el producto porque tiene movimientos registrados');
        }
        
        return $producto->delete();
    }

    // Ajustar stock
    public function ajustarStock(int $productoId, int $cantidad, string $motivo): Producto
    {
        return DB::transaction(function () use ($productoId, $cantidad, $motivo) {
            $producto = Producto::findOrFail($productoId);
            $stockAnterior = $producto->stock;
            $producto->stock += $cantidad;
            $producto->save();

            $tipoMovimiento = $cantidad > 0 ? 'AJUSTE' : 'AJUSTE';
            $this->registrarMovimiento([
                'producto_id' => $producto->id,
                'tipo_movimiento' => $cantidad > 0 ? 'ENTRADA' : 'SALIDA',
                'cantidad' => abs($cantidad),
                'costo_unitario' => $producto->precio_compra,
                'costo_total' => abs($cantidad) * $producto->precio_compra,
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $producto->stock,
                'motivo' => $motivo,
            ]);

            return $producto;
        });
    }

    // Buscar productos
    public function search(string $search): Collection
    {
        return Producto::with('categoria')
            ->where('nombre', 'LIKE', "%{$search}%")
            ->orWhere('codigo', 'LIKE', "%{$search}%")
            ->orWhere('descripcion', 'LIKE', "%{$search}%")
            ->get();
    }

    // Registrar movimiento de inventario
    private function registrarMovimiento(array $data): MovimientoInventario
    {
        return MovimientoInventario::create($data);
    }

    // Generar código de producto
    private function generateProductCode(): string
    {
        $lastProduct = Producto::orderBy('id', 'desc')->first();
        $number = $lastProduct ? intval(substr($lastProduct->codigo, -6)) + 1 : 1;
        return 'PROD-' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }
}