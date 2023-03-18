import { useState, useEffect } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { map } from "lodash";
import { listarPedidosVenta } from "../../../api/pedidoVenta";
import { obtenerNumeroRequisicion, actualizaRequisiciones, obtenerItem, obtenerRequisiciones } from "../../../api/requisicion";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import BuscarDepartamento from '../../../page/BuscarDepartamento';
import BasicModal from "../../Modal/BasicModal";
import BuscarMaterial from '../../../page/BuscarMaterial';
import BuscarOV from '../../../page/BuscarOV';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos, LogsInformativosLogout } from '../../Logs/LogsSistema/LogsSistema';
import ModificacionProductos from '../ModificacionProductos';

function ModificaRequisiciones(props) {
    const { setRefreshCheckLogin } = props;

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

    // Para la eliminacion fisica de usuarios
    const modificaProducto = (content) => {
        setTitulosModal("Modificando el producto");
        setContentModal(content);
        setShowModal(true);
    }

    const params = useParams();
    const { id } = params

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataVenta, setFormDataVenta] = useState(initialFormDataVenta());

    // Para guardar los datos del formulario
    const [departamentoElegido, setDepartamentoElegido] = useState(initialDepartamento());

    // Para guardar los datos de los articulos
    const [formDataArticulos, setFormDataArticulos] = useState(initialFormDataArticulos());

    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    const [listProductosCargados, setListProductosCargados] = useState([]);

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/Requisiciones")
    }

    // Para almacenar la OV
    const [ordenVenta, setOrdenVenta] = useState("");
    // Para almacenar el cliente de la OV
    const [clienteOV, setClienteOV] = useState("");

    const [cantidadRequeridaOV, setCantidadRequeridaOV] = useState("");

    // Para almacenar la OV
    const [ordenVentaPrincipal, setOrdenVentaPrincipal] = useState("");

    const [producto, setProducto] = useState([]);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarDepartamento = (content) => {
        setTitulosModal("Buscar departamento");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarMaterial = (content) => {
        setTitulosModal("Buscar material");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarInsumo = (content) => {
        setTitulosModal("Buscar insumo");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarOV = (content) => {
        setTitulosModal("Buscar Orden de Venta");
        setContentModal(content);
        setShowModal(true);
    }

    const cargarDatosRequisicion = () => {
        //
        obtenerRequisiciones(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(valoresAlmacenados(data))
            // setFechaCreacion(fechaElaboracion)
            setListProductosCargados(data.productosSolicitados)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarDatosRequisicion();
    }, []);

    // Para agregar productos al listado
    const addItems = () => {
        const folio = document.getElementById("folio").value
        const cantidad = document.getElementById("cantidad").value
        const um = document.getElementById("um").value
        const descripcion = document.getElementById("descripcion").value
        const referencia = document.getElementById("referencia").value
        const precioUnitario = document.getElementById("precioUnitario").value
        const requisicion = formData.folio

        if (!cantidad || !um || !descripcion || !precioUnitario || !referencia) {
            toast.warning("Completa la informacion del producto");
        } else {
            const dataTemp = {
                folio: folio,
                cantidad: cantidad,
                um: um,
                descripcion: descripcion,
                referencia: referencia,
                precioUnitario: precioUnitario,
                requisicion: requisicion,
                subtotal: parseFloat(precioUnitario) * parseFloat(cantidad)
            }

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );

            setFormDataArticulos(initialFormDataArticulos)
            setFormDataVenta(initialFormDataVenta);
            //setCargaProductos(initialFormDataProductos)
            document.getElementById("cantidad").value = "0"
            setOrdenVenta("")
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        //setCargaProductos(initialFormDataProductos)
        setFormDataArticulos(initialFormDataArticulos)
        setFormDataVenta(initialFormDataVenta);
        //setCargaProductos(initialFormDataProductos)
        document.getElementById("cantidad").value = "0"
        setOrdenVenta("")
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.descripcion === producto.descripcion), 1);
        setListProductosCargados([...newArray]);
    }
    // Termina gestión de los articulos cargados

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.solicitante || !formData.fechaElaboracion) {
            toast.warning("Completa el formulario");
        } else {

            setLoading(true)

            // console.log(dataTemp)
            try {
                const dataTemp = {
                    fechaElaboracion: formData.fechaElaboracion,
                    fechaRequisicion: formData.fechaRequisicion,
                    solicitante: formData.solicitante,
                    aprobo: formData.aprobo,
                    comentarios: formData.comentarios,
                    departamento: departamentoElegido.departamento == "" ? formData.departamento : departamentoElegido.departamento,
                    tipoRequisicion: formData.tipoRequisicion,
                    tipoAplicacion: formData.tipoAplicacion,
                    productosSolicitados: listProductosCargados,
                }
                // console.log(data)
                actualizaRequisiciones(id, dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    LogsInformativos("Se ha actualizado la requisición " + id, dataTemp);
                    toast.success(mensaje)
                    //LogsInformativos(`Se han actualizado los datos de la orden de compra con folio ${data.noCompra}`, datos)
                    setLoading(false)
                    rutaRegreso()
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
        setFormDataArticulos({ ...formDataArticulos, [e.target.name]: e.target.value })
    }

    const renglon = listProductosCargados.length + 1;

    // Calcula el subtotal de la lista de artículos cargados
    const subTotal = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.subtotal)), 0);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva requisición
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

            <Container>
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el folio"
                                name="folio"
                                value={formData.folio}
                                disabled
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Fecha de elaboración
                            </Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Escribe la fecha"
                                name="fechaElaboracion"
                                defaultValue={formData.fechaElaboracion}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Solicitante
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe solicitante"
                                name="solicitante"
                                defaultValue={formData.solicitante}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Departamento
                            </Form.Label>
                            <div className="flex items-center mb-1">
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe el departamento"
                                    name="departamento"
                                    value={departamentoElegido.departamento == "" ? formData.departamento : departamentoElegido.departamento}
                                    disabled
                                >
                                </Form.Control>
                                <FontAwesomeIcon
                                    className="cursor-pointer py-2 -ml-6"
                                    title="Buscar entre los departamentos"
                                    icon={faSearch}
                                    onClick={() => {
                                        buscarDepartamento(
                                            <BuscarDepartamento
                                                formData={departamentoElegido}
                                                setFormData={setDepartamentoElegido}
                                                setShowModal={setShowModal}
                                            />)
                                    }}
                                />
                            </div>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Tipo de requisicion
                            </Form.Label>
                            <Form.Control
                                as="select"
                                name="tipoRequisicion"
                                defaultValue={formData.tipoRequisicion}
                            >
                                <option >Elige....</option>
                                <option value="Materiales" selected={formData.tipoRequisicion == "Materiales"}>Materiales</option>
                                <option value="Insumos" selected={formData.tipoRequisicion == "Insumos"}>Insumos</option>
                            </Form.Control>
                        </Form.Group>

                        {formData.tipoRequisicion == "Materiales" && (
                            <>
                                <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                                    <Form.Label>
                                        Tipo de Aplicacion
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="tipoAplicacion"
                                        defaultValue={formData.tipoAplicacion}
                                    >
                                        <option >Elige....</option>
                                        <option value="Orden Venta" selected={formData.tipoAplicacion == "Orden Venta"}>Orden venta</option>
                                        <option value="Stock" selected={formData.tipoAplicacion == "Stock"}>Stock</option>
                                    </Form.Control>
                                </Form.Group>
                            </>
                        )}
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                ¿Cuando se require?
                            </Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Escribe la fecha"
                                name="fechaRequisicion"
                                defaultValue={formData.fechaRequisicion}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <hr />
                    <Badge bg="secondary" className="tituloFormularioDetalles">
                        <h4>A continuación, especifica los detalles del artículo y agregalo</h4>
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

                        <Form.Group as={Col} controlId="formGridCliente">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                id="folio"
                                type="text"
                                placeholder="Folio"
                                name="folio"
                                defaultValue={formDataArticulos.folio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                Descripcion
                            </Form.Label>
                            <div className="flex items-center mb-1">
                                <Form.Control
                                    id="descripcion"
                                    type="text"
                                    placeholder="Escribe la descripcion"
                                    name="descripcion"
                                    defaultValue={formDataArticulos.descripcion}
                                />
                                {formData.tipoRequisicion == "Materiales" && (
                                    <>
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            icon={faSearch}
                                            title="Buscar entre los materiales"
                                            onClick={() => {
                                                buscarMaterial(
                                                    <BuscarMaterial
                                                        formData={formDataArticulos}
                                                        setFormData={setFormDataArticulos}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        />
                                    </>
                                )}
                                {formData.tipoRequisicion == "Insumos" && (
                                    <>
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre los insumos"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarInsumo(
                                                    <BuscarMaterial
                                                        formData={formDataArticulos}
                                                        setFormData={setFormDataArticulos}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                UM
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="UM"
                                id="um"
                                name="um"
                                defaultValue={formDataArticulos.um}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                Cantidad
                            </Form.Label>
                            <Form.Control
                                id="cantidad"
                                type="number"
                                min="0"
                                placeholder="Escribe la cantidad"
                                name="cantidad"
                                defaultValue={formDataArticulos.cantidad}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCliente">
                            <Form.Label>
                                Precio
                            </Form.Label>
                            <Form.Control
                                id="precioUnitario"
                                type="number"
                                placeholder="Precio unitario"
                                name="precioUnitario"
                                defaultValue={formDataArticulos.precioUnitario}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCliente">
                            <Form.Label>
                                Subtotal
                            </Form.Label>
                            <Form.Control
                                id="subtotal"
                                type="text"
                                placeholder="Total"
                                name="subtotal"
                                value={parseFloat(formDataArticulos.cantidad) * parseFloat(formDataArticulos.precioUnitario)}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            {formData.tipoRequisicion == "Materiales" && formData.tipoAplicacion == "Orden Venta" && (
                                <>
                                    <Form.Label>
                                        Aplicación
                                    </Form.Label>
                                    <div className="flex items-center mb-1">
                                        <Form.Control
                                            id="referencia"
                                            type="text"
                                            defaultValue={formDataVenta.ordenVenta}
                                            name="referencia"
                                        />
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre las ordenes de venta"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarOV(
                                                    <BuscarOV
                                                        setFormData={setFormDataVenta}
                                                        setOrdenVentaPrincipal={setOrdenVentaPrincipal}
                                                        setProducto={setProducto}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {formData.tipoRequisicion == "Materiales" && formData.tipoAplicacion == "Stock" && (
                                <>
                                    <Form.Label>
                                        Aplicación
                                    </Form.Label>
                                    <Form.Control
                                        id="referencia"
                                        type="text"
                                        value="Stock"
                                        name="referencia"
                                        disabled
                                    />
                                </>
                            )}

                            {formData.tipoRequisicion == "Insumos" && (
                                <>
                                    <Form.Label>
                                        Aplicación
                                    </Form.Label>
                                    <Form.Control
                                        id="referencia"
                                        type="text"
                                        value="Stock"
                                        name="referencia"
                                        disabled
                                    />
                                </>
                            )}
                        </Form.Group>

                        <Col sm="1">
                            <Form.Group as={Row} className="formGridCliente">
                                <Form.Label>
                                    &nbsp;
                                </Form.Label>

                                <Col>
                                    <Button
                                        variant="success"
                                        title="Agregar el producto"
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
                                        title="Cancelar el producto"
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
                                <th scope="col">Descripcion</th>
                                <th scope="col">UM</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Subtotal</th>
                                <th scope="col">Requisición</th>
                                <th scope="col">Referencia</th>
                                <th scope="col">Acciones</th>
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
                                    <td data-title="Cantidad">
                                        {producto.descripcion}
                                    </td>
                                    <td data-title="UM">
                                        {producto.um}
                                    </td>
                                    <td data-title="Descripción">
                                        {producto.cantidad}
                                    </td>
                                    <td data-title="Precio unitario">
                                        <>
                                            {producto.precioUnitario ? new Intl.NumberFormat('es-MX', {
                                                style: "currency",
                                                currency: "MXN"
                                            }).format(producto.precioUnitario) : "No disponible"}
                                            { } MXN
                                        </>
                                    </td>
                                    <td data-title="Subtotal">
                                        <>
                                            {producto.subtotal ? new Intl.NumberFormat('es-MX', {
                                                style: "currency",
                                                currency: "MXN"
                                            }).format(producto.subtotal) : "No disponible"}
                                            { } MXN
                                        </>
                                    </td>
                                    <td data-title="Requisicion">
                                        {producto.requisicion}
                                    </td>
                                    <td data-title="Referencia">
                                        {producto.referencia}
                                    </td>
                                    <td data-title="Eliminar">
                                        <Badge
                                            bg="success"
                                            title="Modificar"
                                            className="editar"
                                            onClick={() => {
                                                modificaProducto(
                                                    <ModificacionProductos
                                                        datos={producto}
                                                        setShowModal={setShowModal}
                                                        listProductosCargados={listProductosCargados}
                                                        setListProductosCargados={setListProductosCargados}
                                                    />)
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                                        </Badge>
                                        <Badge
                                            bg="danger"
                                            title="Eliminar"
                                            className="eliminar"
                                            onClick={() => {
                                                removeItem(producto)
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Termina tabla informativa del listado de articulos */}

                    <Row>
                        <Col xs={12} md={8}>
                        </Col>
                        <Col xs={6} md={4}>
                            {/* Subtotal */}
                            <Row>
                                <Col>Valor total sin IVA</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(subTotal)} MXN
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <hr />
                    <Badge bg="secondary" className="tituloFormularioDetalles">
                        <h4>Para uso exclusivo del departamento de compras</h4>
                    </Badge>

                    <Row className="mb-3">
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Aprobo
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe aprobador"
                                name="aprobo"
                                defaultValue={formData.aprobo}
                            //disabled={departamentoUsuario !== "Compras"}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Comentarios
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Escribe el departamento"
                                name="comentarios"
                                defaultValue={formData.comentarios}
                                style={{ height: '100px' }}
                            //disabled={departamentoUsuario !== "Compras"}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>


                    <Form.Group as={Row} className="botones">
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
                                className="cancelar"
                                onClick={() => {
                                    rutaRegreso()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataVenta() {
    return {
        ordenVenta: "",
    }
}

function initialFormData() {
    return {
        folio: "",
        fechaElaboracion: "",
        fechaRequisicion: "",
        solicitante: "",
        aprobo: "",
        departamento: "",
        tipoRequisicion: "",
        tipoAplicacion: "",
        estado: "",
        comentarios: "",
    }
}

function initialDepartamento() {
    return {
        departamento: ""
    }
}

function valoresAlmacenados(data) {
    return {
        folio: data.folio,
        fechaElaboracion: data.fechaElaboracion,
        fechaRequisicion: data.fechaRequisicion,
        solicitante: data.solicitante,
        aprobo: data.aprobo,
        tipoRequisicion: data.tipoRequisicion,
        tipoAplicacion: data.tipoAplicacion,
        departamento: data.departamento,
        estado: data.estado,
        comentarios: data.comentarios,
    }
}

function initialFormDataArticulos() {
    return {
        folio: "",
        cantidad: "",
        um: "",
        descripcion: "",
        referencia: "",
        proveedor: "",
        precioUnitario: ""
    }
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

function formatModelOrdenesVenta(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaElaboracion: data.fechaElaboracion,
            entrega: data.entrega,
            cliente: data.cliente,
            credito: data.credito,
            recibe: data.recibe,
            condicionesGenerales: data.condicionesGenerales,
            tiemposEntrega: data.tiemposEntrega,
            lugarEntrega: data.lugarEntrega,
            productos: data.productos,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ModificaRequisiciones;
