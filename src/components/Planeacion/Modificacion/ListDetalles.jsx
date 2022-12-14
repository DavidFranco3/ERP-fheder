import { useState, useEffect } from 'react';
import {map} from "lodash";
import { useHistory } from "react-router-dom";
import MaterialUsado from "../../Tracking/Procesos/Planeacion/MaterialUsado";
import CantidadNecesaria from "../../Tracking/Procesos/Planeacion/CantidadNecesaria";
import RevisaExistenciasStock from "../../Tracking/Procesos/Planeacion/RevisaExistenciasStock";
import RevisaDiferencia from "../../Tracking/Procesos/Planeacion/RevisaDiferencia";
import VerificacionExistencias from "../../Tracking/Procesos/Planeacion/VerificacionExistencias";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import "./ModificacionPlaneacion.scss"

function ListDetalles(props) {
    const { detalles, datosPlaneacion } = props;

    // Para definir el uso del enrutamiento
    const enrutamiento = useHistory();

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para registrar los detalles de reserva de stock
    const onSubmit = (e) => {
        e.preventDefault()
        // console.log(e)
        const table = document.querySelector('table')
        const [header] = table.tHead.rows
        const props = [...header.cells].map(h => h.textContent)
        const rows = [...table.rows].map(r => {
            const entries = [...r.cells].map((c, i) => {
                return [props[i], c.textContent]
            })
            return Object.fromEntries(entries)
        })

        // rows contiene la informacion necesaria para poder reservar stock

        // console.log(rows)
    }

    // Para cancelar la autorizacion
    const cancelar = () => {
        enrutamiento.push("/Planeacion");
    }

    return (
        <>
            <Container fluid className="contenidoTablaPlaneacion">
                <table
                    className="responsive-tableTrackingOV"
                >
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Material</th>
                        <th scope="col">Material a usar x um</th>
                        <th scope="col">Cantidad pedida</th>
                        <th scope="col">Cant. total a usar</th>
                        <th scope="col">Existencias</th>
                        <th scope="col">Diferencia</th>
                        <th scope="col">Autorizado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {map(datosPlaneacion.productos, (datos, index) => (
                        <>
                            <tr key={index}>
                                <th>
                                    {index}
                                </th>
                                <td data-title="Producto">
                                    {datos.item}
                                </td>
                                <td data-title="Material">
                                    <MaterialUsado
                                        folio={datos.idProducto}
                                    />
                                </td>
                                <td data-title="Material a usar x um">
                                    kg * pieza
                                </td>
                                <td data-title="Cantidad pedida">
                                    {datos.cantidad}
                                </td>
                                <td data-title="Cant. total a usar">
                                    <CantidadNecesaria
                                        folio={datos.idProducto}
                                        cantidadPedida={datos.cantidad}
                                    />
                                </td>
                                <td data-title="Existencias">
                                    <RevisaExistenciasStock
                                        folio={datos.idProducto}
                                    />
                                </td>
                                <td data-title="Diferencia">
                                    <RevisaDiferencia
                                        folio={datos.idProducto}
                                        cantidadPedida={datos.cantidad}
                                    />
                                </td>
                                <td data-title="Verificación de existencias">
                                    <VerificacionExistencias
                                        folio={datos.idProducto}
                                        cantidadPedida={datos.cantidad}
                                    />
                                </td>
                            </tr>
                        </>
                    ))}
                    </tbody>
                </table>

                <div className="botonesAutorizarProduccion">
                    <Row>
                        <Col>
                            <Button
                                variant="success"
                                title="Autorizar la producción"
                                className="registrar"
                                onClick={(e) => {
                                    onSubmit(e)
                                }}
                            >
                                {!loading ? "Autorizar Produción" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                title="Cerrar el formulario"
                                className="registrar"
                                onClick={() => {
                                    cancelar()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    );
}

export default ListDetalles;
