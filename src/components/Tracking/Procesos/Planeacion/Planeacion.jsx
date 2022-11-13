import { useState, useEffect, Suspense } from 'react';
import { Row, Col, Container, Spinner, Badge } from "react-bootstrap"
import { map } from "lodash";
import { withRouter } from "react-router-dom";
import "./Planeacion.scss"
import { listarRequerimiento } from "../../../../api/requerimientosPlaneacion";

function Compras(props) {
    const { ordenVenta } = props;

    // Para almacenar la lista completa de clientes
    const [listPlaneaciones, setListPlaneaciones] = useState(null);

    // Obtener los clientes registrados
    useEffect(() => {
        try {
            listarRequerimiento().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listPlaneaciones && data) {
                    setListPlaneaciones(formatModelRequerimientos(data));
                } else {
                    const datosPlaneaciones = formatModelRequerimientos(data);
                    setListPlaneaciones(datosPlaneaciones);
                }
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
                listPlaneaciones ?
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
                                        <Badge pill bg="secondary">Requerimientos y planeaciones</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Orden venta</th>
                                            <th scope="col">Cantidad pedida</th>
                                            <th scope="col">Cantidad a producir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listPlaneaciones, (planeacion, index) => (
                                            <>
                                                {map(planeacion.requerimiento.ordenVenta, (venta, indexVenta) => (
                                                    <>
                                                        {
                                                            venta.ordenVenta == ordenVenta ?
                                                                (
                                                                    <>
                                                                        <tr key={venta.ordenVenta}>
                                                                            <th>
                                                                                {indexVenta + 1}
                                                                            </th>
                                                                            <td data-title="cantidad">
                                                                                {venta.ordenVenta}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {venta.cantidadPedidaOV}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {venta.cantidadProducirOV}
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

            {
                listPlaneaciones ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">BOM</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Material</th>
                                            <th scope="col">Molido</th>
                                            <th scope="col">Peso Pieza</th>
                                            <th scope="col">Peso Colada</th>
                                            <th scope="col">kg Material</th>
                                            <th scope="col">Pigmento</th>
                                            <th scope="col">aplicacion</th>
                                            <th scope="col">pigMB</th>
                                            <th scope="col">material x turno</th>
                                            <th scope="col">merma</th>
                                            <th scope="col">empaque</th>
                                            <th scope="col">bolsas o cajas a utilizar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listPlaneaciones, (planeacion, index) => (
                                            <>
                                                {map(planeacion.requerimiento.ordenVenta, (venta, indexVenta) => (
                                                    <>
                                                        {
                                                            venta.ordenVenta == ordenVenta ?
                                                                (
                                                                    <>

                                                                        <tr key={planeacion.bom.material}>
                                                                            <th>
                                                                                {index + 1}
                                                                            </th>
                                                                            <td data-title="cantidad">
                                                                                {planeacion.bom.material}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {planeacion.bom.molido}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.pesoPieza}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.pesoColada}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.kgMaterial}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.pigmento}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.aplicacion}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.pigMb}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.materialxTurno}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.merma}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.empaque}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.bom.bolsasCajasUtilizar}
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

            {
                listPlaneaciones ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Primera opcion de maquinaria</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">Numero de maquina</th>
                                            <th scope="col">Maquina</th>
                                            <th scope="col">Ciclo</th>
                                            <th scope="col">Pieza</th>
                                            <th scope="col">Bolsa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listPlaneaciones, (planeacion, index) => (
                                            <>
                                                {map(planeacion.requerimiento.ordenVenta, (venta, indexVenta) => (
                                                    <>
                                                        {
                                                            venta.ordenVenta == ordenVenta ?
                                                                (
                                                                    <>

                                                                        <tr key={planeacion.planeacion.opcionesMaquinaria[0][1].numeroMaquina1}>
                                                                            <td data-title="cantidad">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][1].numeroMaquina1}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][1].maquina1}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][1].ciclo1}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][1].pieza1}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][1].bolsa1}
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

            {
                listPlaneaciones ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Segunda opcion de maquinaria</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">Numero de maquina</th>
                                            <th scope="col">Maquina</th>
                                            <th scope="col">Ciclo</th>
                                            <th scope="col">Pieza</th>
                                            <th scope="col">Bolsa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listPlaneaciones, (planeacion, index) => (
                                            <>
                                                {map(planeacion.requerimiento.ordenVenta, (venta, indexVenta) => (
                                                    <>
                                                        {
                                                            venta.ordenVenta == ordenVenta ?
                                                                (
                                                                    <>

                                                                        <tr key={planeacion.planeacion.opcionesMaquinaria[0][2].numeroMaquina1}>
                                                                            <td data-title="cantidad">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][2].numeroMaquina2}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][2].maquina2}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][2].ciclo2}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][2].pieza2}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][2].bolsa2}
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

            {
                listPlaneaciones ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Tercera opcion de maquinaria</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">Numero de maquina</th>
                                            <th scope="col">Maquina</th>
                                            <th scope="col">Ciclo</th>
                                            <th scope="col">Pieza</th>
                                            <th scope="col">Bolsa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listPlaneaciones, (planeacion, index) => (
                                            <>
                                                {map(planeacion.requerimiento.ordenVenta, (venta, indexVenta) => (
                                                    <>
                                                        {
                                                            venta.ordenVenta == ordenVenta ?
                                                                (
                                                                    <>

                                                                        <tr key={planeacion.planeacion.opcionesMaquinaria[0][3].numeroMaquina1}>
                                                                            <td data-title="cantidad">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][3].numeroMaquina3}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][3].maquina3}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][3].ciclo3}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][3].pieza3}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {planeacion.planeacion.opcionesMaquinaria[0][3].bolsa3}
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

function formatModelRequerimientos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            requerimiento: data.requerimiento,
            planeacion: data.planeacion,
            bom: data.bom,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Compras);
