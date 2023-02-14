import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import "./ModificaMantenimientoPreventivo.scss";
import { actualizaMantenimientoPreventivo } from '../../../api/programaMantenimientoPreventivo';
import queryString from "query-string";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function ModificaMantenimientoPreventivo(props) {
    const { datos, setShowModal, history } = props;

    const { id } = datos;

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.ident || !formData.descripcion || !formData.semana1 || !formData.semana2 || !formData.semana3 || !formData.semana4 || !formData.realSemana1 || !formData.realSemana2 || !formData.realSemana3 || !formData.realSemana1 || !formData.comentarios) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación

            const dataTemp = {
                ident: formData.ident,
                descripcion: formData.descripcion,
                fechasProgramadas: {
                    semana1: formData.semana1,
                    semana2: formData.semana2,
                    semana3: formData.semana3,
                    semana4: formData.semana4,
                },
                fechasReales: {
                    semana1: formData.realSemana1,
                    semana2: formData.realSemana2,
                    semana3: formData.realSemana3,
                    semana4: formData.realSemana4,
                },
                comentarios: formData.comentarios,
            }

            actualizaMantenimientoPreventivo(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a actualizado el programa de mantenimiento preventivo " + formData.ident, dataTemp);
                toast.success(data.mensaje)
                setTimeout(() => {
                    history({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
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
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>

                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="3">
                                            <Form.Label align="center">
                                                Ident
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Identificador"
                                                name="ident"
                                                defaultValue={formData.ident}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="3">
                                            <Form.Label align="center">
                                                Descripción
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Descripción"
                                                name="descripcion"
                                                defaultValue={formData.descripcion}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="materiaPrima">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Fechas programadas de mantenimiento
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Semana 1
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Semana 1"
                                                name="semana1"
                                                defaultValue={formData.semana1}
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Semana 2
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Semana 2"
                                                name="semana2"
                                                defaultValue={formData.semana2}
                                            />
                                        </Col>

                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Semana 3
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Semana 3"
                                                name="semana3"
                                                defaultValue={formData.semana3}
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Semana 4
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Semana 4"
                                                name="semana4"
                                                defaultValue={formData.semana4}
                                            />
                                        </Col>

                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="pigmentoMasterBach">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Fechas reales de mantenimientos realizados
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="3">
                                            <Form.Label align="center">
                                                Real semana 1
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Real semana 1"
                                                name="realSemana1"
                                                defaultValue={formData.realSemana1}
                                            />
                                        </Col>
                                        <Col sm="3">
                                            <Form.Label align="center">
                                                Real semana 2
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Real semana 2"
                                                name="realSemana2"
                                                defaultValue={formData.realSemana2}
                                            />
                                        </Col>

                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="3">
                                            <Form.Label align="center">
                                                Real semana 3
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Real semana 3"
                                                name="realSemana3"
                                                defaultValue={formData.realSemana3}
                                            />
                                        </Col>
                                        <Col sm="3">
                                            <Form.Label align="center">
                                                Real semana 4
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Real semana 4"
                                                name="realSemana4"
                                                defaultValue={formData.realSemana4}
                                            />
                                        </Col>

                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="encabezado">
                            <br />
                            <Container fluid>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="3">
                                            <Form.Label align="center">
                                                Comentarios
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Comentarios"
                                                name="comentarios"
                                                defaultValue={formData.comentarios}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>


                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    variant="success"
                                    title="Guardar información del formulario"
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

function initialFormData(data) {
    return {
        ident: data.ident,
        descripcion: data.descripcion,
        semana1: data.fechasProgramadas.semana1,
        semana2: data.fechasProgramadas.semana2,
        semana3: data.fechasProgramadas.semana3,
        semana4: data.fechasProgramadas.semana4,
        realSemana1: data.fechasReales.semana1,
        realSemana2: data.fechasReales.semana2,
        realSemana3: data.fechasReales.semana3,
        realSemana4: data.fechasReales.semana4,
        comentarios: data.comentarios
    }
}

export default ModificaMantenimientoPreventivo;
