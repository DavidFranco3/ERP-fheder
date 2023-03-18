import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import "./VistaPreviaCalidad.scss";
import BuscarOV from "../../../page/BuscarOV";
import BasicModal from "../../Modal/BasicModal";
import { obtenerInspeccion, actualizaInspeccion } from "../../../api/inspeccionMaterial";
import { toast } from "react-toastify";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import { obtenerDatosRecepcion } from "../../../api/recepcionMaterialInsumos";
import { obtenerRazonSocialPorNombre } from "../../../api/razonesSociales";
import { map } from "lodash";
import { listarUM } from "../../../api/unidadesMedida";
import { obtenerMateriaPrimaPorFolio } from "../../../api/materiaPrima";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function VistaPreviaCalidad(props) {
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

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataRecepcion, setFormDataRecepcion] = useState(initialFormDataRecepcionInicial());

    const [productosRecepcion, setProductosRecepcion] = useState();

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const [folioMaterial, setFolioMaterial] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [unidadMedida, setUnidadMedida] = useState("");
    const [tipoMaterial, setTipoMaterial] = useState("");

    // Define el uso de los parametros
    const parametros = useParams()
    const { id } = parametros

    const obtenerDatos = () => {
        obtenerInspeccion(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(valoresAlmacenados(data))

            setFormDataRecepcion(initialFormDataRecepcion(data))
            console.log(formDataRecepcion)
            setCantidad(data.cantidad);
            setUnidadMedida(data.unidadMedida);
            setTipoMaterial(data.tipoMaterial);
            obtenerDatosRecepcion(data.ordenVenta).then(response => {
                const { data } = response;
                setProductosRecepcion(data.productos);
            }).catch(e => {
                console.log(e)
            })
            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        obtenerDatos();
    }, []);

    console.log(productosRecepcion);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/Calidad")
    }

    const [cantidadRequeridaOV, setCantidadRequeridaOV] = useState("");

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const [ordenVenta, setOrdenVenta] = useState("");

    const buscarRecepcion = (content) => {
        setTitulosModal("Buscar recepcion de material/insumo");
        setContentModal(content);
        setShowModal(true);
    }

    const [formDataSucursal, setFormDataSucursal] = useState(initialFormDataSucursalInitial());

    const cargarRazonSocial = () => {
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
        cargarRazonSocial();
    }, [getSucursal()]);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)
            const temp = formData.nombreDescripcion.split("/");
            const dataTemp = {
                ordenVenta: formDataRecepcion.folioRecepcion,
                fecha: formData.fecha,
                lote: formData.lote,
                sucursal: getSucursal(),
                propiedad: formData.propiedad,
                tipoMaterial: tipoMaterial,
                nombre: temp == "" ? formData.nombreDescripcion : temp[1],
                cantidad: cantidad,
                unidadMedida: unidadMedida,
                nombreRecibio: formData.nombreRecibio,
                estadoMateriaPrima: formData.estadoMateriaPrima,
                contaminacion: formData.contaminacion,
                presentaHumedad: formData.presentaHumedad,
                certificadoCalidad: formData.certificadoCalidad,
                empaqueDañado: formData.empaqueDañado,
                etiqueta: formData.contaminacion == "si" && formData.presentaHumedad == "si" && formData.certificadoCalidad == "si" && formData.empaqueDañado == "si" ? "Aceptado" : formData.etiqueta,
                resultadoFinalInspeccion: formData.contaminacion == "si" && formData.presentaHumedad == "si" && formData.certificadoCalidad == "si" && formData.empaqueDañado == "si" ? "ok" : "no Ok",
                observaciones: formData.observaciones
            }
            // console.log(dataTemp)
            LogsInformativos("Se ha modificado el reporte de calidad " + formData.folio, dataTemp);

            // Modificar el pedido creado recientemente
            actualizaInspeccion(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;

                // Actualizacion del tracking
                //LogTrackingActualizacion(ordenVenta, "En inspeccion de calidad", "4")
                // console.log(response)
                toast.success(mensaje)
                setLoading(false)
                rutaRegreso()
            }).catch(e => {
                console.log(e)
            })
        }

    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const obtenerInformacion = () => {
        const temp = formData.nombreDescripcion.split("/");
        setFolioMaterial(temp[0]);
        setCantidad(temp[2]);
        setUnidadMedida(temp[3]);

        try {
            obtenerMateriaPrimaPorFolio(temp[0]).then(response => {
                const { data } = response;
                // console.log(data)
                const { tipoMaterial } = data;
                console.log(data);
                setTipoMaterial(tipoMaterial);
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerInformacion();
    }, [formData.nombreDescripcion]);

    // Para almacenar el listado de proveedores
    const [listUM, setListUM] = useState(null);

    const obtenerListaUM = () => {
        try {
            listarUM(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarUM() && data) {
                    setListUM(formatModelUM(data));
                } else {
                    const datosUM = formatModelUM(data);
                    setListUM(datosUM);
                }

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
       obtenerListaUM();
    }, []);

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
                                    margin: [ 5, 2, 10, 20 ]
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
                                    text: `Folio:  ${formData.folio}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Recepción:  ${formDataRecepcion.folioRecepcion}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Fecha:  ${dayjs(formData.fecha).format("LL")}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Descripción:  ${formData.nombreDescripcion}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Lote:  ${formData.lote}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Cantidad: ${cantidad}`,
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
                                        'Propiedad: ',
                                        {
                                            text: formData.propiedad,
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
                                        'UM: ',
                                        {
                                            text: unidadMedida,
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
                                    text: `Tipo de material :  ${formData.tipoMaterial}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Recibió: ${formData.nombreRecibio}`,
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
                        heights: [10, 10, 10, 10, 30],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Estado de materia prima:  ${formData.estadoMateriaPrima}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Contaminación:  ${formData.contaminacion}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Presenta humedad:  ${formData.presentaHumedad}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Sin certificado de calidad:  ${formData.certificadoCalidad}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `El empaque esta dañado:  ${formData.empaqueDañado}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Resultado final de la inspección: ${formData.contaminacion == "no" && formData.presentaHumedad == "no" && formData.certificadoCalidad == "no" && formData.empaqueDañado == "no" ? "OK" : "NO OK"}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Etiqueta :  ${formData.contaminacion == "no" && formData.presentaHumedad == "no" && formData.certificadoCalidad == "no" && formData.empaqueDañado == "no" ? "Aceptado" : formData.etiqueta}`,
                                    colSpan: 4,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Observaciones:  ${formData.observaciones}`,
                                    colSpan: 4,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                },
                                {
                                }
                            ],
                        ]
                    }
                },
            ],
        };

        const pdf = pdfMake.createPdf(docDefinition);
        pdf.download(`${formData.folio}.pdf`);

    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Detalles de inspeccion de calidad de material
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

            <br />

            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <br />
                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Folio
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Orden de venta"
                                            name="ordenVenta"
                                            value={formData.folio}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Recepcion
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Recepcion"
                                            name="recpecion"
                                            value={formDataRecepcion.folioRecepcion}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Fecha
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Fecha"
                                            name="fecha"
                                            defaultValue={formData.fecha}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Nombre/Descripcion
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            placeholder="Nombre/Descripcion"
                                            name="nombreDescripcion"
                                            defaultValue={formData.nombreDescripcion}
                                            disabled
                                        >
                                            <option>Elige una opción</option>
                                            {map(productosRecepcion, (productos, index) => (
                                                <option
                                                    key={index}
                                                    value={productos?.folio + "/" + productos?.producto + "/" + productos?.cantidad + "/" + productos?.um} selected={formData.nombreDescripcion == productos?.producto}
                                                >
                                                    {productos?.producto}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Lote
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Lote"
                                            name="lote"
                                            defaultValue={formData.lote}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Cantidad
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Cantidad"
                                            name="cantidad"
                                            onChange={e => setCantidad(e.target.value)}
                                            value={cantidad}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Propiedad
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="propiedad"
                                            defaultValue={formData.propiedad}
                                            disabled
                                        >
                                            <option >Elige....</option>
                                            <option value="Cliente" selected={formData.propiedad == "Cliente"}>Cliente</option>
                                            <option value="Proveedor" selected={formData.propiedad == "Proveedor"}>Proveedor</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>
                                            UM
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="unidadMedida"
                                            defaultValue={formData.unidadMedida}
                                            disabled
                                        >
                                            <option>Elige una opción</option>
                                            {map(listUM, (um, index) => (
                                                <option key={index} value={um?.nombre} selected={unidadMedida == um?.nombre}>{um?.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Tipo de material
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tipo de material"
                                            name="tipoMaterial"
                                            value={tipoMaterial}
                                            onChange={e => setTipoMaterial(e.target.value)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Nombre de quien recibio
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre de quien recibio"
                                            name="nombreRecibio"
                                            defaultValue={formData.nombreRecibio}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Estado de materia prima:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="virgen"
                                                type="radio"
                                                label="Virgen"
                                                name="estadoMateriaPrima"
                                                id="virgen"
                                                defaultValue={formData.estadoMateriaPrima}
                                                checked={formData.estadoMateriaPrima == "virgen"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="paletizado"
                                                type="radio"
                                                label="Paletizado"
                                                name="estadoMateriaPrima"
                                                id="paletizado"
                                                defaultValue={formData.estadoMateriaPrima}
                                                checked={formData.estadoMateriaPrima == "paletizado"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="molido"
                                                type="radio"
                                                label="Molido"
                                                name="estadoMateriaPrima"
                                                id="molido"
                                                defaultValue={formData.estadoMateriaPrima}
                                                checked={formData.estadoMateriaPrima == "molido"}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Contaminación:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="contaminacion"
                                                id="si"
                                                defaultValue={formData.contaminacion}
                                                checked={formData.contaminacion == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="contaminacion"
                                                id="no"
                                                defaultValue={formData.contaminacion}
                                                checked={formData.contaminacion == "no"}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Presenta humedad:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="presentaHumedad"
                                                id="si"
                                                defaultValue={formData.presentaHumedad}
                                                checked={formData.presentaHumedad == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="presentaHumedad"
                                                id="no"
                                                defaultValue={formData.presentaHumedad}
                                                checked={formData.presentaHumedad == "no"}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Sin certificado de calidad:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="certificadoCalidad"
                                                id="si"
                                                defaultValue={formData.certificadoCalidad}
                                                checked={formData.certificadoCalidad == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="certificadoCalidad"
                                                id="no"
                                                defaultValue={formData.certificadoCalidad}
                                                checked={formData.certificadoCalidad == "no"}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                El empaque esta dañado:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="empaqueDañado"
                                                id="si"
                                                defaultValue={formData.empaqueDañado}
                                                checked={formData.empaqueDañado == "si"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="empaqueDañado"
                                                id="no"
                                                defaultValue={formData.empaqueDañado}
                                                checked={formData.empaqueDañado == "no"}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Resultado de la inspección:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="ok"
                                                type="radio"
                                                label="OK"
                                                name="resultadoFinalInspeccion"
                                                id="si"
                                                defaultValue={formData.resultadoFinalInspeccion}
                                                checked={formData.contaminacion == "no" && formData.presentaHumedad == "no" && formData.certificadoCalidad == "no" && formData.empaqueDañado == "no"}
                                                disabled
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no Ok"
                                                type="radio"
                                                label="NO OK"
                                                name="resultadoFinalInspeccion"
                                                id="no"
                                                defaultValue={formData.resultadoFinalInspeccion}
                                                checked={formData.contaminacion == "si" || formData.presentaHumedad == "si" || formData.certificadoCalidad == "si" || formData.empaqueDañado == "si"}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                {
                                    formData.contaminacion == "no" && formData.presentaHumedad == "no" && formData.certificadoCalidad == "no" && formData.empaqueDañado == "no" ?
                                        (
                                            <>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                                        <Form.Label>
                                                            Selección de etiqueta
                                                        </Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="etiqueta"
                                                            id="etiqueta"
                                                            defaultValue={formData.etiqueta}
                                                            disabled
                                                        >
                                                            <option>Elige una opción</option>
                                                            <option value="Aceptado" selected={formData.contaminacion == "no" && formData.presentaHumedad == "no" && formData.certificadoCalidad == "no" && formData.empaqueDañado == "no"}>Aceptado</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>
                                            </>
                                        ) : (
                                            <>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                                        <Form.Label>
                                                            Selección de etiqueta
                                                        </Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="etiqueta"
                                                            id="etiqueta"
                                                            defaultValue={formData.etiqueta}
                                                            disabled
                                                        >
                                                            <option>Elige una opción</option>
                                                            <option value="No Conforme" selected={formData.etiqueta == "No Conforme"}>No conforme</option>
                                                            <option value="Material Sospechoso" selected={formData.etiqueta == "Material Sospechoso"}>Material sospechoso</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>
                                            </>
                                        )
                                }

                                <Row ClassName="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Observaciones
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Observaciones"
                                            name="observaciones"
                                            defaultValue={formData.observaciones}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

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
                        <br />
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
        folio: "",
        ordenVenta: "",
        fecha: "",
        nombre: "",
        lote: "",
        cantidad: "",
        propiedad: "",
        unidadMedida: "",
        tipoMaterial: "",
        nombreDescripcion: "",
        nombreRecibio: "",
        estadoMateriaPrima: "",
        contaminacion: "",
        presentaHumedad: "",
        certificadoCalidad: "",
        empaqueDañado: "",
        resultadoFinalInspeccion: "",
        etiqueta: "",
        observaciones: "",
    }
}

function initialFormDataRecepcionInicial() {
    return {
        folioRecepcion: "",
    }
}

function initialFormDataRecepcion(data) {
    return {
        folioRecepcion: data.ordenVenta,
    }
}

function valoresAlmacenados(data) {
    const { folio, ordenVenta, fecha, nombre, lote, cantidad, propiedad, unidadMedida, etiqueta, tipoMaterial, nombreRecibio, estadoMateriaPrima, contaminacion, presentaHumedad, certificadoCalidad, empaqueDañado, resultadoFinalInspeccion, observaciones } = data;
    return {
        folio: folio,
        ordenVenta: ordenVenta,
        fecha: fecha,
        nombreDescripcion: nombre,
        lote: lote,
        cantidad: cantidad,
        propiedad: propiedad,
        unidadMedida: unidadMedida,
        tipoMaterial: tipoMaterial,
        nombreRecibio: nombreRecibio,
        estadoMateriaPrima: estadoMateriaPrima,
        contaminacion: contaminacion,
        presentaHumedad: presentaHumedad,
        certificadoCalidad: certificadoCalidad,
        empaqueDañado: empaqueDañado,
        etiqueta: etiqueta,
        resultadoFinalInspeccion: resultadoFinalInspeccion,
        observaciones: observaciones,
    }
}

function formatModelUM(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            sucursal: data.sucursal,
            estadoUM: data.estadoUM,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default VistaPreviaCalidad;
