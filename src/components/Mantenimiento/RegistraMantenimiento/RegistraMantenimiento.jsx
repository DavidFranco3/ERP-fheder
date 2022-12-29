import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import "./RegistraMantenimiento.scss";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";

function RegistraMantenimiento(props) {
    const { setRefreshCheckLogin } = props;

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
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Mantenimiento")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva orden de mantenimiento
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
                    <Form>

                        <div className="datosPieza">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Solicitud
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="date"
                                                placeholder="Fecha"
                                                name="fecha"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Solicitante
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Solicitante"
                                                name="solicitante"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Tipo de mantenimiento
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tipo de mantenimiento"
                                                name="tipoMantenimiento"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Hora
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Hora"
                                                name="hora"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Departamento
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Departamento"
                                                name="departamento"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Numero de maquina/molde
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Numero de maquina/molde"
                                                name="numeroMaquina"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                        </Col>
                                        <Col>
                                        </Col>
                                        <Col sm="1">
                                        </Col>
                                        <Col>
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Nombre de maquina/molde
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nombre de maquina/molde"
                                                name="NombreMaquina"
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
                                        Recepción
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Nombre de quien recibe
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nombre de quien recibe"
                                                name="nombreRecibe"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Hora
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Hora"
                                                name="hora"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="date"
                                                placeholder="Fecha"
                                                name="fecha"
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
                                        Ejecución
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Descripcion del mantenimiento
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Descripcion del mantenimiento"
                                                name="descripcionMantenimiento"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Reporte del trabajo realizado
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Solicitante"
                                                name="solicitante"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2"></Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Refacciones necesarias
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Refacciones necesarias"
                                                name="refacciones"
                                            />
                                        </Col>
                                        <Col sm="2"></Col>
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
                                        Conformidad
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2"></Col>
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Conformidad de trabajo (Nombre de quien recibe)
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Conformidad de trabajo (Nombre de quien recibe)"
                                                name="conformidadTrabajo"
                                            />
                                        </Col>
                                        <Col sm="2"></Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar información del formulario"
                                    variant="success"
                                    className="registrar"
                                >
                                    {"Registrar"}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    title="Cerrar el formulario"
                                    className="cancelar"
                                    onClick={() => {
                                        rutaRegreso()
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

export default RegistraMantenimiento;
