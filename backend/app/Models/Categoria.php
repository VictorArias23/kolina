<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model
{
    protected $fillable = [
        'nombre',
        'codigo',
        'descripcion',
        'color',
        'icono',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    // Relación con productos
    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
    }

    // Scope para categorías activas
    public function scopeActivo($query)
    {
        return $query->where('activo', true);
    }
}