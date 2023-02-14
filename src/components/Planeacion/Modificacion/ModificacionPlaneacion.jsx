import { useState, useEffect } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Badge, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./ModificacionPlaneacion.scss"
import { obtenerPlaneacionFolio } from "../../../api/planeacion";
import ListDetalles from "./ListDetalles";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";

function ModificacionPlaneacion(props) {
    const { setRefreshCheckLogin } = props;

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Define el uso del enrutamiento
    const enrutamiento = useNavigate()

    // Define el regreso hacia planeación
    const regresaPlaneacion = () => {
        enrutamiento("/Planeacion")
    }

    // Define el uso de parametros
    const parametros = useParams()
    // console.log(parametros)
    const { folio } = parametros

    // Almacena especificaciones existencias
    const [listEspecificaciones, setListEspecificaciones] = useState([]);

    // Almacena la información de la planeación
    const [detallesPlaneacion, setDetallesPlaneacion] = useState(null);

    let tempDetallesPlaneacion = []

    // Almacena la orden de venta
    const [almacenaOV, setAlmacenaOV] = useState("");

    useEffect(() => {
        try {
            obtenerPlaneacionFolio(folio).then(response => {
                const { data } = response;
                // console.log(data)
                /*const { ordenVenta, createdAt, productos } = data;
                setAlmacenaOV(ordenVenta)

                // let tempDetallesPlaneacion = []
                map(productos, (producto, index) => {
                    console.log(producto)
                    const { idProducto, ID, item, cantidad, descripcion, observaciones, ordenCompra, um } = producto;
                    obtenerProductoPorNoInternoCatalogo(ID).then(response => {
                        const { data } = response;
                        // console.log(data)
                        const { descripcion, datosPieza:{ pesoPiezas }, materiaPrima } = data;
                        tempDetallesPlaneacion.push({ numeroInterno: ID, cantidadxUnidad: pesoPiezas, solicitado: cantidad, total: pesoPiezas * cantidad, existenciaStock: 0, diferencia: 0, cantidadProduce: 0 })
                    })
                })
                //console.log(tempDetallesPlaneacion)
                setDetallesPlaneacion(tempDetallesPlaneacion)*/
                setDetallesPlaneacion(data)

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Modificación de planeación
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <h1>
                                Folio {folio}
                            </h1>
                        </Col>
                    </Row>
                </Alert>

                <Container fluid>
                    {/* Folio orden de venta */}
                    <Form.Group as={Row} className="mb-3" controlId="formGridFolio">
                        <Form.Label column sm="4">
                            Folio de la Orden de Venta
                        </Form.Label>
                        <Col sm="3">
                            <Form.Control
                                type="text"
                                name="folio"
                                defaultValue={folio}
                                disabled
                            />
                        </Col>
                    </Form.Group>
                    {/* Inicia formulario */}
                    <hr />

                    {
                        detallesPlaneacion &&
                        (
                            <>
                                <ListDetalles detalles={detallesPlaneacion} datosPlaneacion={detallesPlaneacion} />
                            </>
                        )
                    }
                    <hr />
                    <br />
                </Container>

            </LayoutPrincipal>
        </>
    );
}

export default ModificacionPlaneacion;
