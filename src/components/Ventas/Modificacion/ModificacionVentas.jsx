import { useEffect, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory, useParams } from "react-router-dom";
import {
    actualizaPedidoVenta,
    obtenerDatosPedidoVenta
} from "../../../api/pedidoVenta";
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import "./ModificacionVentas.scss";
import { map } from "lodash";
import { listarClientes } from "../../../api/clientes";
import { toast } from "react-toastify";
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingRegistro } from "../../Tracking/Gestion/GestionTracking";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ModificacionVentas(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

    const params = useParams();
    const { folio } = params

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(folio, new Date));

    // Para determinar el uso de la animacion de carga mientras se guarda el pedido
    const [loading, setLoading] = useState(false);

    // Para almacenar la lista completa de clientes
    const [listClientes, setListClientes] = useState(null);

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para determinar el regreso a la ruta de pedidos
    const regresaListadoVentas = () => {
        enrutamiento.push("/Ventas");
    }

    // Inicia almacenaje de información registrada para su modificación

    // Almacenar informacion
    const [informacionPedido, setInformacionPedido] = useState(initialValues);

    const [lugarEntregaInicial, setlugarEntregaInicial] = useState(initialValues);

    useEffect(() => {
        //
        obtenerDatosPedidoVenta(folio).then(response => {
            const { data } = response;
            //console.log(data)
            const { folio, fechaElaboracion, fechaEntrega, cliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega, productos } = data;
            const dataTemp = {
                folio: folio,
                fechaPedido: fechaElaboracion,
                fechaEntrega: fechaEntrega,
                cliente: cliente,
                incoterms: incoterms,
                especificaciones: especificaciones,
                condicionesPago: condicionesPago,
                cotizacion: cotizacion,
                numeroPedido: numeroPedido,
                ordenCompra: ordenCompra,
                lugarEntrega: lugarEntrega,
            }
            setInformacionPedido(valoresAlmacenados(dataTemp))
            setlugarEntregaInicial(valoresAlmacenados(lugarEntrega))
            // setFechaCreacion(fechaElaboracion)
            setListProductosCargados(productos)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    const [totalUnitario, setTotalUnitario] = useState(0);

    const calcularTotalUnitario = () => {
        const cantidad = document.getElementById("cantidad").value;
        const precioUnitario = document.getElementById("precioUnitario").value;
        const total = parseFloat(cantidad) * parseFloat(precioUnitario);
        setTotalUnitario(total);
    }


    // Termina almacenaje de información para su modificación

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


    // Para almacenar el folio actual
    const [linkOrdenCompra, setlinkOrdenCompra] = useState("");
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

    useEffect(() => {
        try {
            if (informacionPedido.ordenCompra) {
                subeArchivosCloudinary(informacionPedido.ordenCompra, "ventas").then(response => {
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
    }, [informacionPedido.ordenCompra]);

    // Para almacenar el folio actual
    const [linkCotizacion, setlinkCotizacion] = useState("");

    useEffect(() => {
        try {
            if (informacionPedido.cotizacion) {
                subeArchivosCloudinary(informacionPedido.cotizacion, "ventas").then(response => {
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
    }, [informacionPedido.cotizacion]);

    const onSubmit = e => {
        e.preventDefault();

        if (!informacionPedido.cliente || !informacionPedido.numeroPedido || !informacionPedido.fechaPedido || !informacionPedido.fechaEntrega || !informacionPedido.incoterms || !informacionPedido.condicionesPago || !informacionPedido.especificaciones) {
            // console.log("Valores del form ", size(informacionPedido) )
            // console.log("Valores de validacion ", validCount )
            toast.warning("Completa el formulario");
        } else {
            setLoading(true)

            // Obtener los datos de la planeacion segun el pedido de venta
            //

            // Inicia proceso de modificacion de pedido de venta
            const dataTempPrincipalOV = {
                fechaElaboracion: informacionPedido.fechaPedido,
                fechaEntrega: informacionPedido.fechaEntrega,
                cliente: clienteSeleccionado.id,
                condicionesPago: informacionPedido.condicionesPago,
                incoterms: informacionPedido.incoterms,
                moneda: "M.N.",
                numeroPedido: informacionPedido.numeroPedido,
                lugarEntrega: clienteSeleccionado == "" ? informacionPedido.lugarEntrega : clienteSeleccionado?.calle + " " + clienteSeleccionado?.numeroExterior + ", " + clienteSeleccionado?.colonia + ", " + clienteSeleccionado?.municipio + ", " + clienteSeleccionado?.estado + ", " + clienteSeleccionado?.pais,
                cotizacion: linkCotizacion,
                ordenCompra: linkOrdenCompra,
                total: totalSinIVA,
                especificaciones: informacionPedido.especificaciones,
                productos: listProductosCargados,
                status: "true"
            }
            //console.log(dataTemp)

            // Inicia el proceso de modificacion de orden de venta
            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerDatosPedidoVenta(folio).then(response => {
                const { data: { _id, folio } } = response;
                // console.log(response.data)
                // Modificar el pedido creado recientemente
                actualizaPedidoVenta(_id, dataTempPrincipalOV).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    toast.success(mensaje)
                    // Registro de log para la actualizacion de orden de venta
                    LogsInformativos(`Se han actualizado los datos de la orden de venta con folio ${folio}`, datos)
                    // Registro del tracking para orden de venta
                    // LogTrackingRegistro(_id, folio, formData.cliente, formData.fechaElaboracion)
                    setLoading(false)
                    regresaListadoVentas()
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e)
            })
            // Termina la modificación del pedido de venta

        }

    }

    const onChange = e => {
        setInformacionPedido({ ...informacionPedido, [e.target.name]: e.target.value })
    }

    // Para la carga y el listado de productos
    const [cargaProductos, setCargaProductos] = useState(initialFormDataProductos());
    const [listProductosCargados, setListProductosCargados] = useState([]);

    const handleProducto = (producto) => {
        const dataTempProductos = producto.split("/")
        // console.log(dataTempProductos)
        const dataTemp = {
            index: dataTempProductos[0],
            idProducto: dataTempProductos[1],
            ID: dataTempProductos[2],
            item: dataTempProductos[3]
        }
        setCargaProductos(cargaFormDataProductos(dataTemp))
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
                precioUnitario: precioUnitario,
                total: totalUnitario
            }
            // console.log(dataTemp)

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );

            setCargaProductos(initialFormDataProductos)
            document.getElementById("material").value = "Elige"
            document.getElementById("cantidad").value = ""
            document.getElementById("um").value = "Elige"
            document.getElementById("precioUnitario").value = ""
            setTotalUnitario(0)
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        setCargaProductos(initialFormDataProductos)
        document.getElementById("material").value = "Elige"
        document.getElementById("cantidad").value = ""
        document.getElementById("um").value = "Elige"
        document.getElementById("precioUnitario").value = ""
        setTotalUnitario(0)
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.ID === producto.ID), 1);
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
            pais: temp[6]
        })
    }

    const totalSinIVA = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.total)), 0);

    const renglon = listProductosCargados.length + 1;

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Modificación de orden de venta
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
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
                                            <Form.Control as="select"
                                                onChange={(e) => {
                                                    handleCliente(e.target.value)
                                                }}
                                                defaultValue={informacionPedido.cliente}
                                                name="cliente"
                                            >
                                                <option>Elige una opción</option>
                                                {map(listClientes, (cliente, index) => (
                                                    <option key={index} value={cliente?.id + "/" + cliente?.calle + "/" + cliente?.numeroExterior + "/" + cliente?.colonia + "/" + cliente?.municipio + "/" + cliente?.estado + "/" + cliente?.pais} selected={cliente?.id === informacionPedido.cliente}>{cliente?.nombre + " " + cliente.apellidos}</option>
                                                ))}
                                            </Form.Control>
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
                                                type="number"
                                                placeholder="Numero de pedido"
                                                name="numeroPedido"
                                                defaultValue={informacionPedido.numeroPedido}
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
                                                defaultValue={informacionPedido.fechaPedido}
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
                                                defaultValue={informacionPedido.fechaEntrega}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <br />

                                <Row>
                                    <Form.Group as={Row} controlId="formGridCliente">
                                        <Col sm="2">
                                            <Form.Label>
                                                Inconterms
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Incoterms"
                                                name="incoterms"
                                                defaultValue={informacionPedido.incoterms}
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
                                                as="textarea" rows={3}
                                                type="text"
                                                style={{ height: '100px' }}
                                                placeholder="Condiciones de pago"
                                                name="condicionesPago"
                                                defaultValue={informacionPedido.condicionesPago}
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
                                                as="textarea" rows={3}
                                                type="text"
                                                placeholder="Lugar de entrega"
                                                style={{ height: '100px' }}
                                                name="lugarEntrega"
                                                disabled
                                                value={clienteSeleccionado == "" ? informacionPedido.lugarEntrega : clienteSeleccionado?.calle + " " + clienteSeleccionado?.numeroExterior + ", " + clienteSeleccionado?.colonia + ", " + clienteSeleccionado?.municipio + ", " + clienteSeleccionado?.estado + ", " + clienteSeleccionado?.pais}
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
                                                defaultValue={informacionPedido.especificaciones}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <br />

                                <Row>
                                    <Form.Group as={Row} className="botonesPDF">
                                        <Col sm="3">
                                            <div
                                                className="custom-input-file
                            col-md-6
                            col-sm-6
                            col-xs-6">
                                                <Form.Control
                                                    type="file"
                                                    accept='.pdf, image/*'
                                                    name="cotizacion"
                                                    defaultValue={informacionPedido.cotizacion}
                                                    className="input-file"
                                                />
                                                Adjuntar cotizacion
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Row>
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

                                {
                                    listProductosActivos &&
                                    (
                                        <>
                                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                                <Form.Label>
                                                    Material
                                                </Form.Label>
                                                {
                                                    listProductosActivos ?
                                                        (
                                                            <>
                                                                <Form.Control as="select"
                                                                    id="material"
                                                                    onChange={(e) => {
                                                                        handleProducto(e.target.value)
                                                                    }}
                                                                    defaultValue={cargaProductos.idProducto}
                                                                    name="idProducto"
                                                                >
                                                                    <option>Elige</option>
                                                                    {map(listProductosActivos, (producto, index) => (
                                                                        <option
                                                                            key={index}
                                                                            value={parseInt(index + 1) + "/" + producto.id + "/" + producto.noInterno + "/" + producto.descripcion}
                                                                        >
                                                                            {producto.noInterno}
                                                                        </option>
                                                                    ))}
                                                                </Form.Control>
                                                            </>
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                <h4>No hay productos registrados</h4>
                                                            </>
                                                        )
                                                }


                                            </Form.Group>
                                        </>
                                    )
                                }

                                <Form.Group as={Col} controlId="formGridCliente">
                                    <Form.Label>
                                        Descripcion
                                    </Form.Label>
                                    <Form.Control
                                        id="descripcion"
                                        type="text"
                                        placeholder="Descripcion"
                                        name="item"
                                        value={cargaProductos.item}
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
                                        name="cantidad"
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
                                        as="select"
                                        id="um"
                                        name="um"
                                        defaultValue={cargaProductos.um}
                                    >
                                        <option >Elige</option>
                                        <option value="KG">KG</option>
                                        <option value="Litros">Litros</option>
                                        <option value="Piezas">Piezas</option>
                                        <option value="Cajas">Cajas</option>
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
                                        onChange={(e) => { calcularTotalUnitario(e.target.value) }}
                                        defaultValue={cargaProductos.precioUnitario}
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

                            {/* Listado de productos  */}
                            <div className="tablaProductos">

                                <hr />
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
                                            <th scope="col">Material</th>
                                            <th scope="col">Descripcion</th>
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
                                                <td data-title="Material">
                                                    {producto.ID}
                                                </td>
                                                <td data-title="Descripcion">
                                                    {producto.item}
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
                                            variant="success"
                                            className="registrar"
                                        >
                                            {!loading ? "Modificar Orden de Venta" : <Spinner animation="border" />}
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant="danger"
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
            </LayoutPrincipal>
        </>
    );
}

function initialFormData(folio, fecha) {
    return {
        folio: folio,
        fechaPedido: "",
        fechaEntrega: "",
        incoterms: "",
        especificaciones: "",
        condicionesPago: "",
        ordenCompra: "",
        cotizacion: "",
        numeroPedido: "",
        lugarEntrega: ""
    }
}

// Valores iniciales para pedido
function initialValues() {
    return {
        fechaPedido: "",
        fechaEntrega: "",
        incoterms: "",
        especificaciones: "",
        condicionesPago: "",
        ordenCompra: "",
        cotizacion: "",
        numeroPedido: "",
        lugarEntrega: ""
    }
}

// Valores almacenados
function valoresAlmacenados(data) {
    const { folio, fechaPedido, fechaEntrega, cliente, incoterms, especificaciones, condicionesPago, ordenCompra, cotizacion, numeroPedido, lugarEntrega } = data;

    return {
        folio: folio,
        fechaPedido: fechaPedido,
        fechaEntrega: fechaEntrega,
        cliente: cliente,
        incoterms: incoterms,
        especificaciones: especificaciones,
        condicionesPago: condicionesPago,
        ordenCompra: ordenCompra,
        cotizacion: cotizacion,
        numeroPedido: numeroPedido,
        lugarEntrega: lugarEntrega
    }
}

function initialFormDataProductos() {
    return {
        idProducto: "",
        ID: "",
        item: "",
        cantidad: "",
        um: "",
        precioUnitario: "",
        total: ""
    }
}

function cargaFormDataProductos(data) {
    const { idProducto, ID, item } = data;

    return {
        idProducto: idProducto,
        ID: ID,
        item: item,
        cantidad: "",
        um: "",
        precioUnitario: "",
        total: ""
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

export default ModificacionVentas;
