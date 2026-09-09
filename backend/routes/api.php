<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VentaController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\MovimientoInventarioController;
use App\Http\Controllers\Api\ClienteController;

Route::prefix('v1')->group(function () {
    // Clientes
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/clientes/{id}', [ClienteController::class, 'show']);

    // Módulo de Ventas
    Route::apiResource('ventas', VentaController::class);
    Route::patch('ventas/{id}/estado', [VentaController::class, 'cambiarEstado']);

    // Módulo de Inventario - Categorías
    Route::apiResource('categorias', CategoriaController::class);

    // Módulo de Inventario - Productos
    Route::apiResource('productos', ProductoController::class);
    Route::get('productos/stock/bajo', [ProductoController::class, 'stockBajo']);
    Route::get('productos/stock/sin-stock', [ProductoController::class, 'sinStock']);
    Route::get('productos/search', [ProductoController::class, 'search']);
    Route::post('productos/{id}/ajustar-stock', [ProductoController::class, 'ajustarStock']);

    // Módulo de Inventario - Movimientos
    Route::apiResource('movimientos', MovimientoInventarioController::class)->only(['index', 'show', 'store']);
    Route::get('movimientos/resumen', [MovimientoInventarioController::class, 'resumen']);
    Route::get('movimientos/producto/{productoId}', [MovimientoInventarioController::class, 'byProducto']);
    Route::get('movimientos/tipo/{tipo}', [MovimientoInventarioController::class, 'byTipo']);
});