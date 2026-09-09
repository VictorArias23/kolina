<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductoService;
use App\Http\Resources\ProductoResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    protected ProductoService $productoService;

    public function __construct(ProductoService $productoService)
    {
        $this->productoService = $productoService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);
            $productos = $this->productoService->getAll($perPage);
            return response()->json([
                'success' => true,
                'data' => ProductoResource::collection($productos),
                'meta' => [
                    'current_page' => $productos->currentPage(),
                    'last_page' => $productos->lastPage(),
                    'per_page' => $productos->perPage(),
                    'total' => $productos->total(),
                ],
                'message' => 'Productos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'codigo' => 'nullable|string|max:20|unique:productos',
                'nombre' => 'required|string|max:200',
                'descripcion' => 'nullable|string',
                'categoria_id' => 'nullable|exists:categorias,id',
                'precio_compra' => 'required|numeric|min:0',
                'precio_venta' => 'required|numeric|min:0',
                'stock' => 'integer|min:0',
                'stock_minimo' => 'integer|min:0',
                'stock_maximo' => 'integer|min:0',
                'stock_inicial' => 'integer|min:0',
                'unidad_medida' => 'string|max:50',
                'peso' => 'nullable|numeric|min:0',
                'volumen' => 'nullable|numeric|min:0',
                'ubicacion' => 'nullable|string|max:100',
                'fecha_vencimiento' => 'nullable|date',
                'lote' => 'nullable|string|max:50',
                'activo' => 'boolean',
            ]);

            $producto = $this->productoService->create($validated);
            return response()->json([
                'success' => true,
                'data' => new ProductoResource($producto),
                'message' => 'Producto creado exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $producto = $this->productoService->getById($id);
            return response()->json([
                'success' => true,
                'data' => new ProductoResource($producto),
                'message' => 'Producto obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener producto: ' . $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'codigo' => 'nullable|string|max:20|unique:productos,codigo,' . $id,
                'nombre' => 'required|string|max:200',
                'descripcion' => 'nullable|string',
                'categoria_id' => 'nullable|exists:categorias,id',
                'precio_compra' => 'required|numeric|min:0',
                'precio_venta' => 'required|numeric|min:0',
                'stock' => 'integer|min:0',
                'stock_minimo' => 'integer|min:0',
                'stock_maximo' => 'integer|min:0',
                'unidad_medida' => 'string|max:50',
                'peso' => 'nullable|numeric|min:0',
                'volumen' => 'nullable|numeric|min:0',
                'ubicacion' => 'nullable|string|max:100',
                'fecha_vencimiento' => 'nullable|date',
                'lote' => 'nullable|string|max:50',
                'activo' => 'boolean',
            ]);

            $producto = $this->productoService->update($id, $validated);
            return response()->json([
                'success' => true,
                'data' => new ProductoResource($producto),
                'message' => 'Producto actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->productoService->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    // Métodos adicionales
    public function stockBajo(): JsonResponse
    {
        try {
            $productos = $this->productoService->getStockBajo();
            return response()->json([
                'success' => true,
                'data' => ProductoResource::collection($productos),
                'message' => 'Productos con stock bajo'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos con stock bajo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sinStock(): JsonResponse
    {
        try {
            $productos = $this->productoService->getSinStock();
            return response()->json([
                'success' => true,
                'data' => ProductoResource::collection($productos),
                'message' => 'Productos sin stock'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos sin stock: ' . $e->getMessage()
            ], 500);
        }
    }

    public function ajustarStock(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'cantidad' => 'required|integer|not_in:0',
                'motivo' => 'required|string|max:255',
            ]);

            $producto = $this->productoService->ajustarStock($id, $validated['cantidad'], $validated['motivo']);
            return response()->json([
                'success' => true,
                'data' => new ProductoResource($producto),
                'message' => 'Stock ajustado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al ajustar stock: ' . $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'q' => 'required|string|min:2',
            ]);

            $productos = $this->productoService->search($validated['q']);
            return response()->json([
                'success' => true,
                'data' => ProductoResource::collection($productos),
                'message' => 'Resultados de búsqueda'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ], 500);
        }
    }
}