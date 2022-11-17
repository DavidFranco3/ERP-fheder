import { useState, useEffect } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { listarAlmacenMP } from "../../../../api/almacenMP";
import { map } from "lodash";
import moment from "moment";

function Almacen(props) {
    const { ordenVenta } = props;

    moment.locale("es");

    // Para almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenMP().then(response => {
                const { data } = response;
                // console.log(data)
                if (!listMateriasPrimas && data) {
                    setListMateriasPrimas(formatModelAlmacenPT(data));
                } else {
                    const datosProductos = formatModelAlmacenPT(data);
                    setListMateriasPrimas(datosProductos);
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
            <Row>
                <Col>
                    Pedido de venta: {ordenVenta}
                </Col>
                <Col>
                    Existencias en Almacen de PT
                </Col>
            </Row>

            <Container fluid className="contenidoInformativo">
                <table className="responsive-tableTrackingOV"
                >
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Materia prima</th>
                            <th scope="col">En existencias de MP</th>
                            <th scope="col">Último movimiento</th>
                        </tr>
                    </thead>
                    {<tbody>
                        {map(listMateriasPrimas, (producto, index) => (
                            <>
                                {map(producto.movimientos, (materiaPrima, indexMateria) => (
                                    <>
                                        {
                                            materiaPrima.ordenVenta == ordenVenta ?
                                                (
                                                    <>
                                                        <tr key={materiaPrima.referencia}>
                                                            <th>
                                                                {indexMateria + 1}
                                                            </th>
                                                            <td data-title="cantidad">
                                                                {materiaPrima.materiaPrima}
                                                            </td>
                                                            <td data-title="um">
                                                                {materiaPrima.cantidadExistencia}
                                                            </td>
                                                            <td data-title="descripcion">
                                                                {moment(materiaPrima.fecha).format('LL')}
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
                    </tbody>}
                </table>
            </Container>
        </>
    );
}

function formatModelAlmacenPT(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folioAlmacen: data.folioAlmacen,
            folioMP: data.folioMP,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            movimientos: data.movimientos,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default Almacen;
