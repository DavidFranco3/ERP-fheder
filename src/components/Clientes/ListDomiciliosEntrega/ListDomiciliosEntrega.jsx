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

    useEffect(() => {
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
    }, []);

    console.log(datosDirecciones);
    console.log(id);


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
                                            <th scope="col">#</th>
                                            <th scope="col">Calle</th>
                                            <th scope="col"># Exterior</th>
                                            <th scope="col"># Interior</th>
                                            <th scope="col">C.P.</th>
                                            <th scope="col">Estado</th>
                                            <th scope="col">Municipio</th>
                                            <th scope="col">Colonia</th>
                                            <th scope="col">País</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {map(datosDirecciones.domiciliosEntrega, (direccion, index) => (
                                            <>
                                                {datosDirecciones._id == id ? (
                                                    <>
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {index + 1}
                                                            </td>
                                                            <td data-title="Calle">
                                                                {direccion.calle}
                                                            </td>
                                                            <td data-title="Numero exterior">
                                                                {direccion.numeroExterior}
                                                            </td>
                                                            <td data-title="Numero interior">
                                                                {direccion.numeroInterior}
                                                            </td>
                                                            <td data-title="Codigo postal">
                                                                {direccion.codigoPostal}
                                                            </td>
                                                            <td data-title="Estado">
                                                                {direccion.estado}
                                                            </td>
                                                            <td data-title="municpio">
                                                                {direccion.municipio}
                                                            </td>
                                                            <td data-title="Colonia">
                                                                {direccion.colonia}
                                                            </td>
                                                            <td data-title="Pais">
                                                                {direccion.pais}
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
