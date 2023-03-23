import { useState, useEffect } from 'react';
import { Row, Col, Container, Badge, Table } from "react-bootstrap"
import { obtenerDatosCuentasPagar} from "../../../api/cuentasPorPagar";
import { map } from "lodash";
import "./ListProductosCuentasPagar.scss"

function ListProductosCuentasPagar(props) {
    const { folio } = props;
    // console.log(ordenVenta)

    // Almacena los datos de la orden de venta
    const [datosOrdenCompra, setDatosOrdenCompra] = useState(null);

    const cargarDatosCompra = () => {
        try {
            obtenerDatosCuentasPagar(folio).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosOrdenCompra(data)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosCompra();
    }, []);


    return (
        <>
            {
                datosOrdenCompra ?
                    (
                        <>
                            <Container fluid className="tablaProductos">
                                <Badge bg="secondary" className="tituloFormularioDetalles">
                                    <h4>Detalles de los productos de la orden de compra</h4>
                                </Badge>
                                <Table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">UM</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Referencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosOrdenCompra.productos, (productos, index) => (
                                            <>
                                                {datosOrdenCompra.folio == folio ? (
                                                    <>
                                                        <tr key={index}>
                                                            <td>
                                                                {index + 1}
                                                            </td>
                                                            <td data-title="descripcion">
                                                                {productos.descripcion}
                                                            </td>
                                                            <td data-title="cantidad">
                                                                {productos.cantidad}
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.um}
                                                            </td>
                                                            <td>
                                                                ${''}
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(productos.precio)} MXN
                                                            </td>
                                                            <td>
                                                                ${''}
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(productos.subtotal)} MXN
                                                            </td>
                                                            <td data-title="um">
                                                                {productos.referencia}
                                                            </td>
                                                        </tr>
                                                    </>
                                                ) : (<></>)}
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

export default ListProductosCuentasPagar;
