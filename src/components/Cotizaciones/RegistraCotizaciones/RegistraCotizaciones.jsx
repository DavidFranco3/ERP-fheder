import { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import {Alert, Col, Button, Spinner, Form, Container, Row} from "react-bootstrap";
import {Wizard} from "react-use-wizard";
import EncabezadoOV from "../../Ventas/Registro/Pasos/OrdenVenta/EncabezadoOV/EncabezadoOV";
import FooterOv from "../../Ventas/Registro/Pasos/OrdenVenta/FooterOV";
import NuevaOrden from "../../Ventas/Registro/Pasos/OrdenVenta/NuevaOrden";
import DetallesMateriaPrima from "../../Ventas/Registro/Pasos/OrdenVenta/DetallesMateriaPrima";
import TiemposEspera from "../../Ventas/Registro/Pasos/OrdenVenta/TiemposEspera";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { obtenerCotizacion, registraCotizacion, obtenerNumeroCotizacion, actualizaCotizacion } from "../../../api/cotizaciones";
import EncabezadoCotizacion from "./Pasos/Cotizacion/EncabezadoCotizacion";
import FooterCotizacion from "./Pasos/Cotizacion/FooterCotizacion";
import Inicial from "./Pasos/Cotizacion/Inicial";
import Partidas from "./Pasos/Cotizacion/Partidas";
import VistaPrevia from "./Pasos/Cotizacion/VistaPrevia";
import {listarClientes} from "../../../api/clientes";
import {listarProveedores} from "../../../api/proveedores";
import {toast} from "react-toastify";
import {map} from "lodash";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function RegistraCotizaciones(props) {
    
    const enrutamiento = useHistory();
    
    // Para determinar el regreso a la ruta de pedidos
    const regresaListadoCotizaciones = () => {
        enrutamiento.push("/Cotizaciones");
    }
    
        // Para almacenar los datos del formulario de Inicial, Partidas y VistaPrevia
    const [formData, setFormData] = useState(initialFormDataInicial());

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Para almacenar los datos de la cotización
    const [datosCotizacion, setDatosCotizacion] = useState(null);
    const [folioCotizacion, setFolioCotizacion] = useState("");
    const [fechaCreacion, setFechaCreacion] = useState(new Date());

    useEffect(() => {
        try {
            obtenerNumeroCotizacion().then(response => {
                const { data } = response;
                // console.log(data)
                const { noCotizacion } = data;
                setFolioCotizacion(noCotizacion)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);
    
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
            listarProveedores().then(response => {
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
    
    const onSubmit = e => {
        e.preventDefault()
        
        if (!formData.fecha || !formData.proveedor || !formData.cliente) {
            toast.warning("Completa el formulario");
        } else {
        
        //console.log(formData)
        setLoading(true)
        try {
            obtenerNumeroCotizacion().then(response => {
            const { data } = response;
            const dataTemp = {
            folio: data.folioCotizacion,
            fechaCreacion: formData.fecha, 
            vendedor: formData.proveedor,
            cliente: formData.cliente,
            status: "true"
        }
        
            registraCotizacion(dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se ha registrado una cotizacion con folio ", data.folioCotizacion)
                setLoading(false)
                toast.success(data.mensaje)
                regresaListadoCotizaciones()
            }).catch(e => {
                console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
            }).catch(e => {
                    console.log(e)
                })
        } catch (e) {
            console.log(e)
        }
    }
    }
    
        const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Cotizacion
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <h1>
                                Folio: {folioCotizacion}
                            </h1>
                        </Col>
                    </Row>
                </Alert>

                <Container fluid>
                    <div className="formularioNuevaOrden">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    {/* Fecha de creación, vendedor, referencia */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFechaCreacion">
                            <Form.Label>Fecha de creación</Form.Label>
                            <Form.Control
                                        className="mb-3"
                                        type="datetime-local"
                                        placeholder="Fecha"
                                        defaultValue={formData.fecha}
                                        name="fecha"
                                        />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridVendedor">
                            <Form.Label>
                                            Vendedor
                                        </Form.Label>
                                        <Form.Control as="select"
                                                      defaultValue={formData.proveedor}
                                                      name="proveedor"
                                        >
                                            <option>Elige una opción</option>
                                            {map(listProveedores, (proveedor, index) => (
                                                <option key={index} value={proveedor?.id}>{proveedor?.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                    
                    {/* Cliente */}
                    <Form.Group as={Col} controlId="formGridCliente">
                                        <Form.Label>
                                            Cliente
                                        </Form.Label>
                                        <Form.Control as="select"
                                                      defaultValue={formData.cliente}
                                                      name="cliente"
                                        >
                                            <option>Elige una opción</option>
                                            {map(listClientes, (cliente, index) => (
                                                <option key={index} value={cliente?.id}>{cliente?.nombre + " " + cliente.apellidos}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                    </Row>
                    
                     <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <Button
                                            type="submit"
                                            variant="success"
                                            className="registrar"
                                        >
                                            {!loading ? "Registrar cotizacion" : <Spinner animation="border" />}
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant="danger"
                                            className="registrar"
                                            onClick={() => {
                                                regresaListadoCotizaciones()
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                    
                </Form>
            </div>
                </Container>
            </LayoutPrincipal>
        </>
    );
}

function initialFormDataInicial() {
    return {
        vendedor: "",
        cliente: "",
        status: ""
    }
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

export default RegistraCotizaciones;
