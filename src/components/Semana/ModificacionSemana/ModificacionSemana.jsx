import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { actualizaSemana } from "../../../api/semana";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function ModificacionSemana(props) {
    const { data, setShowModal, history } = props;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(data));

    const { id, folio } = data;
    // Para determinar si hay conexion con el servidor o a internet
    const [conexionInternet, setConexionInternet] = useState(true);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

            setLoading(true)
            // Realiza registro de la aportación
            const dataTemp = {
                fechaInicial: fechaInicio,
                fechaFinal: fechaFinal
            }

            actualizaSemana(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a modificado la semana " + folio, dataTemp);
                toast.success(data.mensaje);
                setLoading(false)
                history({
                    search: queryString.stringify(""),
                });
                setShowModal(false)
            }).catch(e => {
                console.log(e)
            })
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const [fechaInicio, setFechaInicio] = useState(data.fechaInicial);

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
                                        defaultValue={formData.folio}
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

function initialFormData(data) {

    return {
        folio: data.folio,
        fechaInicial: data.fechaInicial,
        fechaFinal: data.fechaFinal,
    }
}

export default ModificacionSemana;
