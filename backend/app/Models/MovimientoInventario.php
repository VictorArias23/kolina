<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoInventario extends Model
{
    protected $table = 'movimientos_inventario';

    protected $fillable = [
        'producto_id',
        'tipo_movimiento',
        'cantidad',
        'costo_unitario',
        'costo_total',
        'stock_anterior',
        'stock_nuevo',
        'motivo',
        'documento_referencia',
        'usuario_id',
        'venta_id',
        'compra_id'
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'costo_unitario' => 'decimal:2',
        'costo_total' => 'decimal:2',
        'stock_anterior' => 'integer',
        'stock_nuevo' => 'integer',
    ];

    // Relaciones
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class);
    }

    // Scopes
    public function scopeEntradas($query)
    {
        return $query->where('tipo_movimiento', 'ENTRADA');
    }

    public function scopeSalidas($query)
    {
        return $query->where('tipo_movimiento', 'SALIDA');
    }

    public function scopeAjustes($query)
    {
        return $query->where('tipo_movimiento', 'AJUSTE');
    }
}