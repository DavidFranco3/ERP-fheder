import { useEffect, useMemo, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Button, Col, Row, Form, Container, Badge } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./RegistroReporteProduccion.scss";
import NuevoRegistro from "../NuevoRegistro";

function RegistroReporteProduccion(props) {
    const { setRefreshCheckLogin } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro de produccion");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Produccion")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <LayoutPrincipal className="RegistroProduccion" paginaSeleccionada="Produccion" setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Nuevo reporte de producción
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                        </Col>
                    </Row>
                </Alert>

                <br />

                <Container fluid>
                    <div className="formularioDatos">
                        <Form>

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
                                            Turno
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Turno"
                                            name="turno"
                                        />
                                    </Col>

                                    <Col sm="1">
                                        <Form.Label align="center">
                                            Supervisor
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Supervisor"
                                            name="supervisor"
                                        />
                                    </Col>

                                    <Col sm="1">
                                        <Form.Label align="center">
                                            Asistencias
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Asistencias"
                                            name="asistencias"
                                        />
                                    </Col>

                                    <Col sm="1">
                                        <Form.Label align="center">
                                            Faltas
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Faltas"
                                            name="faltas"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <br />

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                    <Col sm="2">
                                        <Button
                                            className="registrar"
                                            variant="success"
                                            onClick={() => {
                                                nuevoRegistro(
                                                    <NuevoRegistro
                                                        setShowModal={setShowModal}
                                                    />
                                                )
                                            }}
                                        >
                                            Nuevo registro
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Row>

                            <table className="responsive-tableRegistroVentas"
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">Maquina</th>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Producción</th>
                                        <th scope="col">Eficiencia</th>
                                        <th scope="col">Ciclo</th>
                                        <th scope="col">Estandar</th>
                                        <th scope="col">Scrap</th>
                                        <th scope="col">Observaciones</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tfoot>
                                </tfoot>
                                <tbody>

                                </tbody>
                            </table>

                            <br />

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                    <Col sm="3">
                                        <Form.Label align="center">
                                            Eficiencia general de turno de todas las maquinas
                                        </Form.Label>
                                    </Col>
                                    <Col sm="5">
                                        <Form.Control
                                            type="text"
                                            placeholder="Eficiencia general de turno de todas las maquinas"
                                            name="eficiencia"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                    <Col sm="3">
                                        <Form.Label align="center">
                                            Observaciones generales del turno
                                        </Form.Label>
                                    </Col>
                                    <Col sm="5">
                                        <Form.Control
                                            type="text"
                                            placeholder="Observaciones generales del turno"
                                            name="observaciones"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <Form.Group as={Row} className="botones">
                                <Col>
                                    <Button
                                        variant="success"
                                        className="registrar"
                                    >
                                        Registrar
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
                            </Form.Group>

                            <br />

                        </Form>
                    </div>
                </Container>

                <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                    {contentModal}
                </BasicModal>
            </LayoutPrincipal>
        </>
    );
}

export default RegistroReporteProduccion;
