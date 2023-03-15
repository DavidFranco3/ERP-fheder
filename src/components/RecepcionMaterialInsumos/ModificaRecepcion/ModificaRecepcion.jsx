import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import { listarClientes } from "../../../api/clientes";
import { obtenerRecepcion, actualizaRecepcion } from "../../../api/recepcionMaterialInsumos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./ModificaRecepcion.scss"
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { obtenerDatosCompra } from "../../../api/compras"
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import BasicModal from "../../Modal/BasicModal";
import BuscarOC from '../../../page/BuscarOC';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { listarAlmacenes } from '../../../api/gestionAlmacen';
import { LogRegistroAlmacenes } from '../../Almacenes/Gestion/GestionAlmacenes';
import ModificacionProductos from '../ModificacionProductos';

function ModificaRecepcion(props) {
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

    // Para la eliminacion fisica de usuarios
    const modificaProducto = (content) => {
        setTitulosModal("Modificando el producto");
        setContentModal(content);
        setShowModal(true);
    }

    const enrutamiento = useNavigate();

    const params = useParams();
    const { id } = params

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataOC, setFormDataOC] = useState(initialFormDataOC());

    // Para determinar el uso de la animacion de carga mientras se guarda el pedido
    const [loading, setLoading] = useState(false);

    const [productosOC, setProductosOC] = useState();
    console.log(productosOC)

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
    const buscarOC = (content) => {
        setTitulosModal("Buscar orden de compra");
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
        enrutamiento("/RecepcionMaterialInsumos");
    }

    // Para almacenar las sucursales registradas
    const [almacenesRegistrados, setAlmacenesRegistrados] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenes(getSucursal()).then(response => {
                const { data } = response;
                //console.log(data)
                const dataTemp = formatModelGestionAlmacen(data);
                //console.log(data)
                setAlmacenesRegistrados(dataTemp);
            })
        } catch (e) {

        }
    }, []);

    useEffect(() => {
        //
        obtenerRecepcion(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(valoresAlmacenados(data))
            setFormDataOC(cargaFormDataOC(data))
            // setFechaCreacion(fechaElaboracion)
            setListProductosCargados(data.productos)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    useEffect(() => {
        //
        obtenerDatosCompra(formDataOC.ordenCompra).then(response => {
            const { data } = response;
            //console.log(data)
            setProductosOC(data.productos)
        }).catch(e => {
            console.log(e)
        })
    }, [formDataOC.ordenCompra]);

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            actualizaRecepcion().then(response => {
                const { data } = response;
                // console.log(data)
                const { noRequerimiento } = data;
                console.log(noRequerimiento)
                setFolioActual(noRequerimiento)
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

    console.log("cotizacion: " + pdfCotizacion)
    console.log("ordenCompra: " + linkOrdenCompra)

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            const dataTemp = {
                ordenCompra: formDataOC.ordenCompra,
                proveedor: formDataOC.proveedor,
                nombreProveedor: formDataOC.nombreProveedor,
                fechaRecepcion: formData.fecha,
                precio: precioTotal,
                cantidad: cantidadTotal,
                valorTotal: totalSinIVA,
                productos: listProductosCargados
            }
            // console.log(dataTemp)
            // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos)
            //LogRegistroPlaneacion(data.noVenta, listProductosCargados)
            // 
            // Modificar el pedido creado recientemente
            actualizaRecepcion(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se han modificado la recepcion de material e insumos " + id, dataTemp)
                // Registro inicial del tracking
                //LogTrackingRegistro(data.noVenta, clienteSeleccionado.id, formData.fechaElaboracion)
                setLoading(false)
                regresaListadoVentas()
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const [cargaProductos, setCargaProductos] = useState(initialFormDataProductos());
    console.log(cargaProductos)
    const [productoCargado, setProductoCargado] = useState("");

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataOC({ ...formDataOC, [e.target.name]: e.target.value })
        setCargaProductos({ ...cargaProductos, [e.target.name]: e.target.value })
    }
    // Para la carga y el listado de productos
    const [listProductosCargados, setListProductosCargados] = useState([]);
    console.log(cargaProductos.producto)
    // Gestion del producto seleccionado
    useEffect(() => {
        setProductoCargado(cargaProductos.producto)
        const dataTempProductos = productoCargado.split("/")
        const dataTemp = {
            folio: dataTempProductos[0],
            cantidad: dataTempProductos[1],
            um: dataTempProductos[5],
            precioUnitario: dataTempProductos[3],
        }
        setCargaProductos(cargaFormDataProductos(dataTemp))
    }, [cargaProductos.producto]);

    // Para agregar productos al listado

    const [totalUnitario, setTotalUnitario] = useState(parseFloat(cargaProductos.cantidad) * parseFloat(cargaProductos.precioUnitario));

    const calcularTotalUnitario = () => {
        const cantidad = document.getElementById("cantidad").value;
        const precioUnitario = document.getElementById("precioUnitario").value;
        const total = parseFloat(cantidad) * parseFloat(precioUnitario);
        setTotalUnitario(total);
    }

    const addItems = () => {
        const folio = document.getElementById("folio").value
        const producto = document.getElementById("producto").value
        const cantidad = document.getElementById("cantidad").value
        const um = document.getElementById("um").value
        const tipoMercancia = document.getElementById("tipoMercancia").value
        const precioUnitario = document.getElementById("precioUnitario").value
        const ordenCompra = formDataOC.ordenCompra

        if (!producto || !cantidad || !um || !tipoMercancia || !precioUnitario) {
            toast.warning("Completa la información del producto");
        } else {
            const temp = producto.split("/");

            const dataTemp = {
                folio: folio,
                producto: temp[2],
                cantidad: cantidad,
                um: um,
                tipoMercancia: tipoMercancia,
                precioUnitario: precioUnitario,
                subtotal: parseFloat(cargaProductos.cantidad) * parseFloat(cargaProductos.precioUnitario),
                ordenCompra: ordenCompra
            }
            // console.log(dataTemp)

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );

            LogRegistroAlmacenes(folio, temp[2], tipoMercancia, um, cantidad, "Entrada");

            setCargaProductos(initialFormDataProductos)
            document.getElementById("producto").value = "Elige una opción"
            document.getElementById("tipoMercancia").value = "Elige...."
            //document.getElementById("descripcion").value = ""

            setTotalUnitario(0)
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        setCargaProductos(initialFormDataProductos)
        document.getElementById("producto").value = "Elige una opción"
        document.getElementById("tipoMercancia").value = "Elige...."
        //document.getElementById("descripcion").value = ""

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

    const totalSinIVA = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.subtotal)), 0);

    const precioTotal = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.precioUnitario)), 0);

    const cantidadTotal = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.cantidad)), 0);

    const renglon = listProductosCargados.length + 1;

    const temp = cargaProductos.folio.split("-")

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Modificar recepción
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

                            <Row>
                                <Form.Group as={Col} controlId="formGridCliente">
                                    <Form.Label>
                                        Numero de remision
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Folio"
                                        name="folio"
                                        value={formData.folio}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridCliente">
                                    <Form.Label>
                                        Fecha
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fecha"
                                        defaultValue={formData.fecha}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                    <Form.Label>
                                        Orden compra
                                    </Form.Label>
                                    <div className="flex items-center mb-1">
                                        <Form.Control
                                            type="text"
                                            placeholder="Orden de compra"
                                            defaultValue={formDataOC.ordenCompra}
                                            name="ordenCompra"
                                        />
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre los productos"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarOC(
                                                    <BuscarOC
                                                        formData={formDataOC}
                                                        setFormData={setFormDataOC}
                                                        productosOC={productosOC}
                                                        setProductosOC={setProductosOC}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridCliente">
                                    <Form.Label>
                                        Proveedor
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Proveedor"
                                        name="nombreProveedor"
                                        defaultValue={formDataOC.nombreProveedor}
                                    />
                                </Form.Group>
                            </Row>

                        </div>
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

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Folio
                                </Form.Label>
                                <Form.Control
                                    id="folio"
                                    type="text"
                                    placeholder="Folio"
                                    name="folio"
                                    defaultValue={cargaProductos.folio}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                <Form.Label>
                                    Producto
                                </Form.Label>
                                <Form.Control
                                    id="producto"
                                    as="select"
                                    defaultValue={cargaProductos.producto}
                                    name="producto"
                                >
                                    <option>Elige una opción</option>
                                    {map(productosOC, (productos, index) => (
                                        <option
                                            key={index}
                                            value={productos?.folio + "/" + productos?.cantidad + "/" + productos?.descripcion + "/" + productos?.precio + "/" + productos?.subtotal + "/" + productos?.um}
                                        >
                                            {productos?.descripcion}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Cantidad
                                </Form.Label>
                                <Form.Control
                                    id="cantidad"
                                    type="number"
                                    placeholder="Cantidad"
                                    name="cantidad"
                                    defaultValue={cargaProductos.cantidad}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    U.M.
                                </Form.Label>
                                <Form.Control
                                    id="um"
                                    type="text"
                                    placeholder="Unidad de medida"
                                    name="um"
                                    defaultValue={cargaProductos.um}
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
                                    defaultValue={cargaProductos.precioUnitario}
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
                                    value={parseFloat(cargaProductos.cantidad) * parseFloat(cargaProductos.precioUnitario)}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>
                                    Tipo de mercancia
                                </Form.Label>
                                <Form.Control
                                    id="tipoMercancia"
                                    as="select"
                                    name="tipoMercancia"
                                    defaultValue={cargaProductos.tipoMercancia}
                                >
                                    <option >Elige....</option>
                                    {map(almacenesRegistrados, (almacen, index) => (
                                        <option key={index} value={almacen?.nombre}>{almacen?.nombre}</option>
                                    ))}
                                </Form.Control>
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
                                        <th scope="col">#</th>
                                        <th scope="col">Folio</th>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">U.M.</th>
                                        <th scope="col">Precio unitario</th>
                                        <th scope="col">Subtotal</th>
                                        <th scope="col">Almacen</th>
                                        <th scope="col">Orden compra</th>
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
                                            <td data-title="Producto">
                                                {producto.producto}
                                            </td>
                                            <td data-title="cantidad">
                                                {producto.cantidad}
                                            </td>
                                            <td data-title="um">
                                                {producto.um}
                                            </td>
                                            <td data-title="precioUnitario">
                                                {new Intl.NumberFormat('es-MX', {
                                                    style: "currency",
                                                    currency: "MXN"
                                                }).format(producto.precioUnitario)} MXN
                                            </td>
                                            <td data-title="subtotal">
                                                {new Intl.NumberFormat('es-MX', {
                                                    style: "currency",
                                                    currency: "MXN"
                                                }).format(producto.subtotal)} MXN
                                            </td>
                                            <td data-title="tipoMercancia">
                                                {producto.tipoMercancia}
                                            </td>
                                            <td data-title="tipoMercancia">
                                                {producto.ordenCompra}
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
                            {/* Termina tabla informativa */}

                            {/* Inicia tabla definida con totales */}

                            {/* Subtotal */}
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

function initialFormData() {
    return {
        folio: "",
        fecha: ""
    }
}

function valoresAlmacenados(data) {
    return {
        folio: data.folio,
        fecha: data.fechaRecepcion
    }
}

function initialFormDataOC() {
    return {
        ordenCompra: "",
        proveedor: "",
        nombreProveedor: ""
    }
}

function cargaFormDataOC(data) {
    return {
        ordenCompra: data.ordenCompra,
        proveedor: data.proveedor,
        nombreProveedor: data.nombreProveedor
    }
}

function initialFormDataProductos() {
    return {
        cantidad: '',
        folio: '',
        precioUnitario: '',
        producto: '',
        tipoMercancia: '',
        um: '',
    }
}

function cargaFormDataProductos(data) {
    const { producto, folio, cantidad, um, precioUnitario } = data;

    return {
        producto: "",
        folio: folio,
        cantidad: cantidad,
        um: um,
        precioUnitario: precioUnitario,
        tipoMercancia: "",
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

function formatModelGestionAlmacen(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            sucursal: data.sucursal,
            status: data.status,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ModificaRecepcion;
