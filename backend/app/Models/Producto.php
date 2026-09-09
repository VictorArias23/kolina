<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'precio_compra',
        'precio_venta',
        'stock',
        'stock_minimo',
        'stock_maximo',  // Nuevo
        'categoria_id',  // Nuevo
        'unidad_medida', // Nuevo
        'peso',          // Nuevo
        'volumen',       // Nuevo
        'ubicacion',     // Nuevo
        'fecha_vencimiento', // Nuevo
        'lote',          // Nuevo
        'activo'
    ];

    protected $casts = [
        'precio_compra' => 'decimal:2',
        'precio_venta' => 'decimal:2',
        'stock' => 'integer',
        'stock_minimo' => 'integer',
        'stock_maximo' => 'integer',
        'peso' => 'decimal:2',
        'volumen' => 'decimal:2',
        'fecha_vencimiento' => 'date',
        'activo' => 'boolean',
    ];

    // Relaciones
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class);
    }

    public function detallesVenta(): HasMany
    {
        return $this->hasMany(DetalleVenta::class);
    }

    // Scopes
    public function scopeStockBajo($query)
    {
        return $query->where('stock', '<=', 'stock_minimo');
    }

    public function scopeSinStock($query)
    {
        return $query->where('stock', 0);
    }

    public function scopeConStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopePorCategoria($query, $categoriaId)
    {
        return $query->where('categoria_id', $categoriaId);
    }

    // Métodos
    public function tieneStockSuficiente(int $cantidad): bool
    {
        return $this->stock >= $cantidad;
    }

    public function incrementarStock(int $cantidad): void
    {
        $this->stock += $cantidad;
        $this->save();
    }

    public function decrementarStock(int $cantidad): void
    {
        if (!$this->tieneStockSuficiente($cantidad)) {
            throw new \Exception("Stock insuficiente para el producto {$this->nombre}");
        }
        $this->stock -= $cantidad;
        $this->save();
    }

    public function estaEnStockMinimo(): bool
    {
        return $this->stock <= $this->stock_minimo;
    }
}