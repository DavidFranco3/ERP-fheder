import { useState, useEffect } from 'react';
import { Row, Col, Container, Badge } from "react-bootstrap"
import { obtenerDatosRecepcion } from "../../../api/recepcionMaterialInsumos";
import moment from "moment";
import { map } from "lodash";
import "./ListProductosRecepcion.scss"

function ListProductosRecepcion(props) {
    const { numeroRecepcion } = props;
    // console.log(ordenVenta)

    // Almacena los datos de la orden de venta
    const [datosRecepcion, setDatosRecepcion] = useState(null);

    useEffect(() => {
        try {
            obtenerDatosRecepcion(numeroRecepcion).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosRecepcion(data)
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
                datosRecepcion ?
                    (
                        <>
                            <Container fluid className="tablaProductos">
                                <Badge bg="secondary" className="tituloFormularioDetalles">
                                    <h4>Detalles de los productos de la venta</h4>
                                </Badge>
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Orden de compra</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">U.M.</th>
                                            <th scope="col">Proveedor</th>
                                            <th scope="col">Tipo de mercancia</th>
                                            <th scope="col">Precio unitario</th>
                                            <th scope="col">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosRecepcion.productos, (producto, index) => (
                                            <>
                                                {datosRecepcion.folio == numeroRecepcion ? (
                                                    <>
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {index + 1}
                                                            </td>
                                                            <td data-title="ordenCompra">
                                                                {producto.ordenCompra}
                                                            </td>
                                                            <td data-title="Producto">
                                                                {producto.producto}
                                                            </td>
                                                            <td data-title="cantidad">
                                                                {producto.cantidad}
                                                            </td>
                                                            <td data-title="um">
                                                                {producto.um}
                                                            </td>
                                                            <td data-title="proveedor">
                                                                {producto.proveedor}
                                                            </td>
                                                            <td data-title="tipoMercancia">
                                                                {producto.tipoMercancia}
                                                            </td>
                                                            <td data-title="precioUnitario">
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    style: "currency",
                                                                    currency: "MXN"
                                                                }).format(producto.precioUnitario)} MXN
                                                            </td>
                                                            <td data-title="subtotal">
                                                                {new Intl.NumberFormat('es-MX', {
                                                                    style: "currency",
                                                                    currency: "MXN"
                                                                }).format(producto.subtotal)} MXN
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

function formatModelRecepciones(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaRecepcion: data.fechaRecepcion,
            precio: data.precio,
            cantidad: data.cantidad,
            productos: data.productos,
            valorTotal: data.valorTotal,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ListProductosRecepcion;
