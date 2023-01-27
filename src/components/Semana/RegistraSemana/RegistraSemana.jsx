import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { registraSemana, obtenerNumeroSemana } from "../../../api/semana";
import { toast } from "react-toastify";
import queryString from "query-string";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function RegistraSemana(props) {
    const { setShowModal, history } = props

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroSemana().then(response => {
                const { data } = response;
                // console.log(data)
                const { noSemana } = data;
                setFolioActual(noSemana)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.fechaInicial || !formData.fechaFinal) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación
            obtenerNumeroSemana().then(response => {
                const { data } = response;
                const { noSemana } = data;

                const dataTemp = {
                    folio: noSemana,
                    fechaInicial: formData.fechaInicial,
                    fechaFinal: formData.fechaFinal,
                    sucursal: getSucursal(),
                    estado: "true"
                }

                registraSemana(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Se a registrado una nueva semana " + dataTemp.folio, dataTemp)
                    toast.success(data.mensaje);
                    setLoading(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
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
                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Folio
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Folio"
                                        name="folio"
                                        value={folioActual}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Fecha inicial
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="fechaInicial"
                                        name="fechaInicial"
                                        defualtValue={formData.fechaInicial}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row ClassName="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Fecha final
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha final"
                                        name="fechaFinal"
                                        defaultVale={formData.fechaFinal}
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
        fechaInicial: "",
        fechaFinal: "",
    }
}

export default RegistraSemana;
