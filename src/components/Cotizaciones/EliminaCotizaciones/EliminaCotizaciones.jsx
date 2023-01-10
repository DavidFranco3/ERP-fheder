import { useState, useEffect } from 'react';
import { eliminaCotizacion } from "../../../api/cotizaciones";
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import queryString from "query-string";
import {listarClientes} from "../../../api/clientes";
import {listarEvaluacionProveedores} from "../../../api/evaluacionProveedores";
import {map} from "lodash";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function EliminaCotizaciones(props) {
    const { datosCotizacion, location, history, setShowModal } = props;
    const { id, folio, cliente, vendedor } = datosCotizacion;

    // console.log(datosCotizacion)

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);
    
    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }
    
    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);
    
    // Para almacenar la lista completa de clientes
    const [listClientes, setListClientes] = useState(null);

    // Obtener los clientes registrados
    useEffect(() => {
        try {
            listarClientes().then(response => {
                const { data } = response;

                //console.log(data);

                if(!listClientes && data) {
                    setListClientes(formatModelClientes(data));
                } else {
                    const datosClientes = formatModelClientes(data);
                    setListClientes(datosClientes);
                }
            }).catch(e => {
                //console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);
    
    // Para almacenar la lista completa de clientes
    const [listProveedores, setListProveedores] = useState(null);

    // Obtener los clientes registrados
    useEffect(() => {
        try {
            listarEvaluacionProveedores().then(response => {
                const { data } = response;

                //console.log(data);

                if(!listProveedores && data) {
                    setListProveedores(formatModelProveedores(data));
                } else {
                    const datosProveedores = formatModelProveedores(data);
                    setListProveedores(datosProveedores);
                }
            }).catch(e => {
                //console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            eliminaCotizacion(id).then(response => {
                const { data } = response;
                LogsInformativos("Se elimino la cotización con folio " + folio, datosCotizacion)
                toast.success(data.mensaje)
                setLoading(false)
                setShowModal(false)
                history.push({
                    search: queryString.stringify(""),
                });
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
            <Alert variant="danger">
                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                <p className="mensaje">
                    Esta acción eliminara del sistema la cotización.
                </p>
            </Alert>
                <Form.Group className="btnEliminar">
                    {/* Folio, cliente y vendedor */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridVendedor">
                            <Form.Label>Folio</Form.Label>
                            <Form.Control
                                type="text"
                                name="folio"
                                defaultValue={folio}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridCliente">
                                        <Form.Label>
                                            Cliente
                                        </Form.Label>
                                        <Form.Control as="select"
                                                      value={cliente}
                                                      name="cliente"
                                                      disabled
                                        >
                                            <option>Elige una opción</option>
                                            {map(listClientes, (cliente, index) => (
                                                <option key={index} value={cliente?.id}>{cliente?.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                        <Form.Group as={Col} controlId="formGridVendedor">
                            <Form.Label>
                                            Vendedor
                                        </Form.Label>
                                        <Form.Control as="select"
                                                      value={vendedor}
                                                      name="proveedor"
                                                      disabled
                                        >
                                            <option>Elige una opción</option>
                                            {map(listProveedores, (proveedor, index) => (
                                                <option key={index} value={proveedor?.id}>{proveedor?.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                    </Row>
                    {/* Termina folio, cliente y vendedor*/}
                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Eliminar el registro"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Eliminar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                title="Cerrar el formulario"
                                className="cancelar"
                                onClick={() => {
                                    cancelarEliminacion()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                </Form.Group>
            </Form>
        </>
    );
}

function formatModelClientes(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            rfc: data.rfc,
            telefonoCelular: data.telefonoCelular,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            colonia: colonia,
            municipio: municipio,
            estado: estado,
            pais: pais,
            correo: data.correo,
            foto: data.foto,
            estadoCliente: data.estadoCliente,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelProveedores(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            tipo: data.tipo,
            productoServicio: data.productoServicio,
            categoria: data.categoria,
            personalContacto: data.personalContacto,
            telefono: data.telefono,
            correo: data.correo,
            tiempoCredito: data.tiempoCredito,
            tiempoRespuesta: data.tiempoRespuesta,
            lugarRecoleccion: data.lugarRecoleccion,
            horario: data.horario,
            comentarios: data.comentarios,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default EliminaCotizaciones;
