import { useState, useEffect } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { listarAlmacenPT } from "../../../../api/almacenPT";
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

    const cargarListaMateriales = () => {
        try {
            listarAlmacenPT().then(response => {
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
    }

    useEffect(() => {
        cargarListaMateriales();
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
                            <th scope="col">UM</th>
                            <th scope="col">Fecha del movimiento</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Referencia</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Cantidad E/S</th>
                        </tr>
                    </thead>
                    <tbody>
                        {map(listMateriasPrimas, (producto, index) => (
                            <>
                                {map(producto.movimientos, (productos, indexProducto) => (
                                    <>
                                        {
                                            productos.referencia == ordenVenta ?
                                                (
                                                    <>
                                                        <tr key={productos.referencia}>
                                                            <th>
                                                                {indexProducto + 1}
                                                            </th>
                                                            <td data-title="cantidad">
                                                                {productos.materiaPrima}
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.existenciasTotales}
                                                            </td>
                                                            <td data-title="descripcion">
                                                                {dayjs(productos.fecha).format('LL')}
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.tipo}
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.referencia}
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.descripcion}
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.cantidad}
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
