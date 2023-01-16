import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import BuscarInspeccionCalidad from "../BuscarInspeccionCalidad";
import BasicModal from "../../Modal/BasicModal";
import { obtenerStatusMaterial, actualizaStatusMaterial } from "../../../api/statusMaterial";
import { toast } from "react-toastify";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos } from '../../Logs/LogsSistema/LogsSistema';
import BuscarCalidad from '../../../page/BuscarCalidad/BuscarCalidad';

function ModificaStatus(props) {
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

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/StatusMaterial")
    }

    // Para guardar los datos del formulario
    const [formDataCalidad, setFormDataCalidad] = useState(initialFormDataCalidadInicial());

    const params = useParams();
    const { id } = params

    useEffect(() => {
        //
        obtenerStatusMaterial(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(valoresAlmacenados(data));
            setFormDataCalidad(initialFormDataCalidad(data));
            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const buscarInspeccionCalidad = (content) => {
        setTitulosModal("Buscar Inspeccion de calidad");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar el folio
    const [folio, setFolio] = useState("");

    // Para almacenar la fecha
    const [fecha, setFecha] = useState("");

    // Para almacenar el lote
    const [lote, setLote] = useState("");

    // Para almacenar la propiedad
    const [propiedad, setPropiedad] = useState("");

    // Para almacenar el tipo de material
    const [tipoMaterial, setTipoMaterial] = useState("");

    // Para el nombre
    const [nombre, setNombre] = useState("");

    // para alamcenar la cantidad
    const [cantidad, setCantidad] = useState("");

    // Para alamcenar el nombre de quien recibe
    const [recibio, setRecibio] = useState("");

    // Para almacenar el resultado final de la inspeccion
    const [resultadoFinal, setResultadoFinal] = useState("");

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();


        if (formDataCalidad.etiqueta === "Aceptado") {


            if (!formData.clienteProveedor || !formData.turno || !formData.comentarios) {
                toast.warning("Completa el formulario");
            } else {
                //console.log("Continuar")
                setLoading(true)

                const dataTemp = {
                    folioInspeccion: formDataCalidad.folio,
                    propiedadInspeccion: formDataCalidad.propiedad,
                    cantidadInspeccion: formDataCalidad.cantidad,
                    fechaInspeccion: formDataCalidad.fecha,
                    tipoMaterialInspeccion: formDataCalidad.tipoMaterial,
                    recibioInspeccion: formDataCalidad.recibio,
                    loteInspeccion: formDataCalidad.lote,
                    nombreInspeccion: formDataCalidad.nombre,
                    resultadoInspeccion: formDataCalidad.resultadoFinal,
                    etiqueta: formDataCalidad.etiqueta,
                    fecha: formDataCalidad.fecha,
                    clienteProveedor: formData.clienteProveedor,
                    lote: formDataCalidad.lote,
                    recibio: formDataCalidad.recibio,
                    turno: formData.turno,
                    propiedad: formDataCalidad.propiedad,
                    liberacion: formDataCalidad.tipoMaterial,
                    descripcion: formDataCalidad.nombre,
                    comentarios: formData.comentarios
                }

                // Modificar el pedido creado recientemente
                actualizaStatusMaterial(id, dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    toast.success(mensaje);
                    LogsInformativos("Se a modificado el status de material " + dataTemp.folioInspeccion, dataTemp);
                    // Log acerca del registro inicial del tracking
                    //LogsInformativos(`Se han registrado la orden de venta con folio ${data.noVenta}`, datos)
                    // Registro inicial del tracking
                    //LogTrackingRegistro(data.noVenta, clienteSeleccionado.id, formData.fechaElaboracion)
                    setLoading(false)
                    rutaRegreso()
                }).catch(e => {
                    console.log(e)
                })
            }
        } else if (formDataCalidad.etiqueta === "No Conforme") {
            if (!formData.rechazo || !formData.nombre || !formData.clienteProveedor || !formData.turno || !formData.auditor || !formData.supervisor || !formData.descripcionDefecto || !formData.cantidad || !formData.tipoRechazo || !formData.correccion || !formData.comentarios) {
                toast.warning("Completa el formulario");
            } else {
                //console.log("Continuar")
                setLoading(true)

                // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking

                const dataTemp = {
                    folioInspeccion: formDataCalidad.folio,
                    propiedadInspeccion: formDataCalidad.propiedad,
                    cantidadInspeccion: formDataCalidad.cantidad,
                    fechaInspeccion: formDataCalidad.fecha,
                    tipoMaterialInspeccion: formDataCalidad.tipoMaterial,
                    recibioInspeccion: formDataCalidad.recibio,
                    loteInspeccion: formDataCalidad.lote,
                    nombreInspeccion: formDataCalidad.nombre,
                    resultadoInspeccion: formDataCalidad.resultadoFinal,
                    etiqueta: formDataCalidad.etiqueta,
                    fecha: formDataCalidad.fecha,
                    descripcionMaterial: formDataCalidad.nombre,
                    rechazo: formData.rechazo,
                    nombre: formDataCalidad.propiedad,
                    clienteProveedor: formData.clienteProveedor,
                    turno: formData.turno,
                    auditor: formData.auditor,
                    supervisor: formData.supervisor,
                    descripcionDefecto: formData.descripcionDefecto,
                    cantidad: formDataCalidad.cantidad,
                    tipoRechazo: formData.tipoRechazo,
                    correccion: formData.correccion,
                    comentarios: formData.comentarios
                }

                // Modificar el pedido creado recientemente
                actualizaStatusMaterial(id, dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    toast.success(mensaje)
                    // Log acerca del registro inicial del tracking
                    //LogsInformativos(`Se han registrado la orden de venta con folio ${data.noVenta}`, datos)
                    // Registro inicial del tracking
                    //LogTrackingRegistro(data.noVenta, clienteSeleccionado.id, formData.fechaElaboracion)
                    setLoading(false)
                    rutaRegreso()
                }).catch(e => {
                    console.log(e)
                })
            }

        } else if (formDataCalidad.etiqueta === "Material Sospechoso") {
            if (!formData.turno || !formData.auditor || !formData.condicion || !formData.observaciones) {
                toast.warning("Completa el formulario");
            } else {
                //console.log("Continuar")
                setLoading(true)
                // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking

                const dataTemp = {
                    folioInspeccion: formDataCalidad.folio,
                    propiedadInspeccion: formDataCalidad.propiedad,
                    cantidadInspeccion: formDataCalidad.cantidad,
                    fechaInspeccion: formDataCalidad.fecha,
                    tipoMaterialInspeccion: formDataCalidad.tipoMaterial,
                    recibioInspeccion: formDataCalidad.recibio,
                    loteInspeccion: formDataCalidad.lote,
                    nombreInspeccion: formDataCalidad.nombre,
                    resultadoInspeccion: formDataCalidad.resultadoFinal,
                    etiqueta: formDataCalidad.etiqueta,
                    fecha: formDataCalidad.fecha,
                    turno: formData.turno,
                    descripcionMaterial: formDataCalidad.nombre,
                    auditor: formData.auditor,
                    condicion: formData.condicion,
                    observaciones: formData.observaciones
                }

                // Modificar el pedido creado recientemente
                actualizaStatusMaterial(id, dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    toast.success(mensaje)
                    // Log acerca del registro inicial del tracking
                    //LogsInformativos(`Se han registrado la orden de venta con folio ${data.noVenta}`, datos)
                    // Registro inicial del tracking
                    //LogTrackingRegistro(data.noVenta, clienteSeleccionado.id, formData.fechaElaboracion)
                    setLoading(false)
                    rutaRegreso()
                }).catch(e => {
                    console.log(e)
                })
            }
        }

    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Identificación de status del material

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

            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <br />
                        <br />
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                    <Form.Label>
                                        Folio:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <div className="flex items-center mb-1">
                                        <Form.Control
                                            type="text"
                                            placeholder="Folio"
                                            name="folio"
                                            value={formDataCalidad.folio}
                                            disabled
                                        />
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre los productos"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarInspeccionCalidad(
                                                    <BuscarCalidad
                                                        formData={formDataCalidad}
                                                        setFormData={setFormDataCalidad}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        />
                                    </div>
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Propiedad:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Propiedad"
                                        name="propiedadEncontrada"
                                        value={formDataCalidad.propiedad}
                                        disabled
                                    />
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Cantidad:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cantidad"
                                        name="cantidad"
                                        value={formDataCalidad.cantidad}
                                        disabled
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>
                                        Kg
                                    </Form.Label>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                    <Form.Label>
                                        Fecha:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fechaEncontrada"
                                        value={formDataCalidad.fecha}
                                        disabled
                                    />
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Tipo de material:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tipo de material"
                                        name="tipoMaterial"
                                        value={formDataCalidad.tipoMaterial}
                                        disabled
                                    />
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Recibio:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Recibio"
                                        name="recibio"
                                        value={formDataCalidad.recibio}
                                        disabled
                                    />
                                </Col>
                                <Col>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                    <Form.Label>
                                        Lote:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Lote"
                                        name="loteEncontrado"
                                        value={formDataCalidad.lote}
                                        disabled
                                    />
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Nombre/Descripcion:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre/Descripción"
                                        name="nombreDescripcion"
                                        value={formDataCalidad.nombre}
                                        disabled
                                    />
                                </Col>

                                <Col>
                                    <Form.Label>
                                        Resultado de inspección final:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Resultado de inspección final"
                                        name="resultado"
                                        value={formDataCalidad.resultadoFinal}
                                        disabled
                                    />
                                </Col>
                                <Col>
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Selección de etiqueta:
                                    </Form.Label>
                                </Col>
                                <Col sm="5">
                                    <Form.Control as="select"
                                        name="etiqueta"
                                        id="etiqueta"
                                        defaultValue={formDataCalidad.etiqueta}
                                        disabled
                                    >
                                        <option>Elige una opción</option>
                                        <option value="Aceptado" selected={formDataCalidad.etiqueta == "Aceptado"}>Aceptado</option>
                                        <option value="No Conforme" selected={formDataCalidad.etiqueta == "No Conforme"}>No conforme</option>
                                        <option value="Material Sospechoso" selected={formDataCalidad.etiqueta == "Material Sospechoso"}>Material sospechoso</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        {
                            formDataCalidad.etiqueta === "Aceptado" &&
                            (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="1">
                                                <Form.Label>
                                                    Fecha
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Escribe la fecha"
                                                    name="fecha"
                                                    defaultValue={formDataCalidad.fecha}
                                                />
                                            </Col>

                                            <Col sm="1">
                                                <Form.Label>
                                                    Cliente/Proveedor
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el cliente o proveedor"
                                                    name="clienteProveedor"
                                                    defaultValue={formData.clienteProveedor}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="1">
                                                <Form.Label>
                                                    Lote
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el lote"
                                                    name="lote"
                                                    defaultValue={formDataCalidad.lote}
                                                />
                                            </Col>

                                            <Col sm="1">
                                                <Form.Label>
                                                    Recibio
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe del que recibio"
                                                    name="recibio"
                                                    defaultValue={formDataCalidad.recibio}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="1">
                                                <Form.Label>
                                                    Turno
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    as="select"
                                                    placeholder="Escribe el turno"
                                                    name="turno"
                                                    defaultValue={formData.turno}
                                                >
                                                    <option>Elige una opción</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </Form.Control>
                                            </Col>

                                            <Col sm="1">
                                                <Form.Label>
                                                    Propiedad
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    as="select"
                                                    name="propiedad"
                                                    defaultValue={formDataCalidad.propiedad}
                                                >
                                                    <option>Elige una opción</option>
                                                    <option value="Cliente" selected={formDataCalidad.propiedad = "Cliente"}>Cliente</option>
                                                    <option value="Proveedor" selected={formDataCalidad.propiedad = "Proveedor"}>Proveedor</option>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="1">
                                                <Form.Label>
                                                    Liberación de
                                                </Form.Label>
                                            </Col>
                                            <Col sm="3">
                                                <Form.Control
                                                    type="text"
                                                    placeholder='Liberacion'
                                                    name="tipoMaterial"
                                                    defaultValue={formDataCalidad.tipoMaterial}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="1">
                                                <Form.Label>
                                                    Descripción
                                                </Form.Label>
                                            </Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe la descripción"
                                                    name="nombre"
                                                    defaultValue={formDataCalidad.nombre}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="1">
                                                <Form.Label>
                                                    Comentarios
                                                </Form.Label>
                                            </Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe los comentarios"
                                                    name="comentarios"
                                                    defaultValue={formData.comentarios}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </>
                            )
                        }

                        {
                            formDataCalidad.etiqueta === "No Conforme" &&
                            (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Fecha
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Escribe la fecha"
                                                    defaultValue={formDataCalidad.fecha}
                                                    name="fecha"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Descripción del material
                                                </Form.Label>
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe la descripción del material"
                                                    defaultValue={formDataCalidad.nombre}
                                                    name="descripcionMaterial"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm={2}>
                                                <Form.Label>
                                                    Rechazo
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="interno"
                                                    type="radio"
                                                    label="Interno"
                                                    name="rechazo"
                                                    id="interno"
                                                    defaultValue={formData.rechazo}
                                                    checked={formData.rechazo == "interno"}
                                                />
                                            </Col>
                                            <Col sm={1}>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="externo"
                                                    type="radio"
                                                    label="Externo"
                                                    name="rechazo"
                                                    id="externo"
                                                    defaultValue={formData.rechazo}
                                                    checked={formData.rechazo == "externo"}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm={2}>
                                                <Form.Label>
                                                    Nombre
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="proveedor"
                                                    type="radio"
                                                    label="Proveedor"
                                                    name="propiedad"
                                                    defaultValue={formDataCalidad.propiedad}
                                                    checked={formDataCalidad.propiedad == "Proveedor"}
                                                    id="Proveedor"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="cliente"
                                                    type="radio"
                                                    label="Cliente"
                                                    name="propiedad"
                                                    defaultValue={formDataCalidad.propiedad}
                                                    checked={formDataCalidad.propiedad == "Cliente"}
                                                    id="Cliente"
                                                />
                                            </Col>
                                            <Col sm="2">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el nombre"
                                                    name="clienteProveedor"
                                                    defaultValue={formData.clienteProveedor}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Turno
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    as="select"
                                                    placeholder="Escribe el turno"
                                                    name="turno"
                                                    defaultValue={formData.turno}
                                                >
                                                    <option>Elige una opción</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Auditor
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el nombre del auditor"
                                                    name="auditor"
                                                    defaultValue={formData.auditor}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Supervisor
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el nombre del supervisor"
                                                    name="supervisor"
                                                    defaultValue={formData.supervisor}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Descripción del defecto
                                                </Form.Label>
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe la descripción del defecto"
                                                    name="descripcionDefecto"
                                                    defaultValue={formData.descripcionDefecto}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Cantidad
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe la cantidad"
                                                    name="cantidad"
                                                    defaultValue={formDataCalidad.cantidad}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <div className="datosGenerales">
                                        <Container fluid>
                                            <br />
                                            <div className="tituloSeccion">
                                                <h4>
                                                    Disposicion del material
                                                </h4>
                                            </div>

                                            <br />
                                            <Row className="mb-3">
                                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                                    <Col sm={2}>
                                                        <Form.Label>
                                                            Rechazo
                                                        </Form.Label>
                                                    </Col>
                                                    <Col sm={1}>
                                                        <Form.Check
                                                            value="moler"
                                                            type="radio"
                                                            label="Moler"
                                                            name="tipoRechazo"
                                                            id="moler"
                                                            defaultValue={formData.tipoRechazo}
                                                            checked={formData.tipoRechazo == "moler"}
                                                        />
                                                    </Col>
                                                    <Col sm={1}>
                                                    </Col>
                                                    <Col sm={1}>
                                                        <Form.Check
                                                            value="retrabajar"
                                                            type="radio"
                                                            label="Retrabajar"
                                                            name="tipoRechazo"
                                                            id="retrabajar"
                                                            defaultValue={formData.tipoRechazo}
                                                            checked={formData.tipoRechazo == "retrabajar"}
                                                        />
                                                    </Col>
                                                    <Col sm={1}>
                                                    </Col>
                                                    <Col sm={1}>
                                                        <Form.Check
                                                            value="consecion"
                                                            type="radio"
                                                            label="Conseción"
                                                            name="tipoRechazo"
                                                            id="consecion"
                                                            defaultValue={formData.tipoRechazo}
                                                            checked={formData.tipoRechazo == "consecion"}
                                                        />
                                                    </Col>
                                                    <Col sm={1}>
                                                    </Col>
                                                    <Col sm={1}>
                                                        <Form.Check
                                                            value="otro"
                                                            type="radio"
                                                            label="Otro"
                                                            name="tipoRechazo"
                                                            id="otro"
                                                            defaultValue={formData.tipoRechazo}
                                                            checked={formData.tipoRechazo == "otro"}
                                                        />
                                                    </Col>
                                                    <Col sm={1}>
                                                    </Col>
                                                    <Col sm={1}>
                                                        <Form.Check
                                                            value="re-inspeccion"
                                                            type="radio"
                                                            label="Reinspección"
                                                            name="tipoRechazo"
                                                            id="reinspeccion"
                                                            defaultValue={formData.tipoRechazo}
                                                            checked={formData.tipoRechazo == "re-inspeccion"}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                                    <Col sm="2">
                                                        <Form.Label>
                                                            Corrección
                                                        </Form.Label>
                                                    </Col>
                                                    <Col sm="9">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Escribe la correccion"
                                                            name="correccion"
                                                            defaultValue={formData.correccion}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                                    <Col sm="2">
                                                        <Form.Label>
                                                            Comentarios
                                                        </Form.Label>
                                                    </Col>
                                                    <Col sm="9">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Escribe los comentarios"
                                                            name="comentarios"
                                                            defaultValue={formData.comentarios}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                            </Row>

                                        </Container>
                                    </div>
                                </>
                            )
                        }

                        {
                            formDataCalidad.etiqueta === "Material Sospechoso" &&
                            (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Fecha
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Escribe la fecha"
                                                    name="fecha"
                                                    defaultValue={formDataCalidad.fecha}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Turno
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    as="select"
                                                    placeholder="Escribe el turno"
                                                    name="turno"
                                                    defaultValue={formData.turno}
                                                >
                                                    <option>Elige una opción</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Descripción del material
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripción del material"
                                                    name="descripcionMaterial"
                                                    defaultValue={formDataCalidad.nombre}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Nombre del auditor
                                                </Form.Label>
                                            </Col>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el nombre del auditor"
                                                    name="auditor"
                                                    defaultValue={formData.auditor}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Condición
                                                </Form.Label>
                                            </Col>
                                            <Col sm="7">
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="Condición"
                                                    name="condicion"
                                                    defaultValue={formData.condicion}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Observaciones
                                                </Form.Label>
                                            </Col>
                                            <Col sm="7">
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="observaciones"
                                                    name="observaciones"
                                                    defaultValue={formData.observaciones}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </>
                            )
                        }

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
        etiqueta: "",
        fecha: "",
        clienteProveedor: "",
        lote: "",
        recibio: "",
        turno: "",
        propiedad: "",
        liberacion: "",
        descripcion: "",
        comentarios: "",
        descripcionMaterial: "",
        rechazo: "",
        nombre: "",
        auditor: "",
        supervisor: "",
        descripcionDefecto: "",
        cantidad: "",
        tipoRechazo: "",
        correccion: "",
        condicion: ""
    }
}

function valoresAlmacenados(data) {
    return {
        folioInspeccion: data.folioInspeccion,
        propiedadInspeccion: data.propiedadInspeccion,
        cantidadInspeccion: data.cantidadInspeccion,
        fechaInspeccion: data.fechaInspeccion,
        tipoMaterialInspeccion: data.tipoMaterialInspeccion,
        recibioInspeccion: data.recibioInspeccion,
        loteInspeccion: data.loteInspeccion,
        nombreInspeccion: data.nombreInspeccion,
        resultadoInspeccion: data.resultadoInspeccion,
        etiqueta: data.etiqueta,
        fecha: data.fecha,
        descripcionMaterial: data.descripcionMaterial,
        rechazo: data.rechazo,
        nombre: data.nombre,
        auditor: data.auditor,
        supervisor: data.supervisor,
        descripcionDefecto: data.descripcionDefecto,
        cantidad: data.cantidad,
        tipoRechazo: data.tipoRechazo,
        correccion: data.correccion,
        clienteProveedor: data.clienteProveedor,
        lote: data.lote,
        recibio: data.recibio,
        turno: data.turno,
        propiedad: data.propiedad,
        liberacion: data.liberacion,
        descripcion: data.descripcion,
        comentarios: data.comentarios,
        condicion: data.condicion,
        observaciones: data.observaciones
    }
}

function initialFormDataCalidadInicial() {
    return {
        folio: "",
        propiedad: "",
        cantidad: "",
        fecha: "",
        tipoMaterial: "",
        recibio: "",
        lote: "",
        nombre: "",
        resultadoFinal: "",
        etiqueta: ""
    }
}

function initialFormDataCalidad(data) {
    return {
        folio: data.folioInspeccion,
        propiedad: data.propiedadInspeccion,
        cantidad: data.cantidadInspeccion,
        fecha: data.fechaInspeccion,
        tipoMaterial: data.tipoMaterialInspeccion,
        recibio: data.recibioInspeccion,
        lote: data.loteInspeccion,
        nombre: data.nombreInspeccion,
        resultadoFinal: data.resultadoInspeccion,
        etiqueta: data.etiqueta
    }
}

export default ModificaStatus;
