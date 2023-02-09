import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import { obtenerLiberacionProducto, actualizaLiberacionProducto } from "../../../api/liberacionProductoProceso";
import { toast } from "react-toastify";
import { listarClientes } from "../../../api/clientes";
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { map } from "lodash";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import BuscarCliente from "../../../page/BuscarCliente";
import BuscarProducto from "../../../page/BuscarProducto";
import BasicModal from "../../Modal/BasicModal";
import { listarMaquina } from "../../../api/maquinas";
import "./VistaPreviaLiberacionProducto.scss";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaLiberacionProducto(props) {
    const { setRefreshCheckLogin } = props;

    const descargaPDF = async () => {
    }

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

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    const params = useParams();
    const { id } = params

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataClientes, setFormDataClientes] = useState(initialFormDataClientesInitial());

    // Para almacenar la informacion del formulario
    const [formDataProductos, setFormDataProductos] = useState(initialFormDataProductosInitial());

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/LiberacionProductoProceso")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarCliente = (content) => {
        setTitulosModal("Buscar cliente");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarProducto = (content) => {
        setTitulosModal("Buscar producto");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar el listado de maquinas
    const [listMaquinas, setListMaquinas] = useState(null);

    useEffect(() => {
        try {
            listarMaquina(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)

                if (!listMaquinas && data) {
                    setListMaquinas(formatModelMaquinas(data));
                } else {
                    const datosMaquinas = formatModelMaquinas(data);
                    setListMaquinas(datosMaquinas);
                }
            }).catch(e => {
                //console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar la lista completa de clientes
    const [listClientes, setListClientes] = useState(null);

    // Obtener los clientes registrados
    useEffect(() => {
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
    }, []);

    // Para almacenar el listado de productos activos
    const [listProductosActivos, setListProductosActivos] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarMatrizProductosActivos(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProductosActivos && data) {
                    setListProductosActivos(formatModelMatrizProductos(data));
                } else {
                    const datosProductos = formatModelMatrizProductos(data);
                    setListProductosActivos(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar la materia prima seleccionada
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);

    // Gestion del producto seleccionado
    const handleProducto = (producto) => {
        const dataTempProductos = producto.split("/")
        // console.log(dataTempProductos)
        setProductoSeleccionado({
            noParte: dataTempProductos[0],
            descripcion: dataTempProductos[1]
        })
    }

    useEffect(() => {
        try {
            obtenerLiberacionProducto(id).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formData && data) {
                    setFormData(valoresAlmacenados(data));
                    setFormDataClientes(initialFormDataClientes(data));
                    setFormDataProductos(initialFormDataProductos(data));
                    setProductoSeleccionado({
                        noParte: data.noParteMolde,
                        descripcion: data.descripcionPieza
                    })
                } else {
                    const datosLiberacion = valoresAlmacenados(data);
                    setFormData(datosLiberacion);
                    setFormDataClientes(initialFormDataClientes(data));
                    setFormDataProductos(initialFormDataProductos(data));
                    setProductoSeleccionado({
                        noParte: data.noParteMolde,
                        descripcion: data.descripcionPieza
                    })
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    console.log(formData)
    console.log(productoSeleccionado)
    console.log(id)

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fechaArranque || !formData.fechaElaboracion || !formData.proceso || !formData.noMaquina || !formData.hojaLiberacion || !formData.elaboro || !formData.turno || !formData.observaciones) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            const dataTemp = {
                cliente: formDataClientes.nombreCliente,
                descripcionPieza: formDataProductos.nombreProducto,
                noParteMolde: formDataProductos.noParte,
                procesoRealizado: formData.proceso,
                fechaElaboracion: formData.fechaElaboracion,
                fechaArranqueMolde: formData.fechaArranque,
                noMaquina: formData.noMaquina,
                hojaLiberacion: formData.hojaLiberacion,
                elaboro: formData.elaboro,
                turno: formData.turno,
                proceso: {
                    1: {
                        proceso: formData.proceso1,
                        observaciones: formData.observacionesProceso1
                    },
                    2: {
                        proceso: formData.proceso2,
                        observaciones: formData.observacionesProceso2
                    },
                    3: {
                        proceso: formData.proceso3,
                        observaciones: formData.observacionesProceso3
                    },
                    4: {
                        proceso: formData.proceso4,
                        observaciones: formData.observacionesProceso4
                    },
                    5: {
                        proceso: formData.proceso5,
                        observaciones: formData.observacionesProceso5
                    },
                    6: {
                        proceso: formData.proceso6,
                        observaciones: formData.observacionesProceso6
                    },
                    7: {
                        proceso: formData.proceso7,
                        observaciones: formData.observacionesProceso7
                    },
                },
                producto: {
                    1: {
                        producto: formData.producto1,
                        observaciones: formData.observacionesProducto1
                    },
                    2: {
                        producto: formData.producto2,
                        observaciones: formData.observacionesProducto2
                    },
                    3: {
                        producto: formData.producto3,
                        observaciones: formData.observacionesProducto3
                    },
                    4: {
                        producto: formData.producto4,
                        observaciones: formData.observacionesProducto4
                    },
                    5: {
                        producto: formData.producto5,
                        observaciones: formData.observacionesProducto5
                    },
                    6: {
                        producto: formData.producto6,
                        observaciones: formData.observacionesProducto6
                    },
                    7: {
                        producto: formData.producto7,
                        observaciones: formData.observacionesProducto7
                    },
                    8: {
                        producto: formData.producto8,
                        observaciones: formData.observacionesProducto8
                    },
                },
                observaciones: formData.observaciones
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            actualizaLiberacionProducto(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos(`Se ha actualizado la liberacion de producto y proceso ${id}`, datos)
                // Registro inicial del tracking
                rutaRegreso()
            }).catch(e => {
                console.log(e)
            })
        }

    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormDataClientes({ ...formDataClientes, [e.target.name]: e.target.value });
        setFormDataProductos({ ...formDataProductos, [e.target.name]: e.target.value });
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva hoja de liberación de producto y proceso
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <br />

            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Cliente
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                defaultValue={formDataClientes.nombreCliente}
                                                placeholder="Nombre del cliente"
                                                name="nombreCliente"
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Fecha arranque Molde
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="date"
                                                placeholder="Fecha"
                                                name="fechaArranque"
                                                defaultValue={formData.fechaArranque}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Descripción pieza
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                defaultValue={formDataProductos.nombreProducto}
                                                placeholder="Nombre del producto"
                                                name="nombreProducto"
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                No. Maquina
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                as="select"
                                                placeholder="No. Maquina"
                                                name="noMaquina"
                                                defaultValue={formData.noMaquina}
                                                disabled
                                            >
                                                <option>Elige una opción</option>
                                                {map(listMaquinas, (maquina, index) => (
                                                    <option value={maquina?.numeroMaquina} selected={formData.noMaquina == maquina?.numeroMaquina}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                No. Parte
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="No. Parte/Molde"
                                                name="noParte"
                                                value={formDataProductos.noParte}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Hoja de liberación
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Hoja de liberación"
                                                name="hojaLiberacion"
                                                defaultValue={formData.hojaLiberacion}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Proceso
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Proceso"
                                                name="proceso"
                                                defaultValue={formData.proceso}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Elaboró
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Elaboró"
                                                name="elaboro"
                                                defaultValue={formData.elaboro}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Fecha elaboración
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="date"
                                                placeholder="Fecha"
                                                name="fechaElaboracion"
                                                defaultValue={formData.fechaElaboracion}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Turno
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                as="select"
                                                name="turno"
                                                defaultValue={formData.turno}
                                                disabled
                                            >
                                                <option >Elige....</option>
                                                <option value="1" selected={formData.turno == "1"}>1</option>
                                                <option value="2" selected={formData.turno == "2"}>2</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Proceso
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                1-¿El area de trabajo se encuentra limpia y disponible para operar?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="proceso1"
                                                id="si"
                                                defaultValue={formData.proceso1}
                                                checked={formData.proceso1 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="proceso1"
                                                id="no"
                                                defaultValue={formData.proceso1}
                                                checked={formData.proceso1 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProceso1"
                                                defaultValue={formData.observacionesProceso1}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                2-¿La carpeta de proceso esta completa y disponible para su uso?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="proceso2"
                                                id="si"
                                                defaultValue={formData.proceso2}
                                                checked={formData.proceso2 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="proceso2"
                                                id="no"
                                                defaultValue={formData.proceso2}
                                                checked={formData.proceso2 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProceso2"
                                                defaultValue={formData.observacionesProceso2}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                3-¿El o los operadores estan capacitados en la operación?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="proceso3"
                                                id="si"
                                                defaultValue={formData.proceso3}
                                                checked={formData.proceso3 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="proceso3"
                                                id="no"
                                                defaultValue={formData.proceso3}
                                                checked={formData.proceso3 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProceso3"
                                                defaultValue={formData.observacionesProceso3}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                4-¿Se encuentra la pieza master para prueba?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="proceso4"
                                                id="si"
                                                defaultValue={formData.proceso4}
                                                checked={formData.proceso4 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="proceso4"
                                                id="no"
                                                defaultValue={formData.proceso4}
                                                checked={formData.proceso4 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProceso4"
                                                defaultValue={formData.observacionesProceso4}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                5-¿Cuentan con orden de producción?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="proceso5"
                                                id="si"
                                                defaultValue={formData.proceso5}
                                                checked={formData.proceso5 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="proceso5"
                                                id="no"
                                                defaultValue={formData.proceso5}
                                                checked={formData.proceso5 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProceso5"
                                                defaultValue={formData.observacionesProceso5}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                6-¿Cuentan con ayuda visual del producto?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="proceso6"
                                                id="si"
                                                defaultValue={formData.proceso6}
                                                checked={formData.proceso6 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="proceso6"
                                                id="no"
                                                defaultValue={formData.proceso6}
                                                checked={formData.proceso6 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProceso6"
                                                defaultValue={formData.observacionesProceso6}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                7-¿Se encuentra con las etiquetas  correspondientes segun norma de empaque?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="proceso7"
                                                id="si"
                                                defaultValue={formData.proceso7}
                                                checked={formData.proceso7 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="proceso7"
                                                id="no"
                                                defaultValue={formData.proceso7}
                                                checked={formData.proceso7 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProceso7"
                                                defaultValue={formData.observacionesProceso7}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Producto
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                1-¿Pieza libre de rebaba en contornos y zona de ensamble?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto1"
                                                id="si"
                                                defaultValue={formData.producto1}
                                                checked={formData.producto1 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto1"
                                                id="no"
                                                defaultValue={formData.producto1}
                                                checked={formData.producto1 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto1"
                                                defaultValue={formData.observacionesProducto1}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                2-¿Tono dentro de los criterios establecidos?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto2"
                                                id="si"
                                                defaultValue={formData.producto2}
                                                checked={formData.producto2 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto2"
                                                id="no"
                                                defaultValue={formData.producto2}
                                                checked={formData.producto2 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto2"
                                                defaultValue={formData.observacionesProducto2}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                3-¿Pieza con nivel de contaminacion aceptable?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto3"
                                                id="si"
                                                defaultValue={formData.producto3}
                                                checked={formData.producto3 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto3"
                                                id="no"
                                                defaultValue={formData.producto3}
                                                checked={formData.producto3 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto3"
                                                defaultValue={formData.observacionesProducto3}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                4-Piezas sin rechupe en parte interna (conforme a la pieza de ayuda visual)
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto4"
                                                id="si"
                                                defaultValue={formData.producto4}
                                                checked={formData.producto4 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto4"
                                                id="no"
                                                defaultValue={formData.producto4}
                                                checked={formData.producto4 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto4"
                                                defaultValue={formData.observacionesProducto4}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                5-¿Piezas sin rafaga ni marca?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto5"
                                                id="si"
                                                defaultValue={formData.producto5}
                                                checked={formData.producto5 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto5"
                                                id="no"
                                                defaultValue={formData.producto5}
                                                checked={formData.producto5 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto5"
                                                defaultValue={formData.observacionesProducto5}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                6-¿Piezas sin tiro corto o deformaciones?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto6"
                                                id="si"
                                                defaultValue={formData.producto6}
                                                checked={formData.producto6 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto6"
                                                id="no"
                                                defaultValue={formData.producto6}
                                                checked={formData.producto6 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto6"
                                                defaultValue={formData.observacionesProducto6}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                7-¿Correcto emsable de componentes?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto7"
                                                id="si"
                                                defaultValue={formData.producto7}
                                                checked={formData.producto7 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto7"
                                                id="no"
                                                defaultValue={formData.producto7}
                                                checked={formData.producto7 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto7"
                                                defaultValue={formData.observacionesProducto7}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                8-¿Peso conforme a lo especificado en la carpeta de proceso/plan de control correto ensamble de componentes?
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="producto8"
                                                id="si"
                                                defaultValue={formData.producto8}
                                                checked={formData.producto8 == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="producto8"
                                                id="no"
                                                defaultValue={formData.producto8}
                                                checked={formData.producto8 == "no"}
                                                disabled
                                            />
                                        </Col>

                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observacionesProducto8"
                                                defaultValue={formData.observacionesProducto8}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observaciones"
                                                defaultValue={formData.observaciones}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="botones">
                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <div
                                            className="generacionPDF"
                                        >
                                            <Image
                                                src={LogoPDF}
                                                className="logoPDF"
                                                onClick={() => {
                                                    descargaPDF()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className="regreso"
                                        >
                                            <Image
                                                src={Regreso}
                                                className="regresarVistaAnterior"
                                                onClick={() => {
                                                   rutaRegreso()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </div>
                        <br />
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormDataClientesInitial() {
    return {
        nombreCliente: ""
    }
}

function initialFormDataProductosInitial() {
    return {
        nombreProducto: "",
        noParte: ""
    }
}

function initialFormDataClientes(data) {
    return {
        nombreCliente: data.cliente,
    }
}

function initialFormDataProductos(data) {
    return {
        nombreProducto: data.descripcionPieza,
        noParte: data.noParteMolde
    }
}

function initialFormData() {
    return {
        cliente: "",
        fechaArranque: "",
        descripcion: "",
        noMaquina: "",
        noParte: "",
        hojaLiberacion: "",
        proceso: "",
        elaboro: "",
        fechaElaboracion: "",
        turno: "",
        proceso1: "",
        observacionesProceso1: "",
        proceso2: "",
        observacionesProceso2: "",
        proceso3: "",
        observacionesProceso3: "",
        proceso4: "",
        observacionesProceso4: "",
        proceso5: "",
        observacionesProceso5: "",
        proceso6: "",
        observacionesProceso6: "",
        proceso7: "",
        observacionesProceso7: "",
        producto1: "",
        observacionesProducto1: "",
        producto2: "",
        observacionesProducto2: "",
        producto3: "",
        observacionesProducto3: "",
        producto4: "",
        observacionesProducto4: "",
        producto5: "",
        observacionesProducto5: "",
        producto6: "",
        observacionesProducto6: "",
        producto7: "",
        observacionesProducto7: "",
        producto8: "",
        observacionesProducto8: "",
        observaciones: ""
    }
}

function valoresAlmacenados(data) {
    return {
        cliente: data.cliente,
        fechaArranque: data.fechaArranqueMolde,
        descripcion: data.descripcionPieza,
        noMaquina: data.noMaquina,
        noParte: data.noParteMolde,
        hojaLiberacion: data.hojaLiberacion,
        proceso: data.procesoRealizado,
        elaboro: data.elaboro,
        fechaElaboracion: data.fechaElaboracion,
        turno: data.turno,
        proceso1: data.proceso[0][1].proceso,
        observacionesProceso1: data.proceso[0][1].observaciones,
        proceso2: data.proceso[0][2].proceso,
        observacionesProceso2: data.proceso[0][2].observaciones,
        proceso3: data.proceso[0][3].proceso,
        observacionesProceso3: data.proceso[0][3].observaciones,
        proceso4: data.proceso[0][4].proceso,
        observacionesProceso4: data.proceso[0][4].observaciones,
        proceso5: data.proceso[0][5].proceso,
        observacionesProceso5: data.proceso[0][5].observaciones,
        proceso6: data.proceso[0][6].proceso,
        observacionesProceso6: data.proceso[0][6].observaciones,
        proceso7: data.proceso[0][7].proceso,
        observacionesProceso7: data.proceso[0][7].observaciones,
        producto1: data.producto[0][1].producto,
        observacionesProducto1: data.producto[0][1].observaciones,
        producto2: data.producto[0][2].producto,
        observacionesProducto2: data.producto[0][2].observaciones,
        producto3: data.producto[0][3].producto,
        observacionesProducto3: data.producto[0][3].observaciones,
        producto4: data.producto[0][4].producto,
        observacionesProducto4: data.producto[0][4].observaciones,
        producto5: data.producto[0][5].producto,
        observacionesProducto5: data.producto[0][5].observaciones,
        producto6: data.producto[0][6].producto,
        observacionesProducto6: data.producto[0][6].observaciones,
        producto7: data.producto[0][7].producto,
        observacionesProducto7: data.producto[0][7].observaciones,
        producto8: data.producto[0][8].producto,
        observacionesProducto8: data.producto[0][8].observaciones,
        observaciones: data.observaciones
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

function formatModelMatrizProductos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            noInterno: data.noInterno,
            cliente: data.cliente,
            datosMolde: data.datosMolde,
            noParte: data.noParte,
            descripcion: data.descripcion,
            datosPieza: data.datosPieza,
            materiaPrima: data.materiaPrima,
            pigmentoMasterBach: data.pigmentoMasterBach,
            tiempoCiclo: data.tiempoCiclo,
            noOperadores: data.noOperadores,
            piezasxHora: data.piezasxHora,
            piezasxTurno: data.piezasxTurno,
            materialEmpaque: data.materialEmpaque,
            opcionMaquinaria: data.opcionMaquinaria,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelMaquinas(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            numeroMaquina: data.numeroMaquina,
            marca: data.marca,
            tonelaje: data.tonelaje,
            lugar: data.lugar,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default VistaPreviaLiberacionProducto;
