<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $categorias = Categoria::withCount('productos')->get();
            return response()->json([
                'success' => true,
                'data' => $categorias,
                'message' => 'Categorías obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categorías: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $categoria = Categoria::withCount('productos')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $categoria,
                'message' => 'Categoría obtenida exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categoría: ' . $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:100|unique:categorias',
                'codigo' => 'nullable|string|max:20|unique:categorias',
                'descripcion' => 'nullable|string',
                'color' => 'nullable|string|max:7',
                'icono' => 'nullable|string|max:50',
                'activo' => 'boolean',
            ]);

            // Generar código automático si no viene
            if (!isset($validated['codigo'])) {
                $last = Categoria::orderBy('id', 'desc')->first();
                $number = $last ? intval(substr($last->codigo, -4)) + 1 : 1;
                $validated['codigo'] = 'CAT-' . str_pad($number, 4, '0', STR_PAD_LEFT);
            }

            $categoria = Categoria::create($validated);
            return response()->json([
                'success' => true,
                'data' => $categoria,
                'message' => 'Categoría creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:100|unique:categorias,nombre,' . $id,
                'codigo' => 'nullable|string|max:20|unique:categorias,codigo,' . $id,
                'descripcion' => 'nullable|string',
                'color' => 'nullable|string|max:7',
                'icono' => 'nullable|string|max:50',
                'activo' => 'boolean',
            ]);

            $categoria = Categoria::findOrFail($id);
            $categoria->update($validated);
            return response()->json([
                'success' => true,
                'data' => $categoria,
                'message' => 'Categoría actualizada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $categoria = Categoria::findOrFail($id);
            $categoria->delete();
            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar categoría: ' . $e->getMessage()
            ], 500);
        }
    }
}