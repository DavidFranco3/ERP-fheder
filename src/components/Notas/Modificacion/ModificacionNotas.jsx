import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import BuscarFactura from '../../../page/BuscarFactura';
import { listarClientes } from "../../../api/clientes";
import { registraPedidoVenta, obtenerNumeroPedidoVenta } from "../../../api/pedidoVenta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "./ModificacionNotas.scss"
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { actualizaNotas, obtenerNotas } from "../../../api/notas";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import { LogTrackingRegistro } from "../../Tracking/Gestion/GestionTracking";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import BasicModal from "../../Modal/BasicModal";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
//import ModificacionProductos from '../ModificacionProductos';

function ModificacionNotas(props) {
    const { history, setRefreshCheckLogin, location } = props;

    const parametros = useParams();
    const { id } = parametros

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
    const [formData, setFormData] = useState(initialFormDataInitial());

    // Para guardar los datos del formulario
    const [formDataFactura, setFormDataFactura] = useState(initialFormDataFacturaInitial());

    const cargarDatosNotas = () => {
        //
        obtenerNotas(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(initialFormData(data));
            setFormDataFactura(initialFormDataFactura(data));
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarDatosNotas();
    }, []);

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

    // Para almacenar la lista completa de clientes
    const [listProductosOV, setListProductosOV] = useState([]);

    const renglon = listProductosCargados.length + 1;

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.tipo) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                factura: formDataFactura.factura,
                concepto: formData.concepto,
                totalSinIva: formData.tipo == "Devolución" ? formDataFactura.subtotal : formData.totalSinIVA,
                iva: formData.tipo == "Devolución" ? formDataFactura.ivaElegido : formData.iva,
                total: formData.tipo == "Devolución" ? formDataFactura.total : total,
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            actualizaNotas(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se ha actualizado la nota de " + formData.tipo + formData.folio, dataTemp)
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
                            Modificando nota
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
                                            Cuenta por cobrar
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
                                            disabled
                                        >
                                            <option>Elige una opción</option>
                                            <option value="Cargo" selected={formData.tipo == "Cargo"}>Cargo</option>
                                            <option value="Credito" selected={formData.tipo == "Credito"}>Credito</option>
                                            <option value="Devolución" selected={formData.tipo == "Devolución"}>Devolución</option>
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
                                            <option value="0" selected={formData.tipo == "Devolución" && formDataFactura.ivaElegido == "0" || formData.iva == "0"}>0%</option>
                                            <option value="0.16" selected={formData.tipo == "Devolución" && formDataFactura.ivaElegido == "0.16" || formData.iva == "0.16"}>16%</option>
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

function initialFormDataInitial() {
    return {
        tipo: "",
        concepto: "",
        totalSinIVA: "",
        iva: "",
        total: ""
    }
}

function initialFormDataFacturaInitial() {
    return {
        factura: "",
        ivaElegido: "",
        subtotal: "",
        total: ""
    }
}

function initialFormData(data) {
    return {
        folio: data.folio,
        tipo: data.tipo,
        concepto: data.concepto,
        totalSinIVA: data.totalSinIva,
        iva: data.iva,
        total: data.total
    }
}

function initialFormDataFactura(data) {
    return {
        factura: data.factura,
        ivaElegido: data.iva,
        subtotal: data.totalSinIva,
        total: data.total
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

export default ModificacionNotas;
