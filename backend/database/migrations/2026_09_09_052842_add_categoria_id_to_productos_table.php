<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->foreignId('categoria_id')->nullable()->after('id')
                  ->constrained('categorias')
                  ->onDelete('set null');
            
            // Agregar nuevos campos para mejor control de inventario
            $table->string('unidad_medida')->default('UNIDAD');
            $table->decimal('peso', 10, 2)->nullable();
            $table->decimal('volumen', 10, 2)->nullable();
            $table->string('ubicacion')->nullable(); // Ubicación en almacén
            $table->date('fecha_vencimiento')->nullable();
            $table->string('lote')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropForeign(['categoria_id']);
            $table->dropColumn([
                'categoria_id',
                'unidad_medida',
                'peso',
                'volumen',
                'ubicacion',
                'fecha_vencimiento',
                'lote'
            ]);
        });
    }
};