import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import BasicModal from "../../Modal/BasicModal";
import AgregarItem from "../AgregarItem";

function RegistroVerificacionMantenimientos(props) {

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/RegistroMaquinasMantenimientos")
    }

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const nuevoRegistro = (content) => {
        setTitulosModal("Agregar nuevo item");
        setContentModal(content);
        setShowModal(true);
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <LayoutPrincipal>
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
                                onClick={() => {
                                }}
                            >
                                <FontAwesomeIcon icon={faPrint} /> Ver reporte
                            </Button>
                            <Button
                                className="btnRegistroVentas"
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

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formGridFolioAG">
                                    <Col sm="2">
                                        <Form.Label>
                                            Nombre de la maquina
                                        </Form.Label>
                                    </Col>
                                    <Col sm="2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre de la maquina"
                                            nombre="nombreMaquina"
                                            disabled
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formGridFolioAG">

                                    <Col sm="1"></Col>

                                    <Col sm="1">
                                        <Form.Label>
                                            No. Maquina
                                        </Form.Label>
                                    </Col>
                                    <Col sm="2">
                                        <Form.Control
                                            type="number"
                                            placeholder="Numero de la maquina"
                                            nombre="numeroMaquina"
                                        />
                                    </Col>

                                    <Col sm="1"></Col>

                                    <Col sm="1">
                                        <Form.Label>
                                            Fecha
                                        </Form.Label>
                                    </Col>
                                    <Col sm="2">
                                        <Form.Control
                                            type="date"
                                            placeholder="Fecha"
                                            name="fecha"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formGridFolioAG">

                                    <Col sm="10"></Col>

                                    <Col sm="2">
                                        <Button
                                            variant="success"
                                            className="registrar"
                                            onClick={() => {
                                                nuevoRegistro(
                                                    <AgregarItem
                                                        setShowModal={setShowModal}
                                                    />
                                                )
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Agregar item
                                        </Button>
                                    </Col>

                                </Form.Group>
                            </Row>

                            <table className="responsive-tableRegistroVentas"
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">ITEM</th>
                                        <th scope="col">Sistema electrico</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Observaciones</th>
                                        <th scope="col">Acciones</th>
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
                                <Form.Group as={Row} controlId="formGridFolioAG">
                                    <Col sm="2">
                                        <Form.Label>
                                            Reparaciones efectuadas
                                        </Form.Label>
                                    </Col>
                                    <Col sm="3">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Reparaciones efectuadas"
                                            nombre="reparacionesEfectuadas"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formGridFolioAG">
                                    <Col sm="2">
                                        <Form.Label>
                                            Observaciones
                                        </Form.Label>
                                    </Col>
                                    <Col sm="3">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Observaciones"
                                            nombre="observaciones"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formGridFolioAG">
                                    <Col sm="2">
                                        <Form.Label>
                                            Realizó
                                        </Form.Label>
                                    </Col>
                                    <Col sm="3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Realizó"
                                            nombre="realizo"
                                        />
                                    </Col>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formGridFolioAG">
                                    <Col sm="2">
                                        <Form.Label>
                                            Reviso
                                        </Form.Label>
                                    </Col>
                                    <Col sm="3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Reviso"
                                            nombre="reviso"
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

export default RegistroVerificacionMantenimientos;
