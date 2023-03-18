import { useState, useEffect } from 'react';
import { Row, Col, Container } from "react-bootstrap"
import { obtenerDatosPedidoVenta } from "../../../../api/pedidoVenta";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import NombreCliente from "../../ListTracking/NombreCliente";
import { map } from "lodash";
import "./OrdenVenta.scss"

function OrdenVenta(props) {
    const { ordenVenta } = props;
    // console.log(ordenVenta)

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Almacena los datos de la orden de venta
    const [datosOrdenVenta, setDatosOrdenVenta] = useState(null);

    const cargarDatosOV = () => {
        try {
            obtenerDatosPedidoVenta(ordenVenta).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosOrdenVenta(data);
            }).catch(e => {
                console.log(e);
            })
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        cargarDatosOV();
    }, []);

    return (
        <>
            {
                datosOrdenVenta ?
                    (
                        <>
                            <Row>
                                <Col>
                                    Pedido de venta: {datosOrdenVenta.folio}
                                </Col>
                                <Col>
                                    Cliente: <NombreCliente folio={datosOrdenVenta.cliente} />
                                </Col>
                                <Col>
                                    Fecha de solicitud: {dayjs(datosOrdenVenta.fechaElaboracion).format("LL")}
                                </Col>
                                <Col>
                                    Fecha de entrega: {dayjs(datosOrdenVenta.fechaEntrega).format("LL")}
                                </Col>
                                <Col>
                                    Productos a elaborar: {datosOrdenVenta.productos.length}
                                </Col>
                                <Col>
                                    Total: {(
                                        <>
                                            ${''}
                                            {new Intl.NumberFormat('es-MX', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(datosOrdenVenta.total)} MXN
                                        </>
                                    )}
                                </Col>
                            </Row>

                            <Container fluid className="tablaProductos">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Productos</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">Unidad de medida</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosOrdenVenta.productos, (datos, index) => (
                                            <>
                                                {datosOrdenVenta.folio == ordenVenta ? (
                                                    <>
                                                        <tr key={datos.item}>
                                                            <td>
                                                                {index + 1}
                                                            </td>
                                                            <td>
                                                                {datos.descripcion}
                                                            </td>
                                                            <td>
                                                                {datos.cantidad}
                                                            </td>
                                                            <td>
                                                                {datos.um}
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

export default OrdenVenta;
