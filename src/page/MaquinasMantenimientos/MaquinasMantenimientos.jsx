import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Spinner, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";

function MaquinasMantenimientos(props) {
    const { setRefreshCheckLogin } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegistro = () => {
        enrutamiento.push("/ListaVerificacionMantenimientos")
    }

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/VerificacionMantenimientos")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva lista de verificacion de mantenimiento preventivo
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar un nueva lista de verificación de mantenimientos"
                            onClick={() => {
                                rutaRegistro()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <Container fluid>
                <div className="formlarioRegistroProductos">
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formGridNumeroMolde">
                                <Col sm="1">
                                    <Form.Label>
                                        Clasificacion
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Clasificacion"
                                        name="clasificacion"
                                    />
                                </Col>

                                <Col sm="3">
                                    <Form.Label>
                                        Nombre/Descripcion
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre/descripcion"
                                        name="descripcion"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Row>
                                <Col>
                                    <Button

                                        variant="success"
                                        className="registrar"
                                    >
                                        {"Registrar"}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant="danger"
                                        className="cancelar"
                                        onClick={() => {
                                            rutaRegreso()
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

export default withRouter(MaquinasMantenimientos);
