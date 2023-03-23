import { useState, useEffect } from 'react';
import { Row, Col, Container, Badge, Table } from "react-bootstrap"
import { obtenerDatosFactura } from "../../../api/facturas";
import moment from "moment";
import { map } from "lodash";
import "./ListProductosFacturas.scss"

function ListProductosFacturas(props) {
    const { folio } = props;
    // console.log(ordenVenta)

    // Almacena los datos de la orden de venta
    const [datosFacturas, setDatosFacturas] = useState(null);

    const cargarDatosFactura = () => {
        try {
            obtenerDatosFactura(folio).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosFacturas(data)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosFactura();
    }, []);


    return (
        <>
            {
                datosFacturas ?
                    (
                        <>
                            <Container fluid className="tablaProductos">
                                <Badge bg="secondary" className="tituloFormularioDetalles">
                                    <h4>Detalles de los productos de la cuenta por cobrar</h4>
                                </Badge>
                                <Table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">Unidad de medida</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosFacturas.productos, (datos, index) => (
                                            <>
                                                {datosFacturas.folio == folio ? (
                                                    <>
                                                        <tr key={datos.item}>
                                                            <td>
                                                                {index + 1}
                                                            </td>
                                                            <td>
                                                                {datos.item}
                                                            </td>
                                                            <td>
                                                                {datos.cantidad}
                                                            </td>
                                                            <td>
                                                                {datos.um}
                                                            </td>
                                                            <td>
                                                                ${''}
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(datos.precioUnitario)} MXN
                                                            </td>
                                                            <td>
                                                                ${''}
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(datos.total)} MXN
                                                            </td>
                                                        </tr>
                                                    </>
                                                ) : (<></>)}
                                            </>
                                        ))}
                                    </tbody>
                                </Table>
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

function formatModelPedidosventa(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaPedido: data.fechaElaboracion,
            fechaEntrega: data.fechaEntrega,
            cliente: data.cliente,
            condicionesPago: data.condicionesPago,
            especificaciones: data.especificaciones,
            incoterms: data.incoterms,
            moneda: data.moneda,
            numeroPedido: data.numeroPedido,
            lugarEntrega: data.lugarEntrega,
            cotizacion: data.cotizacion,
            ordenCompra: data.ordenCompra,
            total: data.total,
            productos: data.productos,
            totalProductos: data.productos.length,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ListProductosFacturas;
