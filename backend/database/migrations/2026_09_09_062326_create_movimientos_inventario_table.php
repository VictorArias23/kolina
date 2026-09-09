<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos');
            $table->enum('tipo_movimiento', ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION', 'TRANSFERENCIA']);
            $table->integer('cantidad');
            $table->decimal('costo_unitario', 10, 2);
            $table->decimal('costo_total', 10, 2);
            $table->integer('stock_anterior');
            $table->integer('stock_nuevo');
            $table->text('motivo')->nullable();
            $table->string('documento_referencia')->nullable();
            $table->foreignId('usuario_id')->nullable()->constrained('users');
            $table->foreignId('venta_id')->nullable()->constrained('ventas')->onDelete('set null');
            $table->foreignId('compra_id')->nullable();
            $table->timestamps();

            // Índices
            $table->index(['producto_id', 'tipo_movimiento']);
            $table->index(['created_at', 'tipo_movimiento']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventario');
    }
};