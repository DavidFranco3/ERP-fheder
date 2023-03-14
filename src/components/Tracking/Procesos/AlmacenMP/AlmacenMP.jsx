import { useState, useEffect } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { listarAlmacenMP } from "../../../../api/almacenMP";
import { map } from "lodash";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function Almacen(props) {
    const { ordenVenta } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

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
                   Movimientos en almacen MP
                </Col>
            </Row>

            <Container fluid className="contenidoInformativo">
                <table className="responsive-tableTrackingOV"
                >
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Materia prima</th>
                            <th scope="col">UM</th>
                            <th scope="col">Fecha del movimiento</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Lote</th>
                            <th scope="col">Referencia</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Cantidad E/S</th>
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
                                                                {materiaPrima.um}
                                                            </td>
                                                            <td data-title="descripcion">
                                                                {dayjs(materiaPrima.fecha).format('LL')}
                                                            </td>
                                                            <td data-title="um">
                                                                {materiaPrima.tipo}
                                                            </td>
                                                            <td data-title="um">
                                                                {materiaPrima.lote}
                                                            </td>
                                                            <td data-title="um">
                                                                {materiaPrima.referencia}
                                                            </td>
                                                            <td data-title="um">
                                                                {materiaPrima.descripcion}
                                                            </td>
                                                            <td data-title="um">
                                                                {materiaPrima.cantidadExistencia}
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
