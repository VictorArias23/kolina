<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\MovimientoInventario;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear Categorías
        $categorias = [
            [
                'nombre' => 'Electrónicos',
                'codigo' => 'CAT-0001',
                'descripcion' => 'Productos electrónicos y tecnología',
                'color' => '#3490dc',
                'icono' => 'fa-laptop'
            ],
            [
                'nombre' => 'Ropa',
                'codigo' => 'CAT-0002',
                'descripcion' => 'Prendas de vestir',
                'color' => '#e74c3c',
                'icono' => 'fa-tshirt'
            ],
            [
                'nombre' => 'Alimentos',
                'codigo' => 'CAT-0003',
                'descripcion' => 'Productos alimenticios',
                'color' => '#2ecc71',
                'icono' => 'fa-apple-alt'
            ]
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }

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
        $productos = [
            [
                'codigo' => 'PROD-000001',
                'nombre' => 'Laptop HP Pavilion',
                'descripcion' => 'Laptop HP Pavilion 15 con 16GB RAM',
                'categoria_id' => 1,
                'precio_compra' => 2500.00,
                'precio_venta' => 3500.00,
                'stock' => 10,
                'stock_minimo' => 2,
                'stock_maximo' => 20,
                'unidad_medida' => 'UNIDAD',
                'ubicacion' => 'A-1-01',
            ],
            [
                'codigo' => 'PROD-000002',
                'nombre' => 'Mouse Logitech',
                'descripcion' => 'Mouse inalámbrico Logitech Mx Master',
                'categoria_id' => 1,
                'precio_compra' => 50.00,
                'precio_venta' => 80.00,
                'stock' => 25,
                'stock_minimo' => 5,
                'stock_maximo' => 50,
                'unidad_medida' => 'UNIDAD',
                'ubicacion' => 'A-2-03',
            ],
            [
                'codigo' => 'PROD-000003',
                'nombre' => 'Camisa Casual',
                'descripcion' => 'Camisa de algodón para hombre',
                'categoria_id' => 2,
                'precio_compra' => 30.00,
                'precio_venta' => 60.00,
                'stock' => 15,
                'stock_minimo' => 3,
                'stock_maximo' => 30,
                'unidad_medida' => 'UNIDAD',
                'ubicacion' => 'B-1-02',
            ]
        ];

        foreach ($productos as $productoData) {
            $producto = Producto::create($productoData);
            
            // Crear movimiento inicial
            MovimientoInventario::create([
                'producto_id' => $producto->id,
                'tipo_movimiento' => 'ENTRADA',
                'cantidad' => $producto->stock,
                'costo_unitario' => $producto->precio_compra,
                'costo_total' => $producto->stock * $producto->precio_compra,
                'stock_anterior' => 0,
                'stock_nuevo' => $producto->stock,
                'motivo' => 'Inventario inicial',
                'documento_referencia' => 'INICIAL-' . $producto->codigo,
            ]);
        }
    }
}