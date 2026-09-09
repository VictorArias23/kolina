<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MovimientoInventarioService;
use App\Http\Resources\MovimientoInventarioResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MovimientoInventarioController extends Controller
{
    protected MovimientoInventarioService $movimientoService;

    public function __construct(MovimientoInventarioService $movimientoService)
    {
        $this->movimientoService = $movimientoService;
    }

    public function index(): JsonResponse
    {
        try {
            $movimientos = $this->movimientoService->getAll();
            return response()->json([
                'success' => true,
                'data' => MovimientoInventarioResource::collection($movimientos),
                'message' => 'Movimientos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'producto_id' => 'required|exists:productos,id',
                'tipo_movimiento' => 'required|in:ENTRADA,SALIDA,AJUSTE,DEVOLUCION,TRANSFERENCIA',
                'cantidad' => 'required|integer|min:1',
                'costo_unitario' => 'nullable|numeric|min:0',
                'costo_total' => 'nullable|numeric|min:0',
                'motivo' => 'nullable|string|max:255',
                'documento_referencia' => 'nullable|string|max:100',
                'usuario_id' => 'nullable|exists:users,id',
                'venta_id' => 'nullable|exists:ventas,id',
            ]);

            // Si es SALIDA, el usuario debe tener permisos
            if ($validated['tipo_movimiento'] === 'SALIDA' && !$request->user()->can('crear_ventas')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para realizar salidas de inventario'
                ], 403);
            }

            $movimiento = $this->movimientoService->registrarMovimiento($validated);
            return response()->json([
                'success' => true,
                'data' => new MovimientoInventarioResource($movimiento),
                'message' => 'Movimiento registrado exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar movimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $movimiento = $this->movimientoService->getById($id);
            return response()->json([
                'success' => true,
                'data' => new MovimientoInventarioResource($movimiento),
                'message' => 'Movimiento obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimiento: ' . $e->getMessage()
            ], 404);
        }
    }

    public function resumen(): JsonResponse
    {
        try {
            $resumen = $this->movimientoService->getResumenInventario();
            return response()->json([
                'success' => true,
                'data' => $resumen,
                'message' => 'Resumen de inventario obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen: ' . $e->getMessage()
            ], 500);
        }
    }

    public function byProducto($productoId): JsonResponse
    {
        try {
            $movimientos = $this->movimientoService->getByProducto($productoId);
            return response()->json([
                'success' => true,
                'data' => MovimientoInventarioResource::collection($movimientos),
                'message' => 'Movimientos del producto obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos del producto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function byTipo($tipo): JsonResponse
    {
        try {
            $movimientos = $this->movimientoService->getByTipo($tipo);
            return response()->json([
                'success' => true,
                'data' => MovimientoInventarioResource::collection($movimientos),
                'message' => 'Movimientos por tipo obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos por tipo: ' . $e->getMessage()
            ], 500);
        }
    }
}