import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { registraLiberacionProducto, obtenerNumeroLiberacionProducto, obtenerItemLiberacionProducto } from "../../../api/liberacionProductoProceso";
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


function RegistraLiberacionProductoProceso(props) {
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

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataClientes, setFormDataClientes] = useState(initialFormDataClientes());

    // Para almacenar la informacion del formulario
    const [formDataProductos, setFormDataProductos] = useState(initialFormDataProductos());

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/LiberacionProductoProceso")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

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

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroLiberacionProducto().then(response => {
                const { data } = response;
                // console.log(data)
                const { noLiberacion } = data;
                setFolioActual(noLiberacion)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.proceso || !formData.noMaquina || !formData.hojaLiberacion || !formData.elaboro || !formData.turno || !formData.observaciones) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerItemLiberacionProducto().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: data.item,
                    folio: folioActual,
                    cliente: formDataClientes.nombreCliente,
                    descripcionPieza: formDataProductos.nombreProducto,
                    sucursal: getSucursal(),
                    noParteMolde: formDataProductos.noParte,
                    procesoRealizado: formData.proceso,
                    fechaElaboracion: fechaElaboracion,
                    fechaArranqueMolde: fechaArranque,
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
                registraLiberacionProducto(dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    toast.success(mensaje)
                    // Log acerca del registro inicial del tracking
                    LogsInformativos("Se han registrado la liberacion de producto y proceso " + folioActual, dataTemp)
                    // Registro inicial del tracking
                    rutaRegreso()
                }).catch(e => {
                    console.log(e)
                })
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

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDay() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();
    console.log(fecha)
    const [fechaElaboracion, setFechaElaboracion] = useState(fecha);

    const [fechaArranque, setFechaArranque] = useState(fecha);

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
                    <br />
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
                                            <div className="flex items-center mb-1">
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={formDataClientes.nombreCliente}
                                                    placeholder="Nombre del cliente"
                                                    name="nombreCliente"
                                                />
                                                <FontAwesomeIcon
                                                    className="cursor-pointer py-2 -ml-6"
                                                    title="Buscar entre las ordenes de venta"
                                                    icon={faSearch}
                                                    onClick={() => {
                                                        buscarCliente(
                                                            <BuscarCliente
                                                                formData={formDataClientes}
                                                                setFormData={setFormDataClientes}
                                                                setShowModal={setShowModal}
                                                            />)
                                                    }}
                                                />
                                            </div>
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
                                                value={fechaArranque}
                                                onChange={e => setFechaArranque(e.target.value)}
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
                                            <div className="flex items-center mb-1">
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={formDataProductos.nombreProducto}
                                                    placeholder="Nombre del producto"
                                                    name="nombreProducto"
                                                />
                                                <FontAwesomeIcon
                                                    className="cursor-pointer py-2 -ml-6"
                                                    title="Buscar entre las ordenes de venta"
                                                    icon={faSearch}
                                                    onClick={() => {
                                                        buscarProducto(
                                                            <BuscarProducto
                                                                formData={formDataProductos}
                                                                setFormData={setFormDataProductos}
                                                                setShowModal={setShowModal}
                                                            />)
                                                    }}
                                                />
                                            </div>
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
                                            >
                                                <option>Elige una opción</option>
                                                {map(listMaquinas, (maquina, index) => (
                                                    <option value={maquina?.numeroMaquina}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
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
                                                value={fechaElaboracion}
                                                onChange={e => setFechaElaboracion(e.target.value)} />
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
                                            >
                                                <option >Elige....</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
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
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar información del formulario"
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Registrar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    title="Cerrar el formulario"
                                    className="cancelar"
                                    onClick={() => {
                                        rutaRegreso()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                        <br />
                    </Form>
                </div>
            </Container >

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataClientes() {
    return {
        nombreCliente: ""
    }
}

function initialFormDataProductos() {
    return {
        nombreProducto: "",
        noParte: ""
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

export default RegistraLiberacionProductoProceso;
