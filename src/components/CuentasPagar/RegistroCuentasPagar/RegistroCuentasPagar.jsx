import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import { listarClientes } from "../../../api/clientes";
import { registraCuentasPagar, obtenerNumeroCuentasPagar } from "../../../api/cuentasPorPagar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowCircleLeft, faX, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import "./RegistroCuentasPagar.scss"
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import BasicModal from "../../Modal/BasicModal";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { obtenerProveedores } from "../../../api/proveedores";
import BuscarOC from '../../../page/BuscarOC';
import BuscarProducto from '../../../page/BuscarProducto';
import { LogCuentaRegistro, LogCuentaActualizacion } from '../../CuentasProveedores/Gestion/GestionCuentasProveedores';

function RegistroCuentasPagar(props) {
    const { history, setRefreshCheckLogin, location } = props;

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

    const enrutamiento = useNavigate();

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataCompra, setFormDataCompra] = useState(initialFormDataCompra());

    // Para guardar los datos del formulario
    const [formDataProveedor, setFormDataProveedor] = useState(initialFormDataProveedorInitial());

    const cargarDatosProveedores = () => {
        //
        obtenerProveedores(formDataCompra.proveedor).then(response => {
            const { data } = response;
            //console.log(data)
            setFormDataProveedor(initialFormDataProveedor(data));
            //setListProductosCargados(data.productos);
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarDatosProveedores();
    }, [formDataCompra.proveedor]);

    // Para determinar el uso de la animacion de carga mientras se guarda el pedido
    const [loading, setLoading] = useState(false);

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

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
    const buscarCompra = (content) => {
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
        enrutamiento("/CuentasPorPagar");
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    const obtenerFolio = () => {
        try {
            obtenerNumeroCuentasPagar().then(response => {
                const { data } = response;
                // console.log(data)
                const { noCuenta } = data;
                setFolioActual(noCuenta)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerFolio();
    }, []);

    // Para almacenar la lista completa de clientes
    const [listProductosOV, setListProductosOV] = useState([]);

    const renglon = listProductosCargados.length + 1;

    const [iva, setIva] = useState(0);

    console.log(iva);

    // Para traer el listado de productos activos
    useEffect(() => {
        setIva(parseFloat(formData.iva))
    }, [formData.iva]);

    // Calcula el subtotal de la lista de artículos cargados
    const subTotal = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.subtotal)), 0);

    //Calcula el IVA de la lista de productos agregados
    const IVA = parseFloat(subTotal * iva);

    // Calcula el total con iva de la lista de productos seleccionados
    const total = subTotal + (subTotal * iva);

    // Para traer el listado de productos activos

    const onSubmit = e => {
        e.preventDefault();

        //console.log("Continuar")
        setLoading(true);

        const dataTemp = {
            folio: folioActual,
            ordenCompra: formDataCompra.ordenCompra,
            proveedor: formDataCompra.proveedor,
            nombreProveedor: formDataCompra.nombreProveedor,
            sucursal: getSucursal(),
            fechaEmision: formDataCompra.fechaPedido,
            fechaVencimiento: fechaVencimiento,
            nombreContacto: formDataProveedor.nombreContacto,
            telefono: formDataProveedor.telefono,
            correo: formDataProveedor.correo,
            productos: listProductosCargados,
            iva: IVA,
            ivaElegido: formData.iva,
            subtotal: subTotal,
            total: total,
            estado: "true",
        }
        // console.log(dataTemp)

        // Modificar el pedido creado recientemente
        registraCuentasPagar(dataTemp).then(response => {
            const { data: { mensaje, datos } } = response;
            // console.log(response)
            toast.success(mensaje)
            // Log acerca del registro de cuentas de proveedores
            LogCuentaRegistro(formDataCompra.proveedor, formDataCompra.nombreProveedor, total);
            LogCuentaActualizacion(formDataCompra.proveedor, formDataCompra.nombreProveedor, total);
            // Log acerca del registro inicial del tracking
            LogsInformativos("Se han registrado la cuenta por pagar " + folioActual, dataTemp)
            setLoading(false)
            regresaListadoVentas()
        }).catch(e => {
            console.log(e)
        })
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataCompra({ ...formDataCompra, [e.target.name]: e.target.value })
        setFormDataProveedor({ ...formDataProveedor, [e.target.name]: e.target.value })
    }

    // Para la carga y el listado de productos
    const [cargaProductos, setCargaProductos] = useState(initialFormDataProductos());

    // Gestion del producto seleccionado
    const handleProducto = (producto) => {
        const dataTempProductos = producto.split("/")
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
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaPedido, setFechaPedido] = useState(fecha);

    const [fechaEntrega, setFechaEntrega] = useState(fecha);

    const [fechaVencimiento, setFechaVencimiento] = useState();

    const cargarFechas = () => {
        //la fecha
        const TuFecha = new Date(formDataCompra.fechaPedido);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + parseInt(formDataProveedor.diasCredito));
        //formato de salida para la fecha
        setFechaVencimiento((TuFecha.getMonth() + 1) > 10 && TuFecha.getDate() < 10 ? TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + "0" + TuFecha.getDate()
            : (TuFecha.getMonth() + 1) < 10 && TuFecha.getDate() > 10 ? TuFecha.getFullYear() + '-' + "0" + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate()
                : (TuFecha.getMonth() + 1) < 10 && TuFecha.getDate() < 10 ? TuFecha.getFullYear() + '-' + "0" + (TuFecha.getMonth() + 1) + '-' + "0" + TuFecha.getDate()
                    : TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }


    useEffect(() => {
        cargarFechas();
    }, [formDataCompra.fechaPedido, formDataProveedor.diasCredito]);

    const [ordenVentaPrincipal, setOrdenVentaPrincipal] = useState();

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Registrar cuenta por pagar
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

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Folio
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Folio"
                                            name="folio"
                                            value={folioActual}
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
                                            Orden de compra
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <div className="flex items-center mb-1">
                                            <Form.Control
                                                type="text"
                                                defaultValue={formDataCompra.ordenCompra}
                                                placeholder="Orden de compra"
                                                name="ordenCompra"
                                                disabled
                                            />
                                            <FontAwesomeIcon
                                                className="cursor-pointer py-2 -ml-6"
                                                title="Buscar entre las ventas"
                                                icon={faSearch}
                                                onClick={() => {
                                                    buscarCompra(
                                                        <BuscarOC
                                                            formData={formDataCompra}
                                                            setProductosOC={setListProductosCargados}
                                                            setFormData={setFormDataCompra}
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
                                            Proveedor
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataCompra.nombreProveedor}
                                            placeholder="Nombre del proveedor"
                                            name="nombreProveedor"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Fecha de emisión
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="date"
                                            defaultValue={formDataCompra.fechaPedido}
                                            placeholder="Fecha de pedido"
                                            name="fechaPedido"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Fecha de vencimiento
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="date"
                                            value={fechaVencimiento}
                                            onChange={e => setFechaVencimiento(e.target.value)}
                                            placeholder="Fecha de vencimiento"
                                            name="fechaVencimiento"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Nombre del contacto
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataProveedor.nombreContacto}
                                            placeholder="Nombre del comprador"
                                            name="nombreContacto"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Telefono
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataProveedor.telefono}
                                            placeholder="Telefono"
                                            name="telefono"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Correo
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataProveedor.correo}
                                            placeholder="correo"
                                            name="correo"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            IVA
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            as="select"
                                            defaultValue={formData.iva}
                                            placeholder="IVA"
                                            name="iva"
                                        >
                                            <option>Elige una opción</option>
                                            <option value="0.16">16%</option>
                                            <option value="0">0%</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Row>

                        </div>
                        <br />

                        {/* Listado de productos  */}
                        <div className="tablaProductos">

                            {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
                            {/* Inicia tabla informativa  */}
                            <Badge bg="secondary" className="tituloListadoProductosSeleccionados">
                                <h4>Listado de articulos de la orden de compra</h4>
                            </Badge>
                            <br />
                            <hr />
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
                                        <th scope="col">Requisición</th>
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
                                            <td data-title="Requisicion">
                                                {producto.requisicion}
                                            </td>
                                            <td data-title="Referencia">
                                                {producto.referencia}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Termina tabla informativa */}

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
        iva: ""
    }
}

function initialFormDataCompra() {
    return {
        ordenCompra: "",
        proveedor: "",
        nombreProveedor: "",
        fechaPedido: "",
    }
}

function initialFormDataProveedorInitial() {
    return {
        nombreContacto: "",
        telefono: "",
        correo: "",
        diasCredito: ""
    }
}

function initialFormDataProveedor(data) {
    return {
        nombreContacto: data.personalContacto,
        telefono: data.telefonoCelular,
        correo: data.correo,
        diasCredito: data.diasCredito
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

export default RegistroCuentasPagar;
