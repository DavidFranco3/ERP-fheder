import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import BasicModal from "../../Modal/BasicModal";
import { obtenerStatusMaterial, actualizaStatusMaterial } from "../../../api/statusMaterial";
import { toast } from "react-toastify";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos, LogsInformativosLogout } from '../../Logs/LogsSistema/LogsSistema';
import { obtenerRazonSocialPorNombre } from "../../../api/razonesSociales";
import "./VistaPreviaStatus.scss";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function VistaPreviaStatus(props) {
    const { setRefreshCheckLogin } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

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

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/StatusMaterial")
    }

    // Para guardar los datos del formulario
    const [formDataCalidad, setFormDataCalidad] = useState(initialFormDataCalidadInicial());

    const params = useParams();
    const { id } = params

    const cargarDatosStatus = () => {
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
    }

    useEffect(() => {
        cargarDatosStatus();
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

    const [formDataSucursal, setFormDataSucursal] = useState(initialFormDataSucursalInitial());

    const cargarDatosRazonSocial = () => {
 //
 obtenerRazonSocialPorNombre(getSucursal()).then(response => {
    const { data } = response;
    //console.log(data)
    setFormDataSucursal(initialFormDataSucursal(data));
}).catch(e => {
    console.log(e)
})
    }

    useEffect(() => {
       cargarDatosRazonSocial();
    }, [getSucursal()]);

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

    const dataPrincipal = () => {
        let newArray = [];

        if (formDataCalidad.etiqueta === "Aceptado") {

            newArray = [
                [
                    {
                        text: `Turno:  ${formData.turno}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    },
                    {
                        text: `Nombre del ${formDataCalidad.propiedad}:  ${formData.clienteProveedor}`,
                        fontSize: 9,
                        bold: true,
                        colSpan: 2
                    },
                    {
                    }
                ],
                [
                    {
                        text: `Comentarios:  ${formData.comentarios}`,
                        fontSize: 9,
                        colSpan: 4,
                        bold: true,
                    },
                    {
                    },
                    {
                    },
                    {
                    }
                ],
            ]
        } else if (formDataCalidad.etiqueta === "Material Sospechoso") {
            newArray = [
                [
                    {
                        text: `Auditor:  ${formData.auditor}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    },
                    {
                        text: `Turno:  ${formData.turno}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    }
                ],
                [
                    {
                        text: `Condición:  ${formData.condicion}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    },
                    {
                        text: `Observaciones:  ${formData.observaciones}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    }
                ],
            ]
        } else if (formDataCalidad.etiqueta == "No Conforme") {
            newArray = [
                [
                    {
                        text: `Rechazo:  ${formData.rechazo}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    },
                    {
                        text: `Nombre del ${formDataCalidad.propiedad}:  ${formData.clienteProveedor}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    }
                ],
                [
                    {
                        text: `Turno:  ${formData.turno}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    },
                    {
                        text: `Auditor:  ${formData.auditor}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    }
                ],
                [
                    {
                        text: `Supervisor:  ${formData.supervisor}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    },
                    {
                        text: `Descripción del defecto:  ${formData.descripcionDefecto}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    }
                ],
            ]
        }
        return newArray;
    };

    const list = dataPrincipal();

    const disposicionMaterial = () => {
        let newArray = [];
        if (formDataCalidad.etiqueta == "No Conforme") {
            newArray = [
                [
                    {
                        text: `Tipo de rechazo:  ${formData.tipoRechazo}`,
                        fontSize: 9,
                        bold: true,
                    },
                    {
                        text: `Corección:  ${formData.correccion}`,
                        fontSize: 9,
                        bold: true,
                    },
                ],
                [
                    {
                        text: `Comentarios:  ${formData.comentarios}`,
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                    },
                    {
                    },
                ],
            ]
        } else {
            newArray = [
                [
                    {
                        text: '',
                        fontSize: 9,
                        bold: true,
                        border: [false, false, false, false],
                    },
                    {
                        text: '',
                        fontSize: 9,
                        bold: true,
                        border: [false, false, false, false],
                    },
                ],
                [
                    {
                        text: '',
                        fontSize: 9,
                        colSpan: 2,
                        bold: true,
                        border: [false, false, false, false],
                    },
                    {
                    },
                ],
            ]
        }
        return newArray;
    };

    const list2 = disposicionMaterial();

    const descargaPDF = async () => {

        const docDefinition = {
            pageSize: 'LETTER',
            footer: function (currentPage, pageCount) {
                return {
                    table: {
                        widths: ['100%'],
                        body: [
                            [
                                {
                                    border: [false, false, false, false],
                                    text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                                    alignment: 'right',
                                    margin: [5, 2, 10, 20]
                                }
                            ]
                        ]
                    },
                }
            },
            content: [
                {
                    alignment: 'center',
                    style: 'header',
                    image: `data:image/png;base64,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`
                },
                {
                    margin: [0, 0, 0, 10],
                    table: {
                        widths: ['50%', '50%'],
                        heights: [10, 30],
                        body: [
                            [
                                {
                                    text: `RFC:  ${formDataSucursal.rfc}`,
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: `Razón social:  ${getSucursal()}`,
                                    fontSize: 9,
                                    bold: true,
                                }
                            ],
                            [
                                {
                                    text: `Dirección:  ${formDataSucursal.calle + " #" + formDataSucursal.numeroExterior + " COL " + formDataSucursal.colonia + ", " + formDataSucursal.municipio + ", " + formDataSucursal.estado}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                        ],
                    }
                },
                {
                    style: 'tableExample',
                    margin: [0, 0, 0, 10],
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10, 10, 10, 10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Folio:  ${formDataCalidad.folio}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Propiedad:  ${formDataCalidad.propiedad}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Cantidad:  ${formDataCalidad.cantidad} KG`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Fecha:  ${dayjs(formDataCalidad.fecha).format("LL")}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Tipo material:  ${formDataCalidad.tipoMaterial}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Recibió:  ${formDataCalidad.recibio}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: [
                                        'Lote: ',
                                        {
                                            text: formDataCalidad.lote,
                                            bold: true
                                        }
                                    ],
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: [
                                        'Descripción: ',
                                        {
                                            text: formDataCalidad.nombre,
                                            bold: true
                                        }
                                    ],
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Resultado final de la inspección:  ${formDataCalidad.resultadoFinal}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Etiqueta:  ${formDataCalidad.etiqueta}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                        ]
                    }
                },
                {
                    style: 'tableExample',
                    margin: [0, 0, 0, 10],
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10, 10, 10, 10],
                        headerRows: 1,
                        body: list,
                    }
                },
                {
                    alignment: 'center',
                    text: `${formDataCalidad.etiqueta === "No Conforme" ? "Disposicion del material" : ""}`,
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    margin: [0, 0, 0, 10],
                    table: {
                        widths: ['50%', '50%'],
                        heights: [10, 30],
                        body: list2,
                    }
                },
            ],
        };

        const pdf = pdfMake.createPdf(docDefinition);
        pdf.download(`${formDataCalidad.folio}.pdf`);

    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Detalles de identificación de status del material
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
                                    <Form.Control
                                        type="text"
                                        placeholder="Folio"
                                        name="folio"
                                        value={formDataCalidad.folio}
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
                                                />
                                            </Col>
                                            <Col sm="2">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el nombre"
                                                    name="clienteProveedor"
                                                    defaultValue={formData.clienteProveedor}
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                            disabled
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
                                                            disabled
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
                                                            disabled
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
                                                            disabled
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
                                                            disabled
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
                                                            disabled
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
                                                            disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
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
                                                    disabled
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </>
                            )
                        }

                        <div className="botones">
                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <div
                                            className="generacionPDF"
                                        >
                                            <Image
                                                src={LogoPDF}
                                                className="logoPDF"
                                                onClick={() => {
                                                    descargaPDF()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className="regreso"
                                        >
                                            <Image
                                                src={Regreso}
                                                className="regresarVistaAnterior"
                                                onClick={() => {
                                                    rutaRegreso()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </div>
                    </Form>
                </div>
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataSucursalInitial() {
    return {
        rfc: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        codigoPostal: ""
    }
}

function initialFormDataSucursal(data) {
    const { rfc, direccion } = data;

    return {
        rfc: rfc,
        calle: direccion.calle,
        numeroExterior: direccion.numeroExterior,
        numeroInterior: direccion.numeroInterior,
        colonia: direccion.colonia,
        municipio: direccion.municipio,
        estado: direccion.estado,
        pais: direccion.pais,
        codigoPostal: direccion.codigoPostal
    }
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

export default VistaPreviaStatus;
