import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import BuscarCliente from '../../../page/BuscarCliente/BuscarCliente';
import BuscarProducto from '../../../page/BuscarProducto/BuscarProducto';
import { listarClientes } from "../../../api/clientes";
import { registraPedidoVenta, obtenerNumeroPedidoVenta } from "../../../api/pedidoVenta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye, faSearch, faArrowCircleLeft, faX, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import "./RegistroVentas.scss"
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingRegistro } from "../../Tracking/Gestion/GestionTracking";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import BasicModal from "../../Modal/BasicModal";
import Dropzone from "../../Dropzone";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogRegistroProductosOV } from '../../ProductosOV/Gestion/GestionProductosOV';
import { obtenerDatosProductosOV } from "../../../api/productosOV";
import EliminacionProductosOV from '../../ProductosOV/EliminacionProductosOV';
import ModificacionProductos from '../../ProductosOV/ModificacionProductos';

function RegistroVentas(props) {
    const { history, setRefreshCheckLogin, location } = props;

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

    // Para la eliminacion fisica de usuarios
    const eliminaProducto = (content) => {
        setTitulosModal("Eliminando el producto");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const modificaProducto = (content) => {
        setTitulosModal("Modificando el producto");
        setContentModal(content);
        setShowModal(true);
    }

    const [listProductosCargados, setListProductosCargados] = useState([]);

    const enrutamiento = useHistory();

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para determinar el uso de la animacion de carga mientras se guarda el pedido
    const [loading, setLoading] = useState(false);

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarOV = (content) => {
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

    // Para determinar el regreso a la ruta de pedidos
    const regresaListadoVentas = () => {
        enrutamiento.push("/Ventas");
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroPedidoVenta().then(response => {
                const { data } = response;
                // console.log(data)
                const { noVenta } = data;
                setFolioActual(noVenta)
            }).catch(e => {
                console.log(e)
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
            listarClientes().then(response => {
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

    // Para almacenar la lista completa de clientes
    const [listProductosOV, setListProductosOV] = useState([]);

    const renglon = listProductosCargados.length + 1;

    console.log(listProductosCargados)

    useEffect(() => {
        try {
            obtenerDatosProductosOV(folioActual).then(response => {
                const { data } = response;
                console.log(data)
                setListProductosOV(data)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [listProductosCargados]);

    // Obten el listado de productos
    // Para almacenar el listado de productos activos
    const [listProductosActivos, setListProductosActivos] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarMatrizProductosActivos().then(response => {
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

    // Generación de PDF
    const generaPDF = () => {
        // console.log("Genera PDF")
    }

    // Para almacenar la foto de perfil del usuario
    const [pdfCotizacion, setPdfCotizacion] = useState(null);
    console.log(pdfCotizacion)

    useEffect(() => {
        setPdfCotizacion(formData.cotizacion)
    }, [formData.cotizacion]);

    // Para almacenar la foto de perfil del usuario
    const [pdfOrdenCompra, setPdfOrdenCompra] = useState(null);

    // Para almacenar el folio actual
    const [linkOrdenCompra, setlinkOrdenCompra] = useState("");

    useEffect(() => {
        try {
            if (setPdfOrdenCompra) {
                subeArchivosCloudinary(setPdfOrdenCompra, "ventas").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setlinkOrdenCompra(secure_url)

                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [setPdfOrdenCompra]);

    // Para almacenar el folio actual
    const [linkCotizacion, setlinkCotizacion] = useState("");

    useEffect(() => {
        try {
            if (pdfCotizacion) {
                subeArchivosCloudinary(pdfCotizacion, "ventas").then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { secure_url } = data;
                    setlinkCotizacion(secure_url)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)

        }
    }, [pdfCotizacion]);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.cliente || !formData.numeroPedido || !formData.condicionesPago || !formData.especificaciones) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                folio: folioActual,
                fechaElaboracion: fechaPedido,
                fechaEntrega: fechaEntrega,
                cliente: formData.cliente,
                nombreCliente: formData.nombreCliente,
                condicionesPago: formData.condicionesPago,
                incoterms: formData.incoterms,
                sucursal: getSucursal(),
                moneda: "M.N.",
                numeroPedido: formData.numeroPedido,
                lugarEntrega: formData.lugarEntrega,
                cotizacion: linkCotizacion,
                total: totalSinIVA,
                especificaciones: formData.especificaciones,
                productos: listProductosCargados,
                estado: "true"
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            registraPedidoVenta(dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se han registrado la orden de venta con folio " + dataTemp.noVenta, dataTemp)
                // Registro inicial del tracking
                LogTrackingRegistro(folioActual, formData.cliente, formData.fechaElaboracion)
                setLoading(false)
                regresaListadoVentas()
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Para la carga y el listado de productos
    const [cargaProductos, setCargaProductos] = useState(initialFormDataProductos());

    // Gestion del producto seleccionado
    const handleProducto = (producto) => {
        const dataTempProductos = producto.split("/")
        console.log(dataTempProductos)
        const dataTemp = {
            idProducto: dataTempProductos[0],
            ID: dataTempProductos[1],
            item: dataTempProductos[2],
            precioUnitario: dataTempProductos[3],
        }
        setCargaProductos(cargaFormDataProductos(dataTemp))
    }

    // Para agregar productos al listado

    const [totalUnitario, setTotalUnitario] = useState(0);

    const calcularTotalUnitario = () => {
        const cantidad = document.getElementById("cantidad").value;
        const precioUnitario = document.getElementById("precioUnitario").value;
        const total = parseFloat(cantidad) * parseFloat(precioUnitario);
        setTotalUnitario(total);
    }

    const addItems = () => {
        const material = document.getElementById("material").value
        const cantidad = document.getElementById("cantidad").value
        const um = document.getElementById("um").value
        const precioUnitario = document.getElementById("precioUnitario").value
        const total = document.getElementById("total").value

        if (!material || !cantidad || !um || !precioUnitario) {
            toast.warning("Completa la información del producto");
        } else {
            const dataTemp = {
                idProducto: cargaProductos.idProducto,
                ID: cargaProductos.ID,
                item: cargaProductos.item,
                material: material,
                cantidad: cantidad,
                um: um,
                precioUnitario: cargaProductos.precioUnitario,
                total: totalUnitario
            }

            //LogRegistroProductosOV(folioActual, cargaProductos.ID, cargaProductos.item, cantidad, um, precioUnitario, total, setListProductosCargados);
            // console.log(dataTemp)

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );

            setCargaProductos(initialFormDataProductos)
            //document.getElementById("descripcion").value = ""
            document.getElementById("cantidad").value = ""
            document.getElementById("um").value = "Piezas"
            setTotalUnitario(0)
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        setCargaProductos(initialFormDataProductos)
        //document.getElementById("descripcion").value = ""
        document.getElementById("cantidad").value = ""
        document.getElementById("um").value = "Piezas"
        setTotalUnitario(0)
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.item === producto.item), 1);
        setListProductosCargados([...newArray]);
    }

    // Para almacenar la materia prima seleccionada
    const [clienteSeleccionado, setClienteSeleccionado] = useState([]);

    const handleCliente = (cliente) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = cliente.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setClienteSeleccionado({
            id: temp[0],
            calle: temp[1],
            numeroExterior: temp[2],
            colonia: temp[3],
            municipio: temp[4],
            estado: temp[5],
            nombreCliente: temp[6]
        })
    }

    const totalSinIVA = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.total)), 0);

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 10? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaPedido, setFechaPedido] = useState(fecha);

    const [fechaEntrega, setFechaEntrega] = useState(fecha);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva orden de venta
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
                            onClick={() => {
                                regresaListadoVentas()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <Container fluid>
                <div className="formularioRegistroOrdenVenta">
                    <Form onChange={onChange} onSubmit={onSubmit}>

                        {/* Datos de encabezado de la orden de venta*/}
                        <div className="encabezadoOrdenVenta">
                            {/* Folio, fecha elaboracion */}

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Nombre del cliente
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <div className="flex items-center mb-1">
                                            <Form.Control
                                                type="text"
                                                defaultValue={formData.nombreCliente}
                                                placeholder="Buscar cliente"
                                                name="cliente"
                                            />
                                            <FontAwesomeIcon
                                                className="cursor-pointer py-2 -ml-6"
                                                title="Buscar entre los clientes"
                                                icon={faSearch}
                                                onClick={() => {
                                                    buscarOV(
                                                        <BuscarCliente
                                                            formData={formData}
                                                            setFormData={setFormData}
                                                            setShowModal={setShowModal}
                                                        />)
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Numero de pedido
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Numero de pedido"
                                            name="numeroPedido"
                                            defaultValue={formData.numeroPedido}
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Fecha de pedido
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="date"
                                            placeholder="Fecha de pedido"
                                            name="fechaPedido"
                                            value={fechaPedido}
                                            onChange={e => setFechaPedido(e.target.value)}
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Fecha de entrega
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="date"
                                            placeholder="Fecha de entrega"
                                            name="fechaEntrega"
                                            value={fechaEntrega}
                                            onChange={e => setFechaEntrega(e.target.value)}
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Condiciones de pago
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            as="textarea"
                                            style={{ height: '100px' }}
                                            placeholder="Condiciones de pago"
                                            name="condicionesPago"
                                            defaultValue={formData.condicionesPago}
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Moneda
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Numero de pedido"
                                            name="moneda"
                                            value="M.N."
                                            disabled
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Lugar de entrega
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            as="textarea"
                                            type="text"
                                            placeholder="Lugar de entrega"
                                            style={{ height: '100px' }}
                                            name="lugarEntrega"
                                            defaultValue={formData.lugarEntrega == "" ? "" : formData.lugarEntrega}
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Especificaciones del empaque
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Especificaciones del empaque"
                                            name="especificaciones"
                                            defaultValue={formData.especificaciones}
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />
                            <div className="subeOrdenVenta">
                                <h4>Adjuntar orden de venta</h4>
                                <div className="ordenVenta">
                                    <Dropzone
                                        setImagen={setPdfCotizacion}
                                    />
                                </div>
                            </div>
                        </div>
                        <br />
                        {/* Seleccion de productos */}

                        <hr />
                        <Badge bg="secondary" className="tituloFormularioDetalles">
                            <h4>A continuación, especifica los detalles del artículo y agregalo</h4>
                        </Badge>
                        <br />
                        <hr />

                        <Row>

                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                <Form.Label>
                                    ITEM
                                </Form.Label>
                                <Form.Control type="number"
                                    id="index"
                                    value={renglon}
                                    name="index"
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                <Form.Label>
                                    Descripción
                                </Form.Label>
                                <div className="flex items-center mb-1">
                                    <Form.Control
                                        type="text"
                                        id="descripcion"
                                        defaultValue={cargaProductos.item}
                                        name="descripcion"
                                    />
                                    <FontAwesomeIcon
                                        className="cursor-pointer py-2 -ml-6"
                                        title="Buscar entre los productos"
                                        icon={faSearch}
                                        onClick={() => {
                                            buscarProducto(
                                                <BuscarProducto
                                                    formData={cargaProductos}
                                                    setFormData={setCargaProductos}
                                                    setShowModal={setShowModal}
                                                />)
                                        }}
                                    />
                                </div>
                            </Form.Group>


                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Numero de parte
                                </Form.Label>
                                <Form.Control
                                    id="material"
                                    type="text"
                                    placeholder="Descripcion"
                                    name="MateriaPrima"
                                    defaultValue={cargaProductos.ID}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Cantidad
                                </Form.Label>
                                <Form.Control
                                    id="cantidad"
                                    type="number"
                                    placeholder="Cantidad"
                                    name="Cantidad"
                                    onChange={(e) => { calcularTotalUnitario(e.target.value) }}
                                    defaultValue={cargaProductos.cantidad}
                                />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>
                                    UM
                                </Form.Label>
                                <Form.Control
                                    id="um"
                                    type="text"
                                    name="um"
                                    value="Piezas"
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Precio unitario
                                </Form.Label>
                                <Form.Control
                                    id="precioUnitario"
                                    type="number"
                                    placeholder="Precio unitario"
                                    name="precioUnitario"
                                    onChange={(e) => { calcularTotalUnitario(e.target.value) }}
                                    defaultValue={cargaProductos.precioUnitario}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Total
                                </Form.Label>
                                <Form.Control
                                    id="total"
                                    type="text"
                                    placeholder="Total"
                                    name="total"
                                    onChange={(e) => { calcularTotalUnitario(e.target.value) }}
                                    value={totalUnitario}
                                    disabled
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

                        {/* Listado de productos  */}
                        <div className="tablaProductos">

                            {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
                            {/* Inicia tabla informativa  */}
                            <Badge bg="secondary" className="tituloListadoProductosSeleccionados">
                                <h4>Listado de productos seleccionados</h4>
                            </Badge>
                            <br />
                            <hr />
                            <table className="responsive-tableRegistroVentas"
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">ITEM</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Numero de parte</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">UM</th>
                                        <th scope="col">Precio unitario</th>
                                        <th scope="col">Total</th>
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
                                            <td data-title="Descripcion">
                                                {producto.item}
                                            </td>
                                            <td data-title="Material">
                                                {producto.ID}
                                            </td>
                                            <td data-title="UM">
                                                {producto.cantidad}
                                            </td>
                                            <td data-title="Descripción">
                                                {producto.um}
                                            </td>
                                            <td data-title="Orden de compra">
                                                {new Intl.NumberFormat('es-MX', {
                                                    style: "currency",
                                                    currency: "MXN"
                                                }).format(producto.precioUnitario)} MXN
                                            </td>
                                            <td data-title="Observaciones">
                                                {new Intl.NumberFormat('es-MX', {
                                                    style: "currency",
                                                    currency: "MXN"
                                                }).format(producto.total)} MXN
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
                            {/* Termina tabla informativa */}

                            {/* Inicia tabla definida con totales */}
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
                                            }).format(totalSinIVA)} MXN
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {/* Termina tabla definida con totales */}
                        </div>

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
                                        title="Cerrar el formulario"
                                        className="registrar"
                                        onClick={() => {
                                            regresaListadoVentas()
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

function initialFormData(folio, fecha) {
    return {
        folio: folio,
        fechaPedido: "",
        fechaEntrega: "",
        cliente: "",
        nombreCliente: "",
        incoterms: "",
        lugarEntrega: "",
        especificaciones: "",
        condicionesPago: "",
        lugarEntrega: "",
        ordenCompra: "",
        cotizacion: "",
        numeroPedido: ""
    }
}

function initialFormDataProductos() {
    return {
        idProducto: "",
        ID: "",
        item: "",
        cantidad: "",
        precioUnitario: "",
        um: "",
        descripcion: "",
        ordenCompra: "",
        observaciones: ""
    }
}

function cargaFormDataProductos(data) {
    const { idProducto, ID, item, precioUnitario } = data;

    return {
        idProducto: idProducto,
        ID: ID,
        item: item,
        cantidad: "",
        um: "",
        descripcion: "",
        ordenCompra: "",
        precioUnitario: precioUnitario,
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
            precioVenta: data.precioVenta,
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

export default RegistroVentas;
