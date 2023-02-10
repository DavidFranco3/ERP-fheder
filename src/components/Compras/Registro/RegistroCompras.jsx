import { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Image, Row, Spinner, Table, Badge } from "react-bootstrap";
import { map } from "lodash";
import "./RegistroCompras.scss"
import { listarEvaluacionProveedores } from "../../../api/evaluacionProveedores";
import { toast } from "react-toastify";
import { obtenerNumeroOrdenCompra, registraOrdenCompra, obtenerItem } from "../../../api/compras";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { listarPedidosVenta } from "../../../api/pedidoVenta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";
import BuscarProveedor from '../../../page/BuscarProveedor';
import BasicModal from "../../Modal/BasicModal";
import BuscarMaterial from '../../../page/BuscarMaterial';
import BuscarInsumos from '../../../page/BuscarInsumos';
import BuscarOV from '../../../page/BuscarOV';
import BuscarRequisicion from '../../../page/BuscarRequisicion';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";

function RegistroCompras(props) {
    const { setRefreshCheckLogin } = props;

    // Para definir el uso de la animación
    const [loading, setLoading] = useState(false);

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
    // Para definir la ruta de regreso a compras
    const regresaCompras = () => {
        enrutamiento.push("/Compras")
    }

    // Para guardar los datos del formulario
    const [formDataOC, setFormDataOC] = useState(initialFormDataOC());

    const [productosRequisicion, setProductosRequisicion] = useState();

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
    const buscarRequisicion = (content) => {
        setTitulosModal("Buscar requisicion");
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

    // Para almacenar el listado de ordenes de venta
    const [listOrdenesVenta, setListOrdenesVenta] = useState(null);

    // Para almacenar la OV
    const [ordenVentaPrincipal, setOrdenVentaPrincipal] = useState("");

    const [producto, setProducto] = useState([]);

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

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroOrdenCompra().then(response => {
                const { data } = response;
                // console.log(data)
                const { noCompra } = data;
                setFolioActual(noCompra)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    useEffect(() => {
        try {
            obtenerItem().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItemActual(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar el listado de proveedores
    const [listProveedores, setListProveedores] = useState(null);

    useEffect(() => {
        try {
            listarEvaluacionProveedores().then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarEvaluacionProveedores() && data) {
                    setListProveedores(formatModelProveedores(data));
                } else {
                    const datosProveedores = formatModelProveedores(data);
                    setListProveedores(datosProveedores);
                }

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(initialProveedor());

    // Para guardar los datos de los articulos
    const [formDataArticulos, setFormDataArticulos] = useState(initialFormDataArticulos());

    const [listProductosCargados, setListProductosCargados] = useState([]);

    // Para almacenar la OV
    const [ordenVenta, setOrdenVenta] = useState("");
    // Para almacenar el cliente de la OV
    const [clienteOV, setClienteOV] = useState("");

    const [cantidadRequeridaOV, setCantidadRequeridaOV] = useState("");

    const [totalUnitario, setTotalUnitario] = useState(0);

    const calcularTotalUnitario = () => {
        const cantidad = document.getElementById("cantidad").value;
        const precio = document.getElementById("precio").value;
        const total = parseFloat(cantidad) * parseFloat(precio);
        setTotalUnitario(total);
    }

    // Inicia gestión de los articulos cargados
    // Para agregar productos al listado
    const addItems = () => {
        const cantidad = document.getElementById("cantidad").value
        const folio = document.getElementById("folio").value
        const um = document.getElementById("um").value
        const descripcion = document.getElementById("descripcion").value
        const precio = document.getElementById("precio").value
        const referencia = document.getElementById("referencia").value

        if (!cantidad || !um || !descripcion || !precio || !referencia) {
            toast.warning("Completa la informacion del producto");
        } else {
            const temp = descripcion.split("/");

            const dataTemp = {
                folio: folio,
                cantidad: cantidad,
                um: um,
                descripcion: temp[2],
                precio: precio,
                referencia: referencia,
                subtotal: parseInt(cantidad) * parseInt(precio)
            }
            // console.log(dataTemp)

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );

            // Actualizacion del tracking
            LogTrackingActualizacion(referencia, "En orden de compra", "3")

            //setCargaProductos(initialFormDataProductos)
            setFormDataArticulos(initialFormDataArticulos)
            document.getElementById("descripcion").value = "Elige una opción"
            //setCargaProductos(initialFormDataProductos)
            //document.getElementById("cantidad").value = "0"

        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        //setCargaProductos(initialFormDataProductos)
        setFormDataArticulos(initialFormDataArticulos)
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

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.autorizo) {
            toast.warning("Completa el formulario");
        } else {

            setLoading(true)

            // console.log(dataTemp)
            try {
                obtenerNumeroOrdenCompra().then(response => {
                    const { data } = response;
                    const dataTemp = {
                        item: itemActual,
                        folio: data.noCompra,
                        sucursal: getSucursal(),
                        proveedor: proveedorSeleccionado.proveedor,
                        requisicion: formDataOC.requisicion,
                        nombreProveedor: proveedorSeleccionado.nombreProveedor,
                        fechaSolicitud: fechaSolicitud,
                        fechaEntrega: fechaEntrega,
                        autoriza: formData.autorizo,
                        tipoCompra: formData.tipoCompra,
                        departamento: "Compras",
                        productos: listProductosCargados,
                        subtotal: subTotal,
                        iva: IVA,
                        total: total,
                        estado: "true"
                    }
                    // console.log(data)
                    registraOrdenCompra(dataTemp).then(response => {
                        const { data: { mensaje, datos } } = response;
                        // console.log(response)
                        toast.success(mensaje)
                        LogsInformativos("Se han actualizado los datos de la orden de compra con folio " + dataTemp.folio, dataTemp)
                        setLoading(false)
                        regresaCompras()
                    }).catch(e => {
                        console.log(e)
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
        setFormDataArticulos({ ...formDataArticulos, [e.target.name]: e.target.value })
    }

    const [productoCargado, setProductoCargado] = useState("");

    useEffect(() => {
        setProductoCargado(formDataArticulos.descripcion)
        const dataTempProductos = productoCargado.split("/")
        const dataTemp = {
            folio: dataTempProductos[0],
            cantidad: dataTempProductos[1],
            um: dataTempProductos[5],
            precioUnitario: dataTempProductos[3],
            referencia: dataTempProductos[6]
        }
        setFormDataArticulos(cargaFormDataArticulos(dataTemp))
    }, [formDataArticulos.descripcion]);

    // Calcula el subtotal de la lista de artículos cargados
    const subTotal = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.subtotal)), 0);

    //Calcula el IVA de la lista de productos agregados
    const IVA = parseFloat(subTotal * 0.16);

    // Calcula el total con iva de la lista de productos seleccionados
    const total = subTotal + (subTotal * 0.16);

    const renglon = listProductosCargados.length + 1;

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaSolicitud, setFechaSolicitud] = useState(fecha);

    const [fechaEntrega, setFechaEntrega] = useState(fecha);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva orden de compra
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
                            onClick={() => {
                                regresaCompras()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <Container fluid>
                <Form onChange={onChange} onSubmit={onSubmit}>
                    {/* Inicio del encabdezado de la solicitud */}
                    {/* Folio, proveedor , fecha de elaboración */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>
                                Folio
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Folio de la orden de compra"
                                name="folio"
                                defaultValue={folioActual}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Requisicion
                            </Form.Label>
                            <div className="flex items-center mb-1">
                                <Form.Control
                                    type="text"
                                    placeholder="Requisicion"
                                    defaultValue={formDataOC.requisicion}
                                    name="requisicion"
                                />
                                <FontAwesomeIcon
                                    className="cursor-pointer py-2 -ml-6"
                                    title="Buscar entre los productos"
                                    icon={faSearch}
                                    onClick={() => {
                                        buscarRequisicion(
                                            <BuscarRequisicion
                                                formData={formDataOC}
                                                setFormData={setFormDataOC}
                                                productosRequisicion={productosRequisicion}
                                                setProductosRequisicion={setProductosRequisicion}
                                                setShowModal={setShowModal}
                                            />)
                                    }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>Fecha de solicitud</Form.Label>

                            <Form.Control
                                className="mb-3"
                                type="date"
                                value={fechaSolicitud}
                                placeholder="Fecha de solicitud"
                                onChange={e => setFechaSolicitud(e.target.value)}
                                name="fechaSolicitud"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>
                                Proveedor
                            </Form.Label>
                            <div className="flex items-center mb-1">
                                <Form.Control
                                    type="text"
                                    placeholder='Proveedor'
                                    defaultValue={proveedorSeleccionado.nombreProveedor}
                                    name="proveedor"
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

                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>Fecha de entrega</Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="date"
                                value={fechaEntrega}
                                onChange={e => setFechaEntrega(e.target.value)}
                                placeholder="Fecha de entrega"
                                name="fechaEntrega"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>Autorizó</Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="text"
                                defaultValue={formData.autorizo}
                                placeholder="Autorizó"
                                name="autorizo"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label align="center">
                                Compra de
                            </Form.Label>

                            <Form.Control
                                as="select"
                                name="tipoCompra"
                                defaultValue={formData.tipoCompra}
                            >
                                <option >Elige....</option>
                                <option value="Material">Material</option>
                                <option value="Insumos">Insumos</option>
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

                        <Form.Group as={Col}>
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                id="folio"
                                placeholder='Folio'
                                name="folio"
                                disabled
                                defaultValue={formDataArticulos.folio}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Descripcion
                            </Form.Label>
                            <Form.Control
                                id="descripcion"
                                as="select"
                                defaultValue={formDataArticulos.descripcion}
                                name="descripcion"
                            >
                                <option>Elige una opción</option>
                                {map(productosRequisicion, (productos, index) => (
                                    <option
                                        key={index}
                                        value={productos?.folio + "/" + productos?.cantidad + "/" + productos?.descripcion + "/" + productos?.precioUnitario + "/" + productos?.subtotal + "/" + productos?.um + "/" + productos?.referencia}
                                    >
                                        {productos?.descripcion}
                                    </option>
                                ))}
                            </Form.Control>
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

                        <Form.Group as={Col}>
                            <Form.Label>
                                Precio
                            </Form.Label>
                            <Form.Control
                                id="precio"
                                type="number"
                                min="0"
                                name="precio"
                                placeholder="Escribe el precio"
                                defaultValue={formDataArticulos.precio}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                Subtotal
                            </Form.Label>
                            <Form.Control
                                id="subtotal"
                                type="number"
                                min="0"
                                name="subtotal"
                                placeholder="Escribe el subtotal"
                                disabled
                                value={parseFloat(formDataArticulos.precio) * parseFloat(formDataArticulos.cantidad)}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                Referencia
                            </Form.Label>
                            <Form.Control
                                id="referencia"
                                placeholder="Referencia"
                                type="text"
                                defaultValue={formDataArticulos.referencia}
                                name="referencia"
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
                                <th scope="col">Cantidad</th>
                                <th scope="col">UM</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Subtotal</th>
                                <th scope="col">Referencia</th>
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
                                    <td data-title="Cantidad">
                                        {producto.cantidad}
                                    </td>
                                    <td data-title="UM">
                                        {producto.um}
                                    </td>
                                    <td data-title="Orden de compra">
                                        {new Intl.NumberFormat('es-MX', {
                                            style: "currency",
                                            currency: "MXN"
                                        }).format(producto.precio)} MXN
                                    </td>
                                    <td data-title="Observaciones">
                                        {new Intl.NumberFormat('es-MX', {
                                            style: "currency",
                                            currency: "MXN"
                                        }).format(producto.subtotal)} MXN
                                    </td>
                                    <td data-title="Referencia">
                                        {producto.referencia}
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
                    {/* Termina tabla informativa del listado de articulos */}

                    {/* Inicia tabla definida con totales */}
                    <Row>
                        <Col xs={12} md={8}>
                        </Col>
                        <Col xs={6} md={4}>
                            {/* Subtotal */}
                            <Row>
                                <Col>Subtotal</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(subTotal)} MXN
                                </Col>
                            </Row>
                            {/* IVA */}
                            <Row>
                                <Col>IVA</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(IVA)} MXN
                                </Col>
                            </Row>
                            {/* Total */}
                            <Row>
                                <Col>Total</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(total)} MXN
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* Termina tabla definida con totales */}

                    {/* Botones de envio del formulario */}
                    <br />
                    <hr />
                    <Form.Group as={Row} className="botones">
                        <Row>
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar la información del formulario"
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Registrar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    title="cerrar el formulario"
                                    className="registrar"
                                    onClick={() => {
                                        regresaCompras()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
                <br />
            </Container>
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormData() {
    return {
        fechaSolicitud: "",
        proveedor: "",
        fechaEntrega: "",
        autorizo: "",
        tipoCompra: ""
    }
}

function initialFormDataOC() {
    return {
        requisicion: "",
    }
}

function initialProveedor() {
    return {
        proveedor: "",
        nombreProveedor: ""
    }
}

function initialFormDataArticulos() {
    return {
        cantidad: "",
        folio: "",
        um: "",
        descripcion: "",
        precio: "",
        subtotal: "",
        referencia: ""
    }
}

function cargaFormDataArticulos(data) {
    const { producto, folio, cantidad, um, precioUnitario, referencia } = data;

    return {
        descripcion: "",
        cantidad: cantidad,
        folio: folio,
        um: um,
        precio: precioUnitario,
        referencia: referencia,
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

export default RegistroCompras;
