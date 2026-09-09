<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VentaController; // -> se agrega nuevo controlador a la API


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

// agregado por controlador VentaController
Route::prefix('v1')->group(function () {
    Route::apiResource('ventas', VentaController::class);
    Route::patch('ventas/{id}/estado', [VentaController::class, 'cambiarEstado']);
});