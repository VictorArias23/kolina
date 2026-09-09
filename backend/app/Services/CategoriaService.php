<?php

namespace App\Services;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CategoriaService
{
    // Obtener todas las categorías
    public function getAll(): Collection
    {
        return Categoria::with('productos')->get();
    }

    // Obtener categorías activas
    public function getActivas(): Collection
    {
        return Categoria::activo()->with('productos')->get();
    }

    // Obtener por ID
    public function getById(int $id): Categoria
    {
        return Categoria::with('productos')->findOrFail($id);
    }

    // Crear categoría
    public function create(array $data): Categoria
    {
        // Generar código automático si no viene
        if (!isset($data['codigo'])) {
            $data['codigo'] = $this->generateCode();
        }

        return Categoria::create($data);
    }

    // Actualizar categoría
    public function update(int $id, array $data): Categoria
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update($data);
        return $categoria;
    }

    // Eliminar categoría
    public function delete(int $id): bool
    {
        $categoria = Categoria::findOrFail($id);
        
        // Verificar si tiene productos asociados
        if ($categoria->productos()->count() > 0) {
            throw new \Exception('No se puede eliminar la categoría porque tiene productos asociados');
        }
        
        return $categoria->delete();
    }

    // Generar código automático
    private function generateCode(): string
    {
        $lastCategoria = Categoria::orderBy('id', 'desc')->first();
        $number = $lastCategoria ? intval(substr($lastCategoria->codigo, -4)) + 1 : 1;
        return 'CAT-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}