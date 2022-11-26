import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import BuscarInspeccionCalidad from "../BuscarInspeccionCalidad";
import BasicModal from "../../Modal/BasicModal";
import { obtenerStatusMaterial, actualizaStatusMaterial } from "../../../api/statusMaterial";
import { toast } from "react-toastify";

function ModificaStatus(props) {

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/StatusMaterial")
    }

    const params = useParams();
    const { id } = params

    useEffect(() => {
        //
        obtenerStatusMaterial(id).then(response => {
            const { data } = response;
            //console.log(data)
            const { folioInspeccion, propiedadInspeccion, cantidadInspeccion, fechaInspeccion, tipoMaterialInspeccion, recibioInspeccion, loteInspeccion, nombreInspeccion, resultadoInspeccion, etiqueta, fecha, descripcionMaterial, rechazo, nombre, auditor, supervisor, descripcionDefecto, cantidad, tipoRechazo, correccion, clienteProveedor, lote, recibio, turno, propiedad, liberacion, descripcion, comentarios, condicion, observaciones } = data;
            const dataTemp = {
                folioInspeccion: folioInspeccion,
                propiedadInspeccion: propiedadInspeccion,
                cantidadInspeccion: cantidadInspeccion,
                fechaInspeccion: fechaInspeccion,
                tipoMaterialInspeccion: tipoMaterialInspeccion,
                recibioInspeccion: recibioInspeccion,
                loteInspeccion: loteInspeccion,
                nombreInspeccion: nombreInspeccion,
                resultadoInspeccion: resultadoInspeccion,
                etiqueta: etiqueta,
                fecha: fecha,
                descripcionMaterial: descripcionMaterial,
                rechazo: rechazo,
                nombre: nombre,
                auditor: auditor,
                supervisor: supervisor,
                descripcionDefecto: descripcionDefecto,
                cantidad: cantidad,
                tipoRechazo: tipoRechazo,
                correccion: correccion,
                clienteProveedor: clienteProveedor,
                lote: lote,
                recibio: recibio,
                turno: turno,
                propiedad: propiedad,
                liberacion: liberacion,
                descripcion: descripcion,
                comentarios: comentarios,
                condicion: condicion,
                observaciones: observaciones
            }
            setFormData(valoresAlmacenados(dataTemp))
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


        if (formData.etiqueta === "Aceptado") {


            if (!formData.etiqueta || !formData.fecha || !formData.clienteProveedor || !formData.lote || !formData.recibio || !formData.turno || !formData.propiedad || !formData.liberacion || !formData.descripcion || !formData.comentarios) {
                toast.warning("Completa el formulario");
            } else {
                //console.log("Continuar")
                setLoading(true)

                const dataTemp = {
                    folioInspeccion: folio == "" ? formData.folioInspeccion : folio,
                    propiedadInspeccion: propiedad == "" ? formData.propiedadInspeccion : propiedad,
                    cantidadInspeccion: cantidad == "" ? formData.cantidadInspeccion : cantidad,
                    fechaInspeccion: fecha == "" ? formData.fechaInspeccion : fecha,
                    tipoMaterialInspeccion: tipoMaterial == "" ? formData.tipoMaterialInspeccion : tipoMaterial,
                    recibioInspeccion: recibio == "" ? formData.recibioInspeccion : recibio,
                    loteInspeccion: lote == "" ? formData.loteInspeccion : lote,
                    nombreInspeccion: nombre == "" ? formData.nombreInspeccion : nombre,
                    resultadoInspeccion: resultadoFinal == "" ? formData.resultadoInspeccion : resultadoFinal,
                    etiqueta: formData.etiqueta,
                    fecha: formData.fecha,
                    clienteProveedor: formData.clienteProveedor,
                    lote: formData.lote,
                    recibio: formData.recibio,
                    turno: formData.turno,
                    propiedad: formData.propiedad,
                    liberacion: formData.liberacion,
                    descripcion: formData.descripcion,
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
        } else if (formData.etiqueta === "No Conforme") {
            if (!formData.etiqueta || !formData.fecha || !formData.descripcionMaterial || !formData.rechazo || !formData.nombre || !formData.clienteProveedor || !formData.turno || !formData.auditor || !formData.supervisor || !formData.descripcionDefecto || !formData.cantidad || !formData.tipoRechazo || !formData.correccion || !formData.comentarios) {
                toast.warning("Completa el formulario");
            } else {
                //console.log("Continuar")
                setLoading(true)

                // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking

                const dataTemp = {
                    folioInspeccion: folio == "" ? formData.folioInspeccion : folio,
                    propiedadInspeccion: propiedad == "" ? formData.propiedadInspeccion : propiedad,
                    cantidadInspeccion: cantidad == "" ? formData.cantidadInspeccion : cantidad,
                    fechaInspeccion: fecha == "" ? formData.fechaInspeccion : fecha,
                    tipoMaterialInspeccion: tipoMaterial == "" ? formData.tipoMaterialInspeccion : tipoMaterial,
                    recibioInspeccion: recibio == "" ? formData.recibioInspeccion : recibio,
                    loteInspeccion: lote == "" ? formData.loteInspeccion : lote,
                    nombreInspeccion: nombre == "" ? formData.nombreInspeccion : nombre,
                    resultadoInspeccion: resultadoFinal == "" ? formData.resultadoInspeccion : resultadoFinal,
                    etiqueta: formData.etiqueta,
                    fecha: formData.fecha,
                    descripcionMaterial: formData.descripcionMaterial,
                    rechazo: formData.rechazo,
                    nombre: formData.nombre,
                    clienteProveedor: formData.clienteProveedor,
                    turno: formData.turno,
                    auditor: formData.auditor,
                    supervisor: formData.supervisor,
                    descripcionDefecto: formData.descripcionDefecto,
                    cantidad: formData.cantidad,
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

        } else if (formData.etiqueta === "Material Sospechoso") {
            if (!formData.etiqueta || !formData.fecha || !formData.turno || !formData.descripcionMaterial || !formData.auditor || !formData.condicion || !formData.observaciones) {
                toast.warning("Completa el formulario");
            } else {
                //console.log("Continuar")
                setLoading(true)
                // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking

                const dataTemp = {
                    folioInspeccion: folio == "" ? formData.folioInspeccion : folio,
                    propiedadInspeccion: propiedad == "" ? formData.propiedadInspeccion : propiedad,
                    cantidadInspeccion: cantidad == "" ? formData.cantidadInspeccion : cantidad,
                    fechaInspeccion: fecha == "" ? formData.fechaInspeccion : fecha,
                    tipoMaterialInspeccion: tipoMaterial == "" ? formData.tipoMaterialInspeccion : tipoMaterial,
                    recibioInspeccion: recibio == "" ? formData.recibioInspeccion : recibio,
                    loteInspeccion: lote == "" ? formData.loteInspeccion : lote,
                    nombreInspeccion: nombre == "" ? formData.nombreInspeccion : nombre,
                    resultadoInspeccion: resultadoFinal == "" ? formData.resultadoInspeccion : resultadoFinal,
                    etiqueta: formData.etiqueta,
                    fecha: formData.fecha,
                    turno: formData.turno,
                    descripcionMaterial: formData.descripcionMaterial,
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

    console.log(formData)

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
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <br />
            <br />

            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Col align="right">
                                <Button
                                    variant="success"
                                    className="agregar"
                                    onClick={() => {
                                        buscarInspeccionCalidad(
                                            <BuscarInspeccionCalidad
                                                setFolio={setFolio}
                                                setFecha={setFecha}
                                                setLote={setLote}
                                                setPropiedad={setPropiedad}
                                                setTipoMaterial={setTipoMaterial}
                                                setNombre={setNombre}
                                                setCantidad={setCantidad}
                                                setRecibio={setRecibio}
                                                setResultadoFinal={setResultadoFinal}
                                                setShowModal={setShowModal}
                                            />)
                                    }}
                                >
                                    Buscar inspeccion de calidad
                                </Button>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                    <Form.Label>
                                        Folio:
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Folio"
                                        name="folio"
                                        value={folio == "" ? formData.folioInspeccion : folio}
                                        disabled
                                    />
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
                                        value={propiedad == "" ? formData.propiedadInspeccion : propiedad}
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
                                        value={cantidad == "" ? formData.cantidadInspeccion : cantidad}
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
                                        value={fecha == "" ? formData.fechaInspeccion : fecha}
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
                                        value={tipoMaterial == "" ? formData.tipoMaterialInspeccion : tipoMaterial}
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
                                        value={recibio == "" ? formData.recibioInspeccion : recibio}
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
                                        value={lote == "" ? formData.loteInspeccion : lote}
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
                                        value={nombre == "" ? formData.nombreInspeccion : nombre}
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
                                        value={resultadoFinal == "" ? formData.resultadoInspeccion : resultadoFinal}
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
                                        defaultValue={formData.etiqueta}
                                        required
                                    >
                                        <option>Elige una opción</option>
                                        <option value="Aceptado" selected={formData.etiqueta == "Aceptado"}>Aceptado</option>
                                        <option value="No Conforme" selected={formData.etiqueta == "No Conforme"}>No conforme</option>
                                        <option value="Material Sospechoso" selected={formData.etiqueta == "Material Sospechoso"}>Material sospechoso</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        {
                            formData.etiqueta === "Aceptado" &&
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
                                                    defaultValue={formData.fecha}
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
                                                    defaultValue={formData.lote}
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
                                                    defaultValue={formData.recibio}
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
                                                    type="number"
                                                    placeholder="Escribe el turno"
                                                    name="turno"
                                                    defaultValue={formData.turno}
                                                />
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
                                                    defaultValue={formData.propiedad}
                                                >
                                                    <option>Elige una opción</option>
                                                    <option value="Cliente" selected={formData.propiedad == "Cliente"}>Cliente</option>
                                                    <option value="Proveedor" selected={formData.propiedad == "Proveedor"}>Proveedor</option>
                                                    <option value="Fredher" selected={formData.propiedad == "Fredher"}>Fredher</option>
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
                                                    as="select"
                                                    name="liberacion"
                                                    defaultValue={formData.liberacion}
                                                >
                                                    <option>Elige una opción</option>
                                                    <option value="Miscelaneos" selected={formData.liberacion == "Miscelaneos"}>Miscelaneos</option>
                                                    <option value="Materia prima" selected={formData.liberacion == "Materia prima"}>Materia prima</option>
                                                    <option value="Pigmento" selected={formData.liberacion == "Pigmento"}>Pigmento</option>
                                                    <option value="Master Batch" selected={formData.liberacion == "Master Batch"}>Master Batch</option>
                                                </Form.Control>
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
                                                    name="descripcion"
                                                    defaultValue={formData.descripcion}
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
                            formData.etiqueta === "No Conforme" &&
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
                                                    defaultValue={formData.fecha}
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
                                                    defaultValue={formData.descripcionMaterial}
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
                                                    name="nombre"
                                                    defaultValue={formData.nombre}
                                                    id="Proveedor"
                                                    checked={formData.nombre == "proveedor"}
                                                />
                                            </Col>
                                            <Col sm={1}>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="cliente"
                                                    type="radio"
                                                    label="Cliente"
                                                    name="nombre"
                                                    defaultValue={formData.nombre}
                                                    id="Cliente"
                                                    checked={formData.nombre == "cliente"}
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
                                                    type="number"
                                                    placeholder="Escribe el turno"
                                                    name="turno"
                                                    defaultValue={formData.turno}
                                                />
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
                                                    defaultValue={formData.cantidad}
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
                                </>
                            )
                        }

                        {
                            formData.etiqueta === "Material Sospechoso" &&
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
                                                    defaultValue={formData.fecha}
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
                                                    type="number"
                                                    placeholder="Escribe el turno"
                                                    name="turno"
                                                    defaultValue={formData.turno}
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
                                            <Col sm="5">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripción del material"
                                                    name="descripcionMaterial"
                                                    defaultValue={formData.descripcionMaterial}
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
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Modificar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
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

export default ModificaStatus;
