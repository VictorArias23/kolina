<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use App\Models\Producto;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clientes de prueba
        Cliente::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@email.com',
            'telefono' => '987654321',
            'documento' => '12345678',
            'tipo_documento' => 'DNI',
            'direccion' => 'Av. Principal 123',
        ]);

        Cliente::create([
            'nombre' => 'María',
            'apellido' => 'García',
            'email' => 'maria@email.com',
            'telefono' => '987654322',
            'documento' => '87654321',
            'tipo_documento' => 'DNI',
            'direccion' => 'Calle Secundaria 456',
        ]);

        // Productos de prueba
        Producto::create([
            'codigo' => 'PROD001',
            'nombre' => 'Laptop HP',
            'descripcion' => 'Laptop HP Pavilion 15',
            'precio_compra' => 2500,
            'precio_venta' => 3500,
            'stock' => 10,
            'stock_minimo' => 2,
            'categoria' => 'Electrónica',
        ]);

        Producto::create([
            'codigo' => 'PROD002',
            'nombre' => 'Mouse Logitech',
            'descripcion' => 'Mouse inalámbrico Logitech',
            'precio_compra' => 50,
            'precio_venta' => 80,
            'stock' => 25,
            'stock_minimo' => 5,
            'categoria' => 'Accesorios',
        ]);

        Producto::create([
            'codigo' => 'PROD003',
            'nombre' => 'Teclado Mecánico',
            'descripcion' => 'Teclado mecánico RGB',
            'precio_compra' => 120,
            'precio_venta' => 180,
            'stock' => 15,
            'stock_minimo' => 3,
            'categoria' => 'Accesorios',
        ]);
    }
}