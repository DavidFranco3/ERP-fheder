import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import BuscarFactura from '../../../page/BuscarFactura';
import { listarClientes } from "../../../api/clientes";
import { registraPedidoVenta, obtenerNumeroPedidoVenta } from "../../../api/pedidoVenta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "./RegistroNota.scss"
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { registraNota ,obtenerNumeroNotaCredito, obtenerNumeroNotaCargo, obtenerNumeroNotaDevolucion } from "../../../api/notas";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingRegistro } from "../../Tracking/Gestion/GestionTracking";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import BasicModal from "../../Modal/BasicModal";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogCuentaActualizacion } from "../../CuentasClientes/Gestion/GestionCuentasClientes";
//import ModificacionProductos from '../ModificacionProductos';

function RegistroNota(props) {
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

    const enrutamiento = useNavigate();

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataFactura, setFormDataFactura] = useState(initialFormDataFactura());

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
    const buscarFactura = (content) => {
        setTitulosModal("Buscar factura");
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
        enrutamiento("/Notas");
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            if (formData.tipo == "Cargo") {
                obtenerNumeroNotaCargo().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noNota } = data;
                    setFolioActual(noNota)
                }).catch(e => {
                    console.log(e)
                })
            } else if (formData.tipo == "Credito") {
                obtenerNumeroNotaCredito().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noNota } = data;
                    setFolioActual(noNota)
                }).catch(e => {
                    console.log(e)
                })
            } else if (formData.tipo == "Devolución") {
                obtenerNumeroNotaDevolucion().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noNota } = data;
                    setFolioActual(noNota)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [formData.tipo]);

    console.log(folioActual);

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

        if (!formData.tipo) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                folio: folioActual,
                factura: formDataFactura.factura,
                tipo: formData.tipo,
                concepto: formData.concepto,
                totalSinIva: formData.tipo == "Devolución" ? formDataFactura.subtotal : formData.totalSinIVA,
                iva: formData.tipo == "Devolución" ? formDataFactura.ivaElegido : formData.iva,
                total: formData.tipo == "Devolución" ? formDataFactura.total : total,
                sucursal: getSucursal(),
                estado: "true"
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            registraNota(dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se ha registrado la nota de " + formData.tipo + folioActual, dataTemp);
                LogCuentaActualizacion(formDataFactura.cliente, formDataFactura.nombreCliente, formData.tipo == "Cargo" ? total : formData.tipo == "Credito" ? parseFloat(total) * -1 : formData.tipo == "Devolución" ? parseFloat(formDataFactura.total) * -1 : "");
                // Registro inicial del tracking
                //LogTrackingRegistro(folioActual, formData.cliente, formData.fechaElaboracion)
                setLoading(false)
                regresaListadoVentas()
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataFactura({ ...formDataFactura, [e.target.name]: e.target.value })
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
            nombreCliente: temp[6]
        })
    }

    const totalSinIVA = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.total)), 0);

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaPedido, setFechaPedido] = useState(fecha);

    const [fechaEntrega, setFechaEntrega] = useState(fecha);

    console.log(formDataFactura)

    // Calcula el total con iva de la lista de productos seleccionados
    const total = parseFloat(formData.totalSinIVA) + (parseFloat(formData.totalSinIVA) * parseFloat(formData.iva));

    console.log(total)

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva nota
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
                                            Factura
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <div className="flex items-center mb-1">
                                            <Form.Control
                                                type="text"
                                                defaultValue={formDataFactura.factura}
                                                placeholder="Buscar factura"
                                                name="factura"
                                                disabled
                                            />
                                            <FontAwesomeIcon
                                                className="cursor-pointer py-2 -ml-6"
                                                title="Buscar entre las facturas"
                                                icon={faSearch}
                                                onClick={() => {
                                                    buscarFactura(
                                                        <BuscarFactura
                                                            formData={formDataFactura}
                                                            setFormData={setFormDataFactura}
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
                                            Tipo
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            as="select"
                                            defaultValue={formData.tipo}
                                            placeholder="Tipo"
                                            name="tipo"
                                        >
                                            <option>Elige una opción</option>
                                            <option value="Cargo">Cargo</option>
                                            <option value="Credito">Credito</option>
                                            <option value="Devolución">Devolución</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Concepto
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            as="textarea"
                                            style={{ height: '100px' }}
                                            placeholder="Concepto"
                                            name="concepto"
                                            defaultValue={formData.concepto}
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Monto
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Monto"
                                            name="totalSinIVA"
                                            defaultValue={formData.tipo == "Devolución" ? formDataFactura.subtotal : formData.totalSinIVA}
                                            disabled={formData.tipo == "Devolución"}
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
                                            disabled={formData.tipo == "Devolución"}
                                        >
                                            <option>Elige una opción</option>
                                            <option value="0" selected={formData.tipo == "Devolución" && formDataFactura.ivaElegido == "0"}>0%</option>
                                            <option value="0.16" selected={formData.tipo == "Devolución" && formDataFactura.ivaElegido == "0.16"}>16%</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row>
                                <Form.Group as={Row} controlId="formGridCliente">
                                    <Col sm="2">
                                        <Form.Label>
                                            Total
                                        </Form.Label>
                                    </Col>
                                    <Col sm="4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Total"
                                            name="total"
                                            value={formData.tipo == "Devolución" ? formDataFactura.total : total}
                                            disabled
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />
                        </div>
                        <br />

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
        tipo: "",
        concepto: "",
        totalSinIVA: "",
        iva: "",
        total: ""
    }
}

function initialFormDataFactura() {
    return {
        factura: "",
        ivaElegido: "",
        subtotal: "",
        total: "",
        cliente: "",
        nombreCliente: ""
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

export default RegistroNota;
