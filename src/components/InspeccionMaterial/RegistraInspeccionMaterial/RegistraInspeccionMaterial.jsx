import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import "./RegistraInspeccionMaterial.scss";
import BasicModal from "../../Modal/BasicModal";
import CancelacionInspeccion from "../CancelacionInspeccion";

function RegistraInspeccionMaterial(props) {

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/InspeccionPieza")
    }

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const cancelacionInspeccion = (content) => {
        setTitulosModal("Inspeccion cancelada");
        setContentModal(content);
        setShowModal(true);
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para controlar el estado de los botones de turno
    const [turno, setTurno] = useState("0");

    // Para Controlar la columna de primera revision
    const [revision1, setRevision1] = useState(0);

    // Para Controlar la columna de segunda revision
    const [revision2, setRevision2] = useState("0");

    // Para Controlar la columna de tercera revision
    const [revision3, setRevision3] = useState("0");

    // Para Controlar la columna de cuarta revision
    const [revision4, setRevision4] = useState("0");

    // Para Controlar la columna de quinta revision
    const [revision5, setRevision5] = useState("0");

    // Para Controlar la columna de sexta revision
    const [revision6, setRevision6] = useState("0");

    // Para Controlar la columna de septima revision
    const [revision7, setRevision7] = useState("0");

    // Para Controlar la columna de octava revision
    const [revision8, setRevision8] = useState("0");

    // Para Controlar la columna de novena revision
    const [revision9, setRevision9] = useState("0");

    // Para Controlar la columna de decima revision
    const [revision10, setRevision10] = useState("0");

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Nuevo registro de inspeccion de pieza
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                variant="danger"
                                className="btnRegistroVentas"
                                onClick={() => {
                                    cancelacionInspeccion(
                                        <CancelacionInspeccion
                                            setShowModal={setShowModal}
                                        />
                                    )
                                }}
                            >
                                Inspeccion cancelada
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
                            <div className="encabezado">
                                <Container fluid>
                                    <br />
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Fecha de elaboracion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Fecha de elaboración"
                                                    name="fecha"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Descripcion pieza
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripcion de la pieza"
                                                    name="descripcion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    No. O.P
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el numero de la OP"
                                                    name="OP"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    No. de parte
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Numero de parte"
                                                    name="numeroParte"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Fecha de arranque de maquina
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Fecha de arranque de maquina"
                                                    name="fechaArranca"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Material
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Material"
                                                    name="material"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    No. Maquina
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mumero de la maquina"
                                                    name="numeroMaquina"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Cantidad lote
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Cantidad lote"
                                                    name="cantidadLote"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Cliente
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nombre del cliente"
                                                    name="cliente"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </div>
                            <br />


                            <Row className="mb-3">
                                <Form.Group as={Row} className="botones">
                                    <Col>
                                        <Button
                                            variant={turno != "1" ? "light" : "dark"}
                                            className="turno"
                                            onClick={() => {
                                                setTurno("1");
                                            }}
                                        >
                                            Turno 1
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant={turno != "2" ? "light" : "dark"}
                                            className="turno"
                                            onClick={() => {
                                                setTurno("2");
                                            }}
                                        >
                                            Turno 2
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Row>

                            <div className="datosHerramientas">
                                <Container fluid>
                                    <br />
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Elaboro
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Elaboro"
                                                    name="elaboro"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Operador
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Operador"
                                                    name="operador"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row}>
                                            <Col sm="2">
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision1 == 0 ? "success" : revision1 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision1(revision1 + 1);
                                                    }}
                                                >
                                                    {revision1 == 0 ? "Iniciar" : revision1 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision2 == 0 ? "success" : revision2 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision2(revision2 + 1);
                                                    }}
                                                >
                                                    {revision2 == 0 ? "Iniciar" : revision2 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision3 == 0 ? "success" : revision3 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision3(revision3 + 1);
                                                    }}
                                                >
                                                    {revision3 == 0 ? "Iniciar" : revision3 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision4 == 0 ? "success" : revision4 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision4(revision4 + 1);
                                                    }}
                                                >
                                                    {revision4 == 0 ? "Iniciar" : revision4 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision5 == 0 ? "success" : revision5 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision5(revision5 + 1);
                                                    }}
                                                >
                                                    {revision5 == 0 ? "Iniciar" : revision5 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision6 == 0 ? "success" : revision6 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision6(revision6 + 1);
                                                    }}
                                                >
                                                    {revision6 == 0 ? "Iniciar" : revision6 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision7 == 0 ? "success" : revision7 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision7(revision7 + 1);
                                                    }}
                                                >
                                                    {revision7 == 0 ? "Iniciar" : revision7 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision8 == 0 ? "success" : revision8 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision8(revision8 + 1);
                                                    }}
                                                >
                                                    {revision8 == 0 ? "Iniciar" : revision8 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision9 == 0 ? "success" : revision9 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision9(revision9 + 1);
                                                    }}
                                                >
                                                    {revision9 == 0 ? "Iniciar" : revision9 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision10 == 0 ? "success" : revision10 == 1 ? "warning" : "secondary"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision10(revision10 + 1);
                                                    }}
                                                >
                                                    {revision10 == 0 ? "Iniciar" : revision10 == 1 ? "Guardar" : "Finalizado"}
                                                </Badge>
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    REVISIÓN
                                                </Form.Label>
                                            </Col>
                                            <Col >
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision10 != 1}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    HORA
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision10 != 1}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    1-Tono
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    2-Contaminación
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    3-Rebanada
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    4-Rafágas
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    5-Rechupe
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    6-Pieza completa
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    7-Grietas de tensión
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    8-Punto de inyección
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    9-Consistencia
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    10-Funcionalidad
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    11-Empaque
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    12-Otros
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="numeroMaquina"
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Total de piezas revisadas
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision10 != 1}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Cantidad de piezas por defecto
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="numeroMaquina"
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadLote"
                                                    disabled={revision10 != 1}
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

export default RegistraInspeccionMaterial;
