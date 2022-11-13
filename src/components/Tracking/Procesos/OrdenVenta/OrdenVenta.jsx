import { useState, useEffect } from 'react';
import { Row, Col, Container } from "react-bootstrap"
import {obtenerDatosPedidoVenta} from "../../../../api/pedidoVenta";
import moment from "moment";
import NombreCliente from "../../ListTracking/NombreCliente";
import {map} from "lodash";
import "./OrdenVenta.scss"

function OrdenVenta(props) {
    const { ordenVenta } = props;
    // console.log(ordenVenta)

    // Almacena los datos de la orden de venta
    const [datosOrdenVenta, setDatosOrdenVenta] = useState(null);

    useEffect(() => {
        try{
            obtenerDatosPedidoVenta(ordenVenta).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosOrdenVenta(data)
                /*if(!datosOrdenVenta &&data) {
                    setDatosOrdenVenta(formatModelPedidosventa(data));
                } else {
                    const datosUsuarios = formatModelPedidosventa(data);
                    setDatosOrdenVenta(datosUsuarios);
                }*/
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
                                    Fecha de solicitud: {moment(datosOrdenVenta.fechaElaboracion).format("LL")}
                                </Col>
                                <Col>
                                    Fecha de entrega: {moment(datosOrdenVenta.fechaEntrega).format("LL")}
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
                                            <tr key={datos.item}>
                                                <th>
                                                    {index + 1}
                                                </th>
                                                <td>
                                                    {datos.item}
                                                </td>
                                                <td>
                                                    {datos.cantidad}
                                                </td>
                                                <td>
                                                    {datos.um}
                                                </td>
                                            </tr>
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
