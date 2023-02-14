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

            setLoading(true)
            // Realiza registro de la aportación
            obtenerNumeroSemana().then(response => {
                const { data } = response;
                const { noSemana } = data;

                const dataTemp = {
                    folio: noSemana,
                    fechaInicial: fechaInicio,
                    fechaFinal: fechaFinal,
                    sucursal: getSucursal(),
                    estado: "true"
                }

                registraSemana(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Se a registrado una nueva semana " + dataTemp.folio, dataTemp)
                    toast.success(data.mensaje);
                    setLoading(false)
                    history({
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

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaInicio, setFechaInicio] = useState(fecha);

    const [fechaFinal, setFechaFinal] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(fechaInicio);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 6);
        //formato de salida para la fecha
        setFechaFinal((TuFecha.getMonth() + 1) > 10 && TuFecha.getDate() < 10 ? TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + "0" + TuFecha.getDate()
        : (TuFecha.getMonth() + 1) < 10 && TuFecha.getDate() > 10 ? TuFecha.getFullYear() + '-' + "0" + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate()
            : (TuFecha.getMonth() + 1) < 10 && TuFecha.getDate() < 10 ? TuFecha.getFullYear() + '-' + "0" + (TuFecha.getMonth() + 1) + '-' + "0" + TuFecha.getDate()
                : TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [fechaInicio]);

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
                                        value={fechaInicio}
                                        onChange={e => setFechaInicio(e.target.value)}
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
                                        value={fechaFinal}
                                        onChange={e => setFechaFinal(e.target.value)}
                                        disabled
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
