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
               