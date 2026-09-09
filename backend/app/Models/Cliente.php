<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'telefono',
        'direccion',
        'documento',
        'tipo_documento',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class);
    }
}