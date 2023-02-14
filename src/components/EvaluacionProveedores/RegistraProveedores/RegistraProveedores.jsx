import { useState, useEffect } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { obtenerFolioActualEvaluacionProveedores, registraEvaluacionProveedores, obtenerItemEvaluacionProveedor } from "../../../api/evaluacionProveedores";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faArrowCircleLeft, faSearch, faCirclePlus, faX } from "@fortawesome/free-solid-svg-icons";
import BuscarProveedor from '../../../page/BuscarProveedor';
import BuscarProducto from '../../../page/BuscarProducto';
import BuscarMaterial from "../../../page/BuscarMaterial";
import BasicModal from "../../Modal/BasicModal";
import { map } from "lodash";

function RegistraProveedores(props) {
    const { setRefreshCheckLogin, history } = props;

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    const enrutamiento = useNavigate();

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

    // Ruta para enlazar a pagina de usuarios
    const regresaPagina = () => {
        enrutamiento("/EvaluacionProveedores");
    }

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarProveedor = (content) => {
        setTitulosModal("Buscar proveedor");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarMaterial = (content) => {
        setTitulosModal("Buscar material");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerFolioActualEvaluacionProveedores().then(response => {
                const { data } = response;
                // console.log(data)
                const { noProveedor } = data;
                setFolioActual(noProveedor)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    // Almacena los datos del proveedor
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(initialProveedor());

    // Para guardar los datos del formulario
    const [formDataOC, setFormDataOC] = useState(initialFormDataOC());

    const [productosRequisicion, setProductosRequisicion] = useState();

    const [listProductosCargados, setListProductosCargados] = useState([]);

    // Para agregar productos al listado
    const addItems = () => {
        const folio = document.getElementById("folio").value
        const descripcion = document.getElementById("descripcion").value
        const um = document.getElementById("um").value

        if (!um) {
            toast.warning("Completa la informacion del producto");
        } else {
            const temp = descripcion.split("/");
            
            const dataTemp = {
                folio: folio,
                um: um,
                descripcion: descripcion,
            }
            // console.log(dataTemp)

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );

            // Actualizacion del tracking
            //LogTrackingActualizacion(referencia, "En orden de compra", "3")

            //setCargaProductos(initialFormDataProductos)
            setFormDataOC(initialFormDataOC)
            //document.getElementById("descripcion").value = "Elige una opción"
            //setCargaProductos(initialFormDataProductos)
            //document.getElementById("cantidad").value = "0"

        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        //setCargaProductos(initialFormDataProductos)
        setFormDataOC(initialFormDataOC)
        //setCargaProductos(initialFormDataProductos)
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.folio === producto.folio), 1);
        setListProductosCargados([...newArray]);
    }
    // Termina gestión de los articulos cargados

    const renglon = listProductosCargados.length + 1;

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.tiempoCredito || !formData.tiempoRespuesta || !formData.lugarRecoleccion || !formData.horario || !formData.comentarios) {
            toast.warning("Completa el formulario");
        } else {
            setLoading(true)

            obtenerItemEvaluacionProveedor().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: data.item,
                    folio: folioActual,
                    nombre: proveedorSeleccionado.nombreProveedor,
                    sucursal: getSucursal(),
                    productoServicio: formData.productoServicio,
                    categoria: formData.categoria,
                    personalContacto: proveedorSeleccionado.personalContacto,
                    telefono: proveedorSeleccionado.telefonoProveedor,
                    correo: proveedorSeleccionado.correoProveedor,
                    tiempoCredito: formData.tiempoCredito,
                    tiempoRespuesta: formData.tiempoRespuesta,
                    lugarRecoleccion: formData.lugarRecoleccion,
                    horario: formData.horario,
                    productos: listProductosCargados,
                    servicioProporcionado: formData.servicioProporcionado,
                    comentarios: formData.comentarios,
                    estado: "true"
                }
                // console.log(dataTemp)

                try {
                    registraEvaluacionProveedores(dataTemp).then(response => {
                        const { data } = response;
                        toast.success(data.mensaje)
                        LogsInformativos("Se ha registrado un nuevo proveedor " + formData.nombre, dataTemp)
                        setLoading(false)
                        regresaPagina();
                    }).catch(e => {
                        console.log(e)
                    })
                } catch (e) {
                    console.log(e)
                }
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setProveedorSeleccionado({ ...proveedorSeleccionado, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Registrando evaluación de proveedores
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            onClick={() => {
                                regresaPagina()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>
            <Container fluid>
                <br /><br />

                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        {/* ID proveedor, nombre/servicio, tipo */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridFolio">
                                <Form.Label>
                                    Folio
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="folio"
                                    defaultValue={folioActual}
                                    disabled
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridNombre">
                                <Form.Label>
                                    Nombre del proveedor
                                </Form.Label>
                                <div className="flex items-center mb-1">
                                    <Form.Control
                                        type="text"
                                        name="nombreProveedor"
                                        placeholder="Escribe el nombre"
                                        defaultValue={proveedorSeleccionado.nombreProveedor}
                                    />
                                    <FontAwesomeIcon
                                        className="cursor-pointer py-2 -ml-6"
                                        title="Buscar entre los proveedores"
                                        icon={faSearch}
                                        onClick={() => {
                                            buscarProveedor(
                                                <BuscarProveedor
                                                    formData={proveedorSeleccionado}
                                                    setFormData={setProveedorSeleccionado}
                                                    setShowModal={setShowModal}
                                                />)
                                        }}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridHorario">
                                <Form.Label>
                                    Horario
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="horario"
                                    placeholder="Escribe el horario"
                                    defaultValue={formData.horario}
                                />
                            </Form.Group>
                        </Row>

                        {/* Producto o servicio */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPersonalContacto">
                                <Form.Label>
                                    Personal de contacto
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="personalContacto"
                                    placeholder="Escribe el personal de contacto"
                                    defaultValue={proveedorSeleccionado.personalContacto}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTiempoCredito">
                                <Form.Label>
                                    Tiempo de credito
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="tiempoCredito"
                                    placeholder="Escribe el tiempo"
                                    defaultValue={formData.tiempoCredito}
                                />
                            </Form.Group>

                        </Row>
                        {/* Personal de contacto, telefono, Email */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridTelefono">
                                <Form.Label>
                                    Telefono
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="telefonoProveedor"
                                    placeholder="Escribe el telefono"
                                    defaultValue={proveedorSeleccionado.telefonoProveedor}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCorreo">
                                <Form.Label>
                                    Correo
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="correoProveedor"
                                    placeholder="Escribe el correo"
                                    defaultValue={proveedorSeleccionado.correoProveedor}
                                />
                            </Form.Group>

                        </Row>
                        {/* Tiempo credito, tiempo respuesta, Lugar de recoleccion */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridTiempoRespuesta">
                                <Form.Label>
                                    Tiempo de respuesta
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="tiempoRespuesta"
                                    placeholder="Escribe el tiempo"
                                    defaultValue={formData.tiempoRespuesta}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridLugarRecoleccion">
                                <Form.Label>
                                    Lugar de recolección
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lugarRecoleccion"
                                    placeholder="Escribe el lugar de recolección"
                                    defaultValue={formData.lugarRecoleccion}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col align="left" sm={3}>
                                    <Form.Label>
                                        ¿Que proporciona?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                    <Form.Check
                                        value="Productos"
                                        type="radio"
                                        label="Productos"
                                        name="productoServicio"
                                        id="productos"
                                        defaultValue={formData.productoServicio}
                                    />
                                </Col>
                                <Col sm={1}>
                                </Col>
                                <Col sm={1}>
                                    <Form.Check
                                        value="Servicio"
                                        type="radio"
                                        label="Servicio"
                                        name="productoServicio"
                                        id="Servicios"
                                        defaultValue={formData.productoServicio}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            {
                                formData.productoServicio === "Servicio" &&
                                (
                                    <>
                                        <Form.Group as={Col} controlId="formGridComentarios">
                                            <Form.Label>Descripcion del servicio</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                style={{ height: '100px' }}
                                                type="text"
                                                placeholder="Describe el servicio proporcionado"
                                                name="servicioProporcionado"
                                                defaultValue={formData.servicioProporcionado}
                                            />
                                        </Form.Group>
                                    </>
                                )
                            }
                        </Row>

                        <Row className="mb-3">
                            {
                                formData.productoServicio === "Productos" &&
                                (
                                    <>
                                        <hr />
                                        <Badge bg="secondary" className="tituloFormularioDetalles">
                                            <h4>Buscar el producto que provee</h4>
                                        </Badge>
                                        <br />
                                        <hr />
                                        {/* Cantidad, um, descripción */}
                                        <Row className="mb-3">

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    ITEM
                                                </Form.Label>
                                                <Form.Control
                                                    id="item"
                                                    type="text"
                                                    placeholder="Escribe el ITEM"
                                                    name="ITEM"
                                                    disabled
                                                    value={renglon}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    Folio
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="folio"
                                                    placeholder='Folio'
                                                    name="folioProducto"
                                                    disabled
                                                    defaultValue={formDataOC.folioProdcuto}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                                <Form.Label>
                                                    Descripcion
                                                </Form.Label>
                                                <div className="flex items-center mb-1">
                                                    <Form.Control
                                                        type="text"
                                                        id="descripcion"
                                                        placeholder="Producto"
                                                        defaultValue={formDataOC.nombreProducto}
                                                        name="nombreProducto"
                                                    />
                                                    <FontAwesomeIcon
                                                        className="cursor-pointer py-2 -ml-6"
                                                        title="Buscar entre los productos"
                                                        icon={faSearch}
                                                        onClick={() => {
                                                            buscarMaterial(
                                                                <BuscarMaterial
                                                                    formData={formDataOC}
                                                                    setFormData={setFormDataOC}
                                                                    setShowModal={setShowModal}
                                                                />)
                                                        }}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    UM
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="um"
                                                    placeholder="UM"
                                                    name="um"
                                                    defaultValue={formDataOC.um}
                                                />
                                            </Form.Group>

                                            <Col sm="1">
                                                <Form.Group as={Row} className="formGridCliente">
                                                    <Form.Label>
                                                        &nbsp;
                                                    </Form.Label>

                                                    <Col>
                                                        <Button
                                                            variant="success"
                                                            title="Guardar datos del producto"
                                                            className="editar"
                                                            onClick={() => {
                                                                addItems()
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            variant="danger"
                                                            title="Limpiar los datos del producto"
                                                            className="editar"
                                                            onClick={() => {
                                                                cancelarCargaProducto()
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faX} className="text-lg" />
                                                        </Button>
                                                    </Col>

                                                </Form.Group>
                                            </Col>

                                        </Row>

                                        <hr />

                                        <Badge bg="secondary" className="tituloFormularioDetalles">
                                            <h4>Listado de artículos agregados</h4>
                                        </Badge>
                                        <br />
                                        <hr />
                                        {/* Inicia tabla informativa del listado de articulos */}
                                        <table className="responsive-tableRegistroVentas"
                                        >
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Folio</th>
                                                    <th scope="col">Descripción</th>
                                                    <th scope="col">UM</th>
                                                    <th scope="col">Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                            </tfoot>
                                            <tbody>
                                                {map(listProductosCargados, (producto, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">
                                                            {index + 1}
                                                        </td>
                                                        <td data-title="Folio">
                                                            {producto.folio}
                                                        </td>
                                                        <td data-title="Descripción">
                                                            {producto.descripcion}
                                                        </td>
                                                        <td data-title="UM">
                                                            {producto.um}
                                                        </td>
                                                        <td data-title="Eliminar">
                                                            <div
                                                                className="eliminarProductoListado"
                                                                title="Eliminar el producto agregado"
                                                                onClick={() => {
                                                                    removeItem(producto)
                                                                }}
                                                            >
                                                                ❌
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )
                            }
                        </Row>

                        {/*  horario, comentarios */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridComentarios">
                                <Form.Label>Comentarios</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    style={{ height: '100px' }}
                                    type="text"
                                    placeholder="Escribe los comentarios"
                                    name="comentarios"
                                    defaultValue={formData.comentarios}
                                />
                            </Form.Group>
                        </Row>

                        {/* Botones de acciones */}
                        <Form.Group as={Row} className="botones">
                            <Row>
                                <Col>
                                    <Button
                                        type="submit"
                                        title="Guardar la información del formulario"
                                        variant="success"
                                        className="registrar"
                                    >
                                        {!loading ? "Guardar" : <Spinner animation="border" />}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant="danger"
                                        title="Cerrar el formulario"
                                        className="registrar"
                                        onClick={() => {
                                            regresaPagina()
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
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataOC() {
    return {
        nombreProducto: "",
        folioProdcuto: "",
        um: ""
    }
}

function initialProveedor() {
    return {
        proveedor: "",
        correoProveedor: "",
        telefonoProveedor: "",
        nombreProveedor: "",
        personalContacto: ""
    }
}

function initialFormData() {
    return {
        nombre: "",
        productoServicio: "",
        servicioProporcionado: "",
        categoria: "",
        personalContacto: "",
        telefono: "",
        correo: "",
        tiempoCredito: "",
        tiempoRespuesta: "",
        lugarRecoleccion: "",
        horario: "",
        comentarios: ""
    }
}

export default RegistraProveedores;
