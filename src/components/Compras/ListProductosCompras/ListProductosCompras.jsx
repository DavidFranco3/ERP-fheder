import { useState, useEffect } from 'react';
import { Row, Col, Container, Badge } from "react-bootstrap"
import { obtenerDatosCompra } from "../../../api/compras";
import moment from "moment";
import { map } from "lodash";
import "./ListProductosCompras.scss"

function ListProductosCompras(props) {
    const { ordenCompra } = props;
    // console.log(ordenVenta)

    // Almacena los datos de la orden de venta
    const [datosOrdenCompra, setDatosOrdenCompra] = useState(null);

    useEffect(() => {
        try {
            obtenerDatosCompra(ordenCompra).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosOrdenCompra(data)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    return (
        <>
            {
                datosOrdenCompra ?
                    (
                        <>
                            <Container fluid className="tablaProductos">
                                <Badge bg="secondary" className="tituloFormularioDetalles">
                                    <h4>Detalles de los productos de la compra</h4>
                                </Badge>
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">UM</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Referencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosOrdenCompra.productos, (productos, index) => (
                                            <>
                                                {datosOrdenCompra.folio == ordenCompra ? (
                                                    <>
                                                        <tr key={index}>
                                                            <td>
                                                                {index + 1}
                                                            </td>
                                                            <td data-title="descripcion">
                                                                {productos.descripcion}
                                                            </td>
                                                            <td data-title="cantidad">
                                                                {productos.cantidad}
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.um}
                                                            </td>
                                                            <td>
                                                                ${''}
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(productos.precio)} MXN
                                                            </td>
                                                            <td>
                                                                ${''}
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(productos.subtotal)} MXN
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.referencia}
                                                            </td>
                                                        </tr>
                                                    </>
                                                ) : (<></>)}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </Container>


                        </>
                    )
                    :
                    (
                        <>
                        </>
                    )
            }
        </>
    );
}

function formatModelCompras(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            proveedor: data.proveedor,
            fechaSolicitud: data.fechaSolicitud,
            fechaEntrega: data.fechaEntrega,
            tipo: data.tipo,
            ordenVenta: data.ordenVenta ? data.ordenVenta : "No aplica",
            diasCredito: data.diasCredito,
            autoriza: data.autoriza,
            productos: data.productos,
            subtotal: data.subtotal,
            iva: data.iva,
            total: data.total,
            estado: data.estado,
            departamento: data.departamento,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ListProductosCompras;
