import { useState, useEffect } from 'react';
import { Alert, Button, Col, Row, Form, Container, Image, Badge, Spinner } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { map } from "lodash";
import "./VistaPreviaRequisiciones.scss";
import { listarPedidosVenta } from "../../../api/pedidoVenta";
import { obtenerNumeroRequisicion, actualizaRequisiciones, obtenerItem, obtenerRequisiciones } from "../../../api/requisicion";
import { toast } from "react-toastify";
import { obtenerUsuario } from "../../../api/usuarios";
import BuscarDepartamento from '../../../page/BuscarDepartamento';
import BasicModal from "../../Modal/BasicModal";
import BuscarMaterial from '../../../page/BuscarMaterial';
import BuscarInsumos from '../../../page/BuscarInsumos';
import BuscarOV from '../../../page/BuscarOV';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos } from '../../Logs/LogsSistema/LogsSistema';
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaRequisiciones(props) {
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
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Requisiciones")
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

    useEffect(() => {
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
    }, []);

    // Para almacenar el listado de ordenes de venta
    const [listOrdenesVenta, setListOrdenesVenta] = useState(null);

    useEffect(() => {
        try {
            listarPedidosVenta().then(response => {
                const { data } = response;
                // console.log(data);
                if (!listOrdenesVenta && data) {
                    setListOrdenesVenta(formatModelOrdenesVenta(data));
                } else {
                    const datosOV = formatModelOrdenesVenta(data);
                    setListOrdenesVenta(datosOV);
                }

            }).catch((e) => {
                //console.log(e)
                if (e.message === "Network Error") {
                    toast.error("Conexión a Internet no Disponible");
                    // setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para agregar productos al listado
    const addItems = () => {
        const folio = document.getElementById("folio").value
        const cantidad = document.getElementById("cantidad").value
        const um = document.getElementById("um").value
        const descripcion = document.getElementById("descripcion").value
        const referencia = document.getElementById("referencia").value
        const precioUnitario = document.getElementById("precioUnitario").value

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

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroRequisicion().then(response => {
                const { data } = response;
                console.log(data)
                const { noRequisicion } = data;
                setFolioActual(noRequisicion)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

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
                                disabled
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
                                disabled
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                            <Form.Label>
                                Departamento
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el departamento"
                                name="departamento"
                                value={departamentoElegido.departamento == "" ? formData.departamento : departamentoElegido.departamento}
                                disabled
                            >
                            </Form.Control>
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
                                disabled
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
                                        disabled
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
                                disabled
                            >
                            </Form.Control>
                        </Form.Group>
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
                                <th scope="col">Referencia</th>
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
                                    <td data-title="Referencia">
                                        {producto.referencia}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Termina tabla informativa del listado de articulos */}

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
                                disabled
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
                                disabled
                            //disabled={departamentoUsuario !== "Compras"}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

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

export default VistaPreviaRequisiciones;
