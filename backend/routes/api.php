<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// -> se agrega nuevo controlador a la API "VENTAS"
use App\Http\Controllers\Api\VentaController;

// se agregan los controladores de la API "INVENTARIO"
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\MovimientoInventarioController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente',
        'project' => 'Kolina'
    ]);
});

// Ejemplo de ruta protegida
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// RUTAS
Route::prefix('v1')->group(function () {
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

