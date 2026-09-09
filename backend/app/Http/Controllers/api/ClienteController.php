<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $clientes = Cliente::where('activo', true)->get();
            return response()->json([
                'success' => true,
                'data' => $clientes,
                'message' => 'Clientes obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener clientes: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $cliente = Cliente::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $cliente,
                'message' => 'Cliente obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cliente: ' . $e->getMessage()
            ], 404);
        }
    }
}