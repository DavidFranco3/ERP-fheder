import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row, Spinner, Alert, Container, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { actualizaEvaluacionProveedores, obtenerEvaluacionProveedores } from "../../../api/evaluacionProveedores";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faArrowCircleLeft, faSearch, faCirclePlus, faX } from "@fortawesome/free-solid-svg-icons";
import BuscarProveedor from '../../../page/BuscarProveedor';
import BuscarProducto from '../../../page/BuscarProducto';
import BuscarMaterial from "../../../page/BuscarMaterial";
import BasicModal from "../../Modal/BasicModal";
import { map } from "lodash";

function ModificaProveedores(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useNavigate();

    const params = useParams();
    const { id } = params;

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Ruta para enlazar a pagina de usuarios
    const regresaPagina = () => {
        enrutamiento("/EvaluacionProveedores");
    }
    // Para almacenar la informacion
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(initialProveedor());

    const [listProductosCargados, setListProductosCargados] = useState([]);

    // Para guardar los datos del formulario
    const [formDataOC, setFormDataOC] = useState(initialFormDataOC());

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

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

    // Para validar si hay conexion a internet o la api
    const [conexionInternet, setConexionInternet] = useState(true);

    const cargarDatosEvaluacion = () => {
        try {
            obtenerEvaluacionProveedores(id).then(response => {
                const { data } = response;

                //console.log(data);
                setFormData(initialFormDataFinal(data));
                setListProductosCargados(data.productos);
                setProveedorSeleccionado(initialProveedorFinal(data));

            }).catch((e) => {
                //console.log(e)
                if (e.message == 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    regresaPagina();
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosEvaluacion();
    }, []);

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
        document.getElementById("descripcion").value = "Elige una opción"
        //setCargaProductos(initialFormDataProductos)
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.descripcion === producto.descripcion), 1);
        setListProductosCargados([...newArray]);
    }
    // Termina gestión de los articulos cargados

    const renglon = listProductosCargados.length + 1;

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.tiempoCredito || !formData.tiempoRespuesta || !formData.lugarRecoleccion || !formData.horario || !formData.comentarios) {
            toast.warning("Completa el formulario");
        } else {
            const dataTemp = {
                nombre: proveedorSeleccionado.nombreProveedor,
                productoServicio: formData.productoServicio,
                categoria: formData.categoria,
                personalContacto: proveedorSeleccionado.personalContacto,
                telefono: proveedorSeleccionado.telefonoProveedor,
                correo: proveedorSeleccionado.correoProveedor,
                tiempoCredito: formData.tiempoCredito,
                tiempoRespuesta: formData.tiempoRespuesta,
                lugarRecoleccion: formData.lugarRecoleccion,
                horario: formData.horario,
                comentarios: formData.comentarios,
                productos: listProductosCargados,
                servicioProporcionado: formData.servicioProporcionado,
            }

            setLoading(true)
            try {
                actualizaEvaluacionProveedores(id, dataTemp).then(response => {
                    const { data } = response;
                    toast.success(data.mensaje)
                    LogsInformativos("Se ha modificado la información del proveedor " + formData.nombre, dataTemp)
                    setLoading(false)
                    regresaPagina();
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
        setProveedorSeleccionado({ ...proveedorSeleccionado, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Modificando evaluación de proveedores
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
                    <Form onSubmit={onSubmit} onChange={onChange}>

                        {/* ID proveedor, nombre/servicio, tipo */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridFolio">
                                <Form.Label>
                                    Folio
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="folio"
                                    defaultValue={formData.folio}
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
                                        name="nombre"
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
                                    name="correo"
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
                                        checked={formData.productoServicio == "Productos"}
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
                                        checked={formData.productoServicio == "Servicio"}
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
                                                        <th scope="row">
                                                            {index + 1}
                                                        </th>
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
                                <Form.Control as="textarea" rows={3}
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
                                        title="Actualizar el registro"
                                        variant="success"
                                        className="registrar"
                                    >
                                        {!loading ? "Modificar" : <Spinner animation="border" />}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant="danger"
                                        title="Cerrar el formulario"
                                        className="registrar"
                                        onClick={() => {
                                            regresaPagina();
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

function initialFormData(data) {
    return {
        folio: "",
        nombre: "",
        productoServicio: "",
        categoria: "",
        personalContacto: "",
        telefono: "",
        correo: "",
        tiempoCredito: "",
        tiempoRespuesta: "",
        lugarRecoleccion: "",
        servicioProporcionado: "",
        horario: "",
        comentarios: ""
    }
}

function initialFormDataFinal(data) {
    const { folio, nombre, tipo, productoServicio, servicioProporcionado, categoria, personalContacto, telefono, correo, tiempoCredito, tiempoRespuesta, lugarRecoleccion, horario, comentarios } = data;

    return {
        folio: folio,
        nombre: nombre,
        servicioProporcionado: servicioProporcionado,
        productoServicio: productoServicio,
        categoria: categoria,
        personalContacto: personalContacto,
        telefono: telefono,
        correo: correo,
        tiempoCredito: tiempoCredito,
        tiempoRespuesta: tiempoRespuesta,
        lugarRecoleccion: lugarRecoleccion,
        horario: horario,
        comentarios: comentarios
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

function initialProveedorFinal(data) {
    return {
        proveedor: "",
        correoProveedor: data.correo,
        telefonoProveedor: data.telefono,
        nombreProveedor: data.nombre,
        personalContacto: data.personalContacto
    }
}

function initialFormDataOC() {
    return {
        nombreProducto: "",
        folioProdcuto: "",
        um: ""
    }
}

export default ModificaProveedores;
