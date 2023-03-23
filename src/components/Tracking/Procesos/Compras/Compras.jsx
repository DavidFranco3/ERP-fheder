import { useState, useEffect, Suspense } from 'react';
import { Row, Col, Container, Spinner, Badge, Table } from "react-bootstrap"
import { map } from "lodash";
import { withRouter } from "../../../../utils/withRouter";
import "./Compras.scss"
import { listarOrdenesCompra } from "../../../../api/compras";
import { listarRequisiciones } from "../../../../api/requisicion";
import moment from "moment";
import Proveedor from "../../../Compras/ListCompras/ProveedoresenCompras";
import { getSucursal } from '../../../../api/auth';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function Compras(props) {
    const { ordenVenta, location, history } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para almacenar la lista completa de clientes
    const [listRequisicion, setListRequisicion] = useState(null);

    const cargarListaRequisiciones = () => {
        try {
            listarRequisiciones(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listRequisicion && data) {
                    setListRequisicion(formatModelRequisicion(data));
                } else {
                    const datosRequisicion = formatModelRequisicion(data);
                    setListRequisicion(datosRequisicion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    // Obtener los clientes registrados
    useEffect(() => {
       cargarListaRequisiciones();
    }, []);

    // Para almacenar la lista completa de clientes
    const [listCompras, setListCompras] = useState(null);

    const cargarListaCompras = () => {
        try {
            listarOrdenesCompra().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listCompras && data) {
                    setListCompras(formatModelCompras(data));
                } else {
                    const datosCompras = formatModelCompras(data);
                    setListCompras(datosCompras);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    // Obtener los clientes registrados
    useEffect(() => {
        cargarListaCompras();
    }, []);

    return (
        <>
            {
                listRequisicion ?
                    (
                        <>
                            <Row>
                                <Col>
                                    Pedido de venta: {ordenVenta}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Informacion general de las requisiciones</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <Table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Folio</th>
                                            <th scope="col">Fecha elaboración</th>
                                            <th scope="col">Solicitante</th>
                                            <th scope="col">Departamento</th>
                                            <th scope="col">Aprobo</th>
                                            <th scope="col">Comentarios</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listRequisicion, (requisicion, index) => (
                                            <>
                                                {map(requisicion.productosSolicitados, (productos, indexProducto) => (
                                                    <>
                                                        {
                                                            productos.referencia == ordenVenta ?
                                                                (
                                                                    <>
                                                                        <tr key={requisicion.folio}>
                                                                            <th>
                                                                                {index + 1}
                                                                            </th>
                                                                            <td data-title="cantidad">
                                                                                {requisicion.folio}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {dayjs(requisicion.fechaElaboracion).format('LL')}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {requisicion.solicitante}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {requisicion.departamento}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {requisicion.aprobo == "" ? "No disponible" : requisicion.aprobo}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {requisicion.comentarios == "" ? "Sin comentarios" : requisicion.comentarios}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {requisicion.status == "" ? "No definido" : requisicion.status}
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                                :
                                                                (
                                                                    <>

                                                                    </>
                                                                )
                                                        }
                                                    </>
                                                ))}
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

            {
                listRequisicion ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Productos solicitados</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <Table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">UM</th>
                                            <th scope="col">Descripcion</th>
                                            <th scope="col">Proveedor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listRequisicion, (requisicion, index) => (
                                            <>
                                                {map(requisicion.productosSolicitados, (productos, indexProducto) => (
                                                    <>
                                                        {
                                                            productos.referencia == ordenVenta ?
                                                                (
                                                                    <>
                                                                        <tr key={productos.descripcion}>
                                                                            <th>
                                                                                {indexProducto + 1}
                                                                            </th>
                                                                            <td data-title="cantidad">
                                                                                {productos.cantidad}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {productos.um}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {productos.descripcion}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {productos.proveedor}
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                                :
                                                                (
                                                                    <>

                                                                    </>
                                                                )
                                                        }
                                                    </>
                                                ))}
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

            {
                listCompras ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Informacion general de las compras realizadas</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <Table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Folio</th>
                                            <th scope="col">Proveedor</th>
                                            <th scope="col">Fecha de solicitud</th>
                                            <th scope="col">Fecha de entrega</th>
                                            <th scope="col">Autoriza</th>
                                            <th scope="col">Departamento</th>
                                            <th scope="col">Subtotal</th>
                                            <th scope="col">IVA</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listCompras, (compras, index) => (
                                            <>
                                                {map(compras.productos, (productos, indexProducto) => (
                                                    <>
                                                        {
                                                            productos.referencia == ordenVenta ?
                                                                (
                                                                    <>
                                                                        <tr key={compras.folio}>
                                                                            <th>
                                                                                {index + 1}
                                                                            </th>
                                                                            <td data-title="cantidad">
                                                                                {compras.folio}
                                                                            </td>
                                                                            <td data-title="um">

                                                                                <>
                                                                                    {

                                                                                        <Proveedor

                                                                                            id={compras.proveedor}
                                                                                        />

                                                                                    }
                                                                                </>

                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {moment(compras.fechaSolicitud).format('LL')}
                                                                            </td>
                                                                            <td data-title="precio">
                                                                                {moment(compras.fechaEntrega).format('LL')}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {compras.autoriza}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {compras.departamento}
                                                                            </td>
                                                                            <td data-title="subtotal">
                                                                                <>
                                                                                    {compras.subtotal ? new Intl.NumberFormat('es-MX', {
                                                                                        style: "currency",
                                                                                        currency: "MXN"
                                                                                    }).format(compras.subtotal) : "No disponible"}
                                                                                    { } MXN
                                                                                </>
                                                                            </td>
                                                                            <td data-title="subtotal">
                                                                                <>
                                                                                    {compras.iva ? new Intl.NumberFormat('es-MX', {
                                                                                        style: "currency",
                                                                                        currency: "MXN"
                                                                                    }).format(compras.iva) : "No disponible"}
                                                                                    { } MXN
                                                                                </>
                                                                            </td>
                                                                            <td data-title="subtotal">
                                                                                <>
                                                                                    {compras.total ? new Intl.NumberFormat('es-MX', {
                                                                                        style: "currency",
                                                                                        currency: "MXN"
                                                                                    }).format(compras.total) : "No disponible"}
                                                                                    { } MXN
                                                                                </>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                                :
                                                                (
                                                                    <>

                                                                    </>
                                                                )
                                                        }
                                                    </>
                                                ))}
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

            {
                listCompras ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Productos comprados</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <Table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">UM</th>
                                            <th scope="col">Descripcion</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listCompras, (compras, index) => (
                                            <>
                                                {map(compras.productos, (productos, indexProducto) => (
                                                    <>
                                                        {
                                                            productos.referencia == ordenVenta ?
                                                                (
                                                                    <>
                                                                        <tr key={productos.descripcion}>
                                                                            <th>
                                                                                {indexProducto + 1}
                                                                            </th>
                                                                            <td data-title="cantidad">
                                                                                {productos.cantidad}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {productos.um}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {productos.descripcion}
                                                                            </td>
                                                                            <td data-title="precio">
                                                                                <>
                                                                                    {productos.precio ? new Intl.NumberFormat('es-MX', {
                                                                                        style: "currency",
                                                                                        currency: "MXN"
                                                                                    }).format(productos.precio) : "No disponible"}
                                                                                    { } MXN
                                                                                </>
                                                                            </td>
                                                                            <td data-title="subtotal">
                                                                                <>
                                                                                    {productos.subtotal ? new Intl.NumberFormat('es-MX', {
                                                                                        style: "currency",
                                                                                        currency: "MXN"
                                                                                    }).format(productos.subtotal) : "No disponible"}
                                                                                    { } MXN
                                                                                </>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                                :
                                                                (
                                                                    <>

                                                                    </>
                                                                )
                                                        }
                                                    </>
                                                ))}
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

function formatModelRequisicion(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            fechaElaboracion: data.fechaElaboracion,
            solicitante: data.solicitante,
            aprobo: data.aprobo,
            comentarios: data.comentarios,
            departamento: data.departamento,
            productosSolicitados: data.productosSolicitados,
            status: data.status,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Compras);
