<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VentaService;
use App\Http\Resources\VentaResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VentaController extends Controller
{
    protected VentaService $ventaService;

    public function __construct(VentaService $ventaService)
    {
        $this->ventaService = $ventaService;
    }

    public function index(): JsonResponse
    {
        try {
            $ventas = $this->ventaService->getAll();
            return response()->json([
                'success' => true,
                'data' => VentaResource::collection($ventas),
                'message' => 'Ventas obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'cliente_id' => 'required|exists:clientes,id',
                'subtotal' => 'required|numeric|min:0',
                'igv' => 'numeric|min:0',
                'descuento' => 'numeric|min:0',
                'total' => 'required|numeric|min:0',
                'metodo_pago' => 'required|in:EFECTIVO,TARJETA,TRANSFERENCIA',
                'observaciones' => 'nullable|string',
                'detalles' => 'required|array|min:1',
                'detalles.*.producto_id' => 'required|exists:productos,id',
                'detalles.*.cantidad' => 'required|integer|min:1',
                'detalles.*.precio_unitario' => 'required|numeric|min:0',
                'detalles.*.subtotal' => 'required|numeric|min:0',
                'detalles.*.total' => 'required|numeric|min:0',
            ]);

            $venta = $this->ventaService->create($validated);
            return response()->json([
                'success' => true,
                'data' => new VentaResource($venta),
                'message' => 'Venta creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear venta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $venta = $this->ventaService->getById($id);
            return response()->json([
                'success' => true,
                'data' => new VentaResource($venta),
                'message' => 'Venta obtenida exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener venta: ' . $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'metodo_pago' => 'in:EFECTIVO,TARJETA,TRANSFERENCIA',
                'observaciones' => 'nullable|string',
                'estado' => 'in:PENDIENTE,COMPLETADA,CANCELADA',
            ]);

            $venta = $this->ventaService->update($id, $validated);
            return response()->json([
                'success' => true,
                'data' => new VentaResource($venta),
                'message' => 'Venta actualizada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar venta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->ventaService->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'Venta eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar venta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function cambiarEstado(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'estado' => 'required|in:PENDIENTE,COMPLETADA,CANCELADA'
            ]);

            $venta = $this->ventaService->cambiarEstado($id, $validated['estado']);
            return response()->json([
                'success' => true,
                'data' => new VentaResource($venta),
                'message' => 'Estado actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado: ' . $e->getMessage()
            ], 500);
        }
    }
}