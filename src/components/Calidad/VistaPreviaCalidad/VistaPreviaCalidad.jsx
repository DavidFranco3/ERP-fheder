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
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { obtenerDatosRecepcion } from "../../../api/recepcionMaterialInsumos";
import BuscarRecepcion from "../../../page/BuscarRecepcion";
import { map } from "lodash";
import { listarUM } from "../../../api/unidadesMedida";
import { obtenerMateriaPrimaPorFolio } from "../../../api/materiaPrima";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaCalidad(props) {
    const { setRefreshCheckLogin } = props;

    const descargaPDF = async () => {
    }

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

    useEffect(() => {
        //
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

    console.log(formData.nombreDescripcion);

    useEffect(() => {

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

    }, [formData.nombreDescripcion]);

    // Para almacenar el listado de proveedores
    const [listUM, setListUM] = useState(null);

    useEffect(() => {
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
    }, []);

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
