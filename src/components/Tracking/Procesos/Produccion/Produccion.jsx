import { useState, useEffect } from 'react';
import { Col, Row, Container, Badge } from "react-bootstrap";
import { map } from "lodash";
import "./Produccion.scss"
import { listarProduccion } from "../../../../api/produccion";
import { getSucursal } from '../../../../api/auth';

function Produccion(props) {
    const { ordenVenta } = props;

    // Para almacenar la lista completa de clientes
    const [listProducciones, setListProducciones] = useState(null);

    const cargarListaProudcciones = () => {
        try {
            listarProduccion(getSucursal()).then(response => {
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
    }

    // Obtener los clientes registrados
    useEffect(() => {
        cargarListaProudcciones();
    }, []);

    return (
        <>
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
