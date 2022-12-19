import { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import BuscarCliente from '../../../page/BuscarCliente/BuscarCliente';
import BuscarProducto from '../../../page/BuscarProducto/BuscarProducto';
import { listarClientes } from "../../../api/clientes";
import { actualizaRecepcion, obtenerRecepcion } from "../../../api/recepcionMaterialInsumos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./ModificaRecepcion.scss"
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingRegistro } from "../../Tracking/Gestion/GestionTracking";
import { LogRegistroPlaneacion } from "../../Planeacion/Gestion/GestionPlaneacion";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import BasicModal from "../../Modal/BasicModal";
import BuscarOC from '../../../page/BuscarOC';

function ModificacionRecepcion(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

    const params = useParams();
    const { id } = params

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
        enrutamiento.push("/RecepcionMaterialInsumos");
    }

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

    useEffect(() => {
        //
        obtenerRecepcion(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(valoresAlmacenados(data))
            // setFechaCreacion(fechaElaboracion)
            setListProductosCargados(data.productos)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

                const dataTemp = {
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
                    LogsInformativos(`Se han modificado la recepcion de material e insumos ${id}`, datos)
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

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setCargaProductos({ ...cargaProductos, [e.target.name]: e.target.value })
    }
    console.log(cargaProductos)
    // Para la carga y el listado de productos
    const [listProductosCargados, setListProductosCargados] = useState([]);

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

    const [totalUnitario, setTotalUnitario] = useState(parseFloat(cargaProductos.cantidad) * parseFloat(cargaProductos.precioUnitario));

    const calcularTotalUnitario = () => {
        const cantidad = document.getElementById("cantidad").value;
        const precioUnitario = document.getElementById("precioUnitario").value;
        const total = parseFloat(cantidad) * parseFloat(precioUnitario);
        setTotalUnitario(total);
    }

    const addItems = () => {
        const ordenCompra = cargaProductos.ordenCompra
        const producto = document.getElementById("producto").value
        const cantidad = document.getElementById("cantidad").value
        const um = document.getElementById("um").value
        const proveedor = document.getElementById("proveedor").value
        const tipoMercancia = document.getElementById("tipoMercancia").value
        const precioUnitario = document.getElementById("precioUnitario").value

        if (!ordenCompra || !producto || !cantidad || !um || !proveedor || !tipoMercancia || !precioUnitario) {
            toast.warning("Completa la información del producto");
        } else {
            const dataTemp = {
                ordenCompra: ordenCompra,
                producto: producto,
                cantidad: cantidad,
                um: um,
                proveedor: proveedor,
                tipoMercancia: tipoMercancia,
                precioUnitario: precioUnitario,
                subtotal: parseFloat(cargaProductos.cantidad) * parseFloat(cargaProductos.precioUnitario)
            }
            // console.log(dataTemp)

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );
            setCargaProductos(initialFormDataProductos)
            //document.getElementById("descripcion").value = ""

            setTotalUnitario(0)
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        setCargaProductos(initialFormDataProductos)
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

    console.log(cargaProductos)

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Recepcion de material e insumos
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
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Fecha
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="date"
                                            placeholder="Fecha"
                                            name="fecha"
                                            defaultValue={formData.fecha}
                                        />
                                    </Col>
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

                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                <Form.Label>
                                    Orden compra
                                </Form.Label>
                                <div className="flex items-center mb-1">
                                    <Form.Control
                                        type="text"
                                        placeholder="Orden de compra"
                                        id="ordenCompra"
                                        value={cargaProductos.ordenCompra}
                                        onChange={e => cargaProductos.ordenCompra(e.target.value)}
                                        name="ordenCompra"
                                    />
                                    <FontAwesomeIcon
                                        className="cursor-pointer py-2 -ml-6"
                                        title="Buscar entre los productos"
                                        icon={faSearch}
                                        onClick={() => {
                                            buscarOC(
                                                <BuscarOC
                                                    formData={cargaProductos}
                                                    setFormData={setCargaProductos}
                                                    totalUnitario={totalUnitario}
                                                    setTotalUnitario={setTotalUnitario}
                                                    setShowModal={setShowModal}
                                                />)
                                        }}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                <Form.Label>
                                    Producto
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Producto"
                                    id="producto"
                                    value={cargaProductos.producto}
                                    onChange={e => cargaProductos.producto(e.target.value)}
                                    name="producto"
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
                                    name="cantidad"
                                    value={cargaProductos.cantidad}
                                    onChange={e => cargaProductos.cantidad(e.target.value)}
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
                                    value={cargaProductos.um}
                                    onChange={e => cargaProductos.um(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Proveedor
                                </Form.Label>
                                <Form.Control
                                    id="proveedor"
                                    type="text"
                                    placeholder="Proveedor"
                                    name="proveedor"
                                    value={cargaProductos.proveedor}
                                    onChange={e => cargaProductos.proveedor(e.target.value)}
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
                                    value={cargaProductos.tipoMercancia}
                                    onChange={e => cargaProductos.tipoMercancia(e.target.value)}
                                >
                                    <option >Elige....</option>
                                    <option value="Material">Material</option>
                                    <option value="Insumo">Insumo</option>
                                </Form.Control>
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
                                    value={cargaProductos.precioUnitario}
                                    onChange={e => cargaProductos.precioUnitario(e.target.value)}
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
                                    onChange={(e) => { totalUnitario(e.target.value) }}
                                    value={parseFloat(cargaProductos.cantidad) * parseFloat(cargaProductos.precioUnitario)}
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
                                        <th scope="col">Orden de compra</th>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">U.M.</th>
                                        <th scope="col">Proveedor</th>
                                        <th scope="col">Tipo de mercancia</th>
                                        <th scope="col">Precio unitario</th>
                                        <th scope="col">Subtotal</th>
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
                                            <td data-title="ordenCompra">
                                                {producto.ordenCompra}
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
                                            <td data-title="proveedor">
                                                {producto.proveedor}
                                            </td>
                                            <td data-title="tipoMercancia">
                                                {producto.tipoMercancia}
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
                                            <td data-title="Eliminar">
                                                <div
                                                    className="eliminarProductoListado"
                                                    title="Eliminar producto"
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

                            {/* Subtotal */}
                            <Row>
                                <Col>Precio total</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(precioTotal)} MXN
                                </Col>
                                <Col>Articulos pedidos</Col>
                                <Col>
                                    {cantidadTotal}
                                </Col>
                                <Col>Valor total de la recepcion</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(totalSinIVA)} MXN
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
                                        {!loading ? "Modificar" : <Spinner animation="border" />}
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
        numeroPedido: "",
        fecha: ""
    }
}

function valoresAlmacenados(data) {
    return {
        fecha: data.fechaRecepcion
    }
}

function initialFormDataProductos() {
    return {
        ordenCompra: "",
        producto: "",
        cantidad: "",
        um: "",
        precioUnitario: "",
        proveedor: "",
        tipoMercancia: "",
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

export default ModificacionRecepcion;
