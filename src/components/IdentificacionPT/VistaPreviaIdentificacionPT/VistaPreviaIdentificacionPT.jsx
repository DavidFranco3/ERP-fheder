import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Image, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory, useParams } from "react-router-dom";
import "./VistaPreviaIdentificacionPT.scss";
import { listarProduccion } from "../../../api/produccion";
import { actualizaEtiquetaPT, obtenerEtiquetaPT } from "../../../api/etiquetaIdentificacionPT";
import { map } from "lodash";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaIdentificacionPT(props) {
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

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    // Define el uso de los parametros
    const parametros = useParams()
    const { id } = parametros

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/IdentificacionPT")
    }

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    useEffect(() => {
        //
        obtenerEtiquetaPT(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(valoresAlmacenados(data))
            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    // Para almacenar el listado de productos activos
    const [listProduccion, setListProduccion] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarProduccion(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProduccion && data) {
                    setListProduccion(formatModelProduccion(data));
                } else {
                    const datosProduccion = formatModelProduccion(data);
                    setListProduccion(datosProduccion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la materia prima seleccionada
    const [producto, setProducto] = useState([]);

    const handleProducto = (articulo) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = articulo.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setProducto({
            ordenProduccion: temp[0],
            descripcionProducto: temp[1],
            numeroParte: temp[2]
        })
    }

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            const dataTemp = {
                fecha: formData.fecha,
                descripcion: producto == "" ? formData.descripcion : producto.descripcionProducto,
                noParte: producto == "" ? formData.noParte : producto.numeroParte,
                noOrden: producto == "" ? formData.noOrden : producto.ordenProduccion,
                cantidad: formData.cantidad,
                turno: formData.turno,
                operador: formData.operador,
                supervisor: formData.supervisor,
                inspector: formData.inspector
            }
            // console.log(dataTemp)
            // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
            // 
            // Modificar el pedido creado recientemente
            actualizaEtiquetaPT(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                LogsInformativos("Se a modificado la etiqueta de identificacion" + dataTemp.folio, dataTemp)
                // console.log(response)
                toast.success(mensaje);
                rutaRegreso();
            }).catch(e => {
                console.log(e)
            })
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
                            Detalles de la etiqueta de identificacion de PT
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
                <Form onChange={onChange} onSubmit={onSubmit}>
                    {/* Inicio del encabdezado de la solicitud */}
                    {/* Folio, proveedor , fecha de elaboración */}
                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    Fecha
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha"
                                    name="fecha"
                                    defaultValue={formData.fecha}
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalProducto">
                            <Col sm="2">
                                <Form.Label>
                                    Orden de producción
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => {
                                        handleProducto(e.target.value)
                                    }}
                                    defaultValue={formData.noOrden}
                                    name="noOrden"
                                    disabled
                                >
                                    <option>Elige</option>
                                    {map(listProduccion, (produccion, index) => (
                                        <option
                                            key={index}
                                            value={produccion.folio + "/" + produccion.generalidades.producto + "/" + produccion.generalidades.noParte} selected={formData.noOrden == produccion.folio}
                                        >
                                            {produccion.folio}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label>
                                    Descripción producto
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripción del producto"
                                    name="descripcion"
                                    value={producto == "" ? formData.descripcion : producto.descripcionProducto}
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    No. Parte
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Numero de parte"
                                    name="noParte"
                                    value={producto == "" ? formData.noParte : producto.numeroParte}
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    Cantidad
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Cantidad"
                                    name="cantidad"
                                    defaultValue={formData.cantidad}
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    Turno
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    name="turno"
                                    defaultValue={formData.turno}
                                    disabled
                                >
                                    <option >Elige</option>
                                    <option value="1" selected={formData.turno == "1"}>1</option>
                                    <option value="2" selected={formData.turno == "2"}>2</option>
                                    <option value="3" selected={formData.turno == "3"}>3</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    Operador
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Operador"
                                    name="operador"
                                    defaultValue={formData.operador}
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    Supervisor
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Supervisor"
                                    name="supervisor"
                                    defaultValue={formData.supervisor}
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                                <Form.Label align="center">
                                    Inspector
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Inspector"
                                    name="inspector"
                                    defaultValue={formData.inspector}
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                    </Row>

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
                <br />
            </Container>
        </>
    );
}
function initialFormData() {
    return {
        fecha: "",
        descripcion: "",
        noParte: "",
        noOrden: "",
        cantidad: "",
        turno: "",
        operador: "",
        supervisor: "",
        inspector: ""
    }
}

function valoresAlmacenados(data) {
    const { fecha, descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } = data;
    return {
        fecha: fecha,
        descripcion: descripcion,
        noParte: noParte,
        noOrden: noOrden,
        cantidad: cantidad,
        turno: turno,
        operador: operador,
        supervisor: supervisor,
        inspector: inspector
    }
}

function formatModelProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            generalidades: data.generalidades,
            planeacion: data.planeacion,
            bom: data.bom,
            resultados: data.resultados,
            materiaPrima: data.materiaPrima,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default VistaPreviaIdentificacionPT;
