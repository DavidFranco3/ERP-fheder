import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import "./RegistroMaterialMolido.scss";
import { registraEtiquetaMolido, obtenerItemEtiquetaMolido, obtenerNoEtiqueta } from '../../../api/etiquetaMolido'
import queryString from "query-string";
import { toast } from "react-toastify";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function RegistraMaterialMolido(props) {
    const { setShowModal, history } = props;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNoEtiqueta().then(response => {
                const { data } = response;
                // console.log(data)
                const { noEtiqueta } = data;
                setFolioActual(noEtiqueta)
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
            obtenerItemEtiquetaMolido().then(response => {
                const { data } = response;
                const { item } = data;

                const dataTemp = {
                    item: item,
                    folio: folioActual,
                    fecha: formData.fecha,
                    turno: formData.turno,
                    sucursal: getSucursal(),
                    descripcion: formData.descripcion,
                    color: formData.color,
                    peso: formData.peso,
                    nombreMolinero: formData.molinero
                }

                registraEtiquetaMolido(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Se a registrado el material molido " + folioActual, dataTemp);
                    toast.success(data.mensaje)
                    setTimeout(() => {
                        setLoading(false)
                        history.push({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
                    }, 0)

                }).catch(e => {
                    console.log(e)
                })

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
            <Container fluid>
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
                                    >
                                        <option >Elige....</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
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
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
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
                                    className="cancelar"
                                    onClick={() => {
                                        cancelarRegistro()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>

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

export default RegistraMaterialMolido;
