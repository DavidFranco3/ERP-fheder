import { useState, useEffect } from 'react';
import { Row, Col, Container, Badge } from "react-bootstrap"
import { obtenerCliente } from "../../../api/clientes";
import moment from "moment";
import { map } from "lodash";
import "./ListDomiciliosEntrega.scss"

function ListDomiciliosEntrega(props) {
    const { id } = props;
    // console.log(ordenVenta)

    // Almacena los datos de la orden de venta
    const [datosDirecciones, setDatosDirecciones] = useState(null);

    const obtenerDatos = () => {
        try {
            obtenerCliente(id).then(response => {
                const { data } = response;
                // console.log(data)
                setDatosDirecciones(data)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
       obtenerDatos();
    }, []);

    return (
        <>
            {
                datosDirecciones ?
                    (
                        <>
                            <Container fluid className="tablaProductos">
                                <Badge bg="secondary" className="tituloFormularioDetalles">
                                    <h4>Domicilios de entrega del cliente</h4>
                                </Badge>
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">Dirección</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosDirecciones.domiciliosEntrega, (direccion, index) => (
                                            <>
                                                {datosDirecciones._id == id ? (
                                                    <>
                                                        <tr key={index}>
                                                            <td data-title="Pais">
                                                                {direccion.direccion}
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

export default ListDomiciliosEntrega;
