<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venta extends Model
{
    protected $fillable = [
        'cliente_id',
        'numero_factura',
        'fecha_venta',
        'subtotal',
        'igv',
        'descuento',
        'total',
        'metodo_pago',
        'estado',
        'observaciones'
    ];

    protected $casts = [
        'fecha_venta' => 'date',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'descuento' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleVenta::class);
    }
}