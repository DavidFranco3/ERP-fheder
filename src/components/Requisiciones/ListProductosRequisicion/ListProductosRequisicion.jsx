import { useState, useEffect } from 'react';
import { Row, Col, Container, Badge } from "react-bootstrap"
import { obtenerDatosRequisiciones } from "../../../api/requisicion";
import moment from "moment";
import { map } from "lodash";
import "./ListProductosRequisicion.scss"

function ListProductosRequisicion(props) {
    const { requisicion } = props;
    console.log(requisicion)

    // Almacena los datos de la orden de venta
    const [datosRequisicion, setDatosRequisicion] = useState(null);

    useEffect(() => {
        try {
            obtenerDatosRequisiciones(requisicion).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosRequisicion(data)
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
                datosRequisicion ?
                    (
                        <>
                            <Container fluid className="tablaProductos">
                                <Badge bg="secondary" className="tituloFormularioDetalles">
                                    <h4>Detalles de los articulos de la requisicion</h4>
                                </Badge>
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Folio</th>
                                            <th scope="col">Descripcion</th>
                                            <th scope="col">UM</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col">Subtotal</th>
                                            <th scope="col">Referencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosRequisicion.productosSolicitados, (producto, index) => (
                                            <>
                                                {datosRequisicion.folio == requisicion ? (
                                                    <>
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {index + 1}
                                                            </td>
                                                            <td data-title="Folio">
                                                                {producto.folio}
                                                            </td>
                                                            <td data-title="Cantidad">
                                                                {producto.descripcion}
                                                            </td>
                                                            <td data-title="UM">
                                                                {producto.um}
                                                            </td>
                                                            <td data-title="Descripción">
                                                                {producto.cantidad}
                                                            </td>
                                                            <td data-title="Precio unitario">
                                                                <>
                                                                    {producto.precioUnitario ? new Intl.NumberFormat('es-MX', {
                                                                        style: "currency",
                                                                        currency: "MXN"
                                                                    }).format(producto.precioUnitario) : "No disponible"}
                                                                    { } MXN
                                                                </>
                                                            </td>
                                                            <td data-title="Subtotal">
                                                                <>
                                                                    {producto.subtotal ? new Intl.NumberFormat('es-MX', {
                                                                        style: "currency",
                                                                        currency: "MXN"
                                                                    }).format(producto.subtotal) : "No disponible"}
                                                                    { } MXN
                                                                </>
                                                            </td>
                                                            <td data-title="Referencia">
                                                                {producto.referencia}
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

function formatModelRequisiciones(data) {
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
            tipoRequisicion: data.tipoRequisicion,
            tipoAplicacion: data.tipoAplicacion,
            departamento: data.departamento,
            productosSolicitados: data.productosSolicitados,
            status: data.status,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ListProductosRequisicion;
