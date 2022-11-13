import { useState, useEffect } from 'react';
import { Col, Row, Container, Badge } from "react-bootstrap";
import { map } from "lodash";
import "./Produccion.scss"
import { listarProduccion } from "../../../../api/produccion";
import Cliente from "../../../Produccion/ListProduccion/Cliente";

function Produccion(props) {
    const { ordenVenta } = props;

    // Para almacenar la lista completa de clientes
    const [listProducciones, setListProducciones] = useState(null);

    // Obtener los clientes registrados
    useEffect(() => {
        try {
            listarProduccion().then(response => {
                const { data } = response;

                //console.log(data);

                if (!listProducciones && data) {
                    setListProducciones(formatModelProduccion(data));
                } else {
                    const datosProduccion = formatModelProduccion(data);
                    setListProducciones(datosProduccion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    console.log(listProducciones)

    return (
        <>
            {
                listProducciones ?
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
                                        <Badge pill bg="secondary">Produccion</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Numero Interno</th>
                                            <th scope="col">Numero de parte</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Cliente</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listProducciones, (produccion, index) => (
                                            <>

                                                {
                                                    produccion.generalidades.ordenVenta == ordenVenta ?
                                                        (
                                                            <>
                                                                <tr key={index}>
                                                                    <th>
                                                                        {index + 1}
                                                                    </th>
                                                                    <td data-title="cantidad">
                                                                        {produccion.generalidades.noInterno}
                                                                    </td>
                                                                    <td data-title="um">
                                                                        {produccion.generalidades.noParte}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.generalidades.producto}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {(
                                                                            <>
                                                                                <Cliente
                                                                                    id={produccion.generalidades.cliente}
                                                                                />
                                                                            </>
                                                                        )}
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
                listProducciones ?
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
                                            <th scope="col">Kg Material</th>
                                            <th scope="col">Pigmento</th>
                                            <th scope="col">Aplicacion</th>
                                            <th scope="col">PigMB</th>
                                            <th scope="col">Material x turno</th>
                                            <th scope="col">Merma</th>
                                            <th scope="col">Empaque</th>
                                            <th scope="col">Bolsas o cajas a utilizar</th>
                                            <th scope="col">Elaboro</th>
                                            <th scope="col">Notas importantes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listProducciones, (produccion, index) => (
                                            <>
                                                {
                                                    produccion.generalidades.ordenVenta == ordenVenta ?
                                                        (
                                                            <>

                                                                <tr key={index}>
                                                                    <th>
                                                                        {index + 1}
                                                                    </th>
                                                                    <td data-title="cantidad">
                                                                        {produccion.bom.material}
                                                                    </td>
                                                                    <td data-title="um">
                                                                        {produccion.bom.molido}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.pesoPieza}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.pesoColada}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.kgMaterial}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.pigmento}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.aplicacion}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.pigMb}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.materialxTurno}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.merma}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.empaque}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.bolsasCajasUtilizar}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.elaboro}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.bom.notas}
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
                listProducciones ?
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
                                        {map(listProducciones, (produccion, index) => (
                                            <>
                                                {
                                                    produccion.generalidades.ordenVenta == ordenVenta ?
                                                        (
                                                            <>

                                                                <tr key={index}>
                                                                    <td data-title="cantidad">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][1].numeroMaquina1}
                                                                    </td>
                                                                    <td data-title="um">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][1].maquina1}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][1].ciclo1}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][1].pieza1}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][1].bolsa1}
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
                listProducciones ?
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
                                        {map(listProducciones, (produccion, index) => (
                                            <>

                                                {
                                                    produccion.generalidades.ordenVenta == ordenVenta ?
                                                        (
                                                            <>

                                                                <tr key={index}>
                                                                    <td data-title="cantidad">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][2].numeroMaquina2}
                                                                    </td>
                                                                    <td data-title="um">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][2].maquina2}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][2].ciclo2}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][2].pieza2}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][2].bolsa2}
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
                listProducciones ?
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
                                        {map(listProducciones, (produccion, index) => (
                                            <>

                                                {
                                                    produccion.generalidades.ordenVenta == ordenVenta ?
                                                        (
                                                            <>

                                                                <tr key={index}>
                                                                    <td data-title="cantidad">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][3].numeroMaquina3}
                                                                    </td>
                                                                    <td data-title="um">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][3].maquina3}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][3].ciclo3}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][3].pieza3}
                                                                    </td>
                                                                    <td data-title="descripcion">
                                                                        {produccion.planeacion.opcionesMaquinaria[0][3].bolsa3}
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
                listProducciones ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Registros de materia prima agregados</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">ITEM</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Acumulado</th>
                                            <th scope="col">Material</th>
                                            <th scope="col">Pendiente de surtir</th>
                                            <th scope="col">Virgen/Molido</th>
                                            <th scope="col">Surtio</th>
                                            <th scope="col">Recibio</th>
                                            <th scope="col">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listProducciones, (produccion, index) => (
                                            <>

                                                {
                                                    produccion.generalidades.ordenVenta == ordenVenta ?
                                                        (
                                                            <>
                                                                {map(produccion.materiaPrima, (registro, indexRegistro) => (
                                                                    <>
                                                                        <tr key={index}>
                                                                            <td data-title="cantidad">
                                                                                {indexRegistro + 1}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {registro.fecha}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {registro.acumulado}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {registro.material}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {registro.pendienteSurtir}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {registro.virgenMolido}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {registro.surtio}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {registro.recibio}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {registro.observaciones}
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                ))}
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
                listProducciones ?
                    (
                        <>
                            <Row>
                                <Col>
                                    <br />
                                    <h3>
                                        <Badge pill bg="secondary">Resultados agregados</Badge>
                                    </h3>
                                </Col>
                            </Row>

                            <Container fluid className="contenidoTablaPlaneacion">
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">ITEM</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Acumulado</th>
                                            <th scope="col">Turno</th>
                                            <th scope="col">Piezas defectuosas</th>
                                            <th scope="col">Operador</th>
                                            <th scope="col">Eficiencia</th>
                                            <th scope="col">Ciclo</th>
                                            <th scope="col">Cantidad fabricada</th>
                                            <th scope="col">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(listProducciones, (produccion, index) => (
                                            <>

                                                {
                                                    produccion.generalidades.ordenVenta == ordenVenta ?
                                                        (
                                                            <>
                                                                {map(produccion.resultados, (resultado, indexResultado) => (
                                                                    <>
                                                                        <tr key={index}>
                                                                            <td data-title="cantidad">
                                                                                {indexResultado + 1}
                                                                            </td>
                                                                            <td data-title="um">
                                                                                {resultado.fecha}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.acumulado}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.turno}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.piezasDefectuosas}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.operador}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.eficiencia}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.ciclo}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.cantidadFabricada}
                                                                            </td>
                                                                            <td data-title="descripcion">
                                                                                {resultado.observaciones}
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                ))}
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

function formatModelProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            generalidades: data.generalidades,
            planeacion: data.planeacion,
            bom: data.bom,
            resultados: data.resultados,
            materiaPrima: data.materiaPrima,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default Produccion;
