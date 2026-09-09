<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CategoriaService;
use App\Http\Resources\CategoriaResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaController extends Controller
{
    protected CategoriaService $categoriaService;

    public function __construct(CategoriaService $categoriaService)
    {
        $this->categoriaService = $categoriaService;
    }

    public function index(): JsonResponse
    {
        try {
            $categorias = $this->categoriaService->getAll();
            return response()->json([
                'success' => true,
                'data' => CategoriaResource::collection($categorias),
                'message' => 'Categorías obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categorías: ' . $e->getMessage()
            ], 500);
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

            $categoria = $this->categoriaService->create($validated);
            return response()->json([
                'success' => true,
                'data' => new CategoriaResource($categoria),
                'message' => 'Categoría creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $categoria = $this->categoriaService->getById($id);
            return response()->json([
                'success' => true,
                'data' => new CategoriaResource($categoria),
                'message' => 'Categoría obtenida exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categoría: ' . $e->getMessage()
            ], 404);
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

            $categoria = $this->categoriaService->update($id, $validated);
            return response()->json([
                'success' => true,
                'data' => new CategoriaResource($categoria),
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
            $this->categoriaService->delete($id);
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