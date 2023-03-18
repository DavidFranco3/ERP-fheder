import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaCotizaciones.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { cambiaStatusCotizacion } from "../../../api/cotizaciones";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { listarClientes } from "../../../api/clientes";
import { listarEvaluacionProveedores } from "../../../api/evaluacionProveedores";
import {getSucursal} from "../../../api/auth";
import { map } from "lodash";

function EliminacionLogicaCotizaciones(props) {
    const { dataCotizacion, setShowModal, history } = props;
    const { id, folio, cliente, vendedor, status } = dataCotizacion;

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para almacenar la lista completa de clientes
    const [listClientes, setListClientes] = useState(null);

    const obtenerListaClientes = () => {
        try {
            listarClientes(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listClientes && data) {
                    setListClientes(formatModelClientes(data));
                } else {
                    const datosClientes = formatModelClientes(data);
                    setListClientes(datosClientes);
                }
            }).catch(e => {
                //console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    // Obtener los clientes registrados
    useEffect(() => {
        obtenerListaClientes();
    }, []);

    // Para almacenar la lista completa de clientes
    const [listProveedores, setListProveedores] = useState(null);

    const obtenerListaProveedores = () => {
        try {
            listarEvaluacionProveedores(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listProveedores && data) {
                    setListProveedores(formatModelProveedores(data));
                } else {
                    const datosProveedores = formatModelProveedores(data);
                    setListProveedores(datosProveedores);
                }
            }).catch(e => {
                //console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    // Obtener los clientes registrados
    useEffect(() => {
        obtenerListaProveedores();
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            status: status === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            cambiaStatusCotizacion(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha cancelado la cotización " + cliente + " " + vendedor, dataTemp)
                setShowModal(false);
                setLoading(false);
                history({
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
                        Esta acción cancelara la cotización.
                    </p>
                </Alert>

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
                        <Form.Group
                            as={Col} controlId="formGridCliente">
                            <Form.Label>
                                Cliente
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={cliente}
                                name="cliente"
                                disabled
                            >
                                <option>Elige una opción</option>
                                {map(listClientes, (cliente, index) => (
                                    <option key={index} value={cliente?.id} selected={cliente?.id == cliente}>{cliente?.nombre}</option>
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
                                    <option key={index} value={proveedor?.id} selected={proveedor?.id == vendedor}>{proveedor?.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Row>

                <Form.Group as={Row}
                    className="btnEliminar"
                    title={status === "true" ? "Deshabilitar" : "Habilitar"}
                >
                    <Col>
                        <Button
                            variant="success"
                            type="submit">
                            {!loading ? "Cancelar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelar()
                            }}
                        >
                            Cerrar
                        </Button>
                    </Col>
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

export default EliminacionLogicaCotizaciones;
