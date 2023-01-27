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

        if (!formData.fechaInicial || !formData.fechaInicial) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación
            const dataTemp = {
                fechaInicial: formData.fechaInicial,
                fechaFinal: formData.fechaFinal
            }

            actualizaSemana(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a modificado la semana " + folio, dataTemp);
                toast.success(data.mensaje);
                setLoading(false)
                history.push({
                    search: queryString.stringify(""),
                });
                setShowModal(false)
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
                                        placeholder="Fecha inicial"
                                        name="fechaInicial"
                                        defaultValue={formData.fechaInicial}
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
                                        defaultValue={formData.fechaFinal}
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
