import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Image, Spinner } from "react-bootstrap";
import "./VistaPreviaMaterialMolido.scss";
import { actualizaEtiquetaMolido, obtenerEtiquetaMolido } from '../../../api/etiquetaMolido'
import queryString from "query-string";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { useHistory, useParams } from "react-router-dom";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaMaterialMolido(props) {
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
        enrutamiento.push("/MaterialMolido")
    }

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            obtenerEtiquetaMolido(id).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formData && data) {
                    setFormData(valoresAlmacenados(data));
                } else {
                    const datosEtiqueta = valoresAlmacenados(data);
                    setFormData(datosEtiqueta);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.fecha || !formData.turno || !formData.descripcion || !formData.color || !formData.peso || !formData.molinero) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación
            const dataTemp = {
                fecha: formData.fecha,
                turno: formData.turno,
                descripcion: formData.descripcion,
                color: formData.color,
                peso: formData.peso,
                nombreMolinero: formData.molinero
            }

            actualizaEtiquetaMolido(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a modificado el material molido " + data.folio, dataTemp);
                toast.success(data.mensaje)
                setTimeout(() => {
                    setLoading(false);
                    rutaRegreso();
                }, 0)

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
                            Detalles de etiqueta de material molido
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
                <br/>
                <br/>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
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
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
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
                                        <option >Elige....</option>
                                        <option value="1" selected={formData.turno == "1"}>1</option>
                                        <option value="2" selected={formData.turno == "2"}>2</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Descripción del material
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Descripción del material"
                                        name="descripcion"
                                        defaultValue={formData.descripcion}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Color
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Color"
                                        name="color"
                                        defaultValue={formData.color}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Peso
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Peso"
                                        name="peso"
                                        defaultValue={formData.peso}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Nombre del molinero
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre del molinero"
                                        name="molinero"
                                        defaultValue={formData.molinero}
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

                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormData() {
    return {
        fecha: "",
        turno: "",
        descripcion: "",
        color: "",
        peso: "",
        molinero: ""
    }
}

function valoresAlmacenados(data) {
    return {
        fecha: data.fecha,
        turno: data.turno,
        descripcion: data.descripcion,
        color: data.color,
        peso: data.peso,
        molinero: data.nombreMolinero
    }
}

export default VistaPreviaMaterialMolido;
