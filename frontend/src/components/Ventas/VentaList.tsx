import React, { useState, useEffect } from 'react';
import type { Venta } from '../../interfaces/venta.interface';
import { ventasApi } from '../../api/ventasApi';

const VentaList: React.FC = () => {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadVentas();
    }, []);

    const loadVentas = async () => {
        try {
            setLoading(true);
            const data = await ventasApi.getAll();
            setVentas(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las ventas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
            try {
                await ventasApi.delete(id);
                await loadVentas();
            } catch (err) {
                alert('Error al eliminar la venta');
                console.error(err);
            }
        }
    };

    const handleCambiarEstado = async (id: number, estado: string) => {
        try {
            await ventasApi.cambiarEstado(id, estado);
            await loadVentas();
        } catch (err) {
            alert('Error al cambiar el estado');
            console.error(err);
        }
    };

    if (loading) return <div>Cargando ventas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="venta-list">
            <h2>Lista de Ventas</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Factura</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td>{venta.numero_factura}</td>
                            <td>{venta.cliente?.nombre_completo || 'N/A'}</td>
                            <td>S/. {venta.total}</td>
                            <td>
                                <span className={`estado ${venta.estado.toLowerCase()}`}>
                                    {venta.estado}
                                </span>
                            </td>
                            <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleDelete(venta.id)}>Eliminar</button>
                                <button onClick={() => handleCambiarEstado(venta.id, 'COMPLETADA')}>
                                    Completar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VentaList;