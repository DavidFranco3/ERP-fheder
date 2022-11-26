import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function RegistraEntradaSalidaMolde(props) {

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/EntradaSalidaMoldes")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nuevo registro de entradas y salidas de moldes
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
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
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Tipo
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tipo"
                                                name="tipo"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Producto
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Producto"
                                                name="producto"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label>
                                                No. Molde interno
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Numero interno del molde"
                                                name="numeroInternoMolde"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Tipo colada
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tipo de colada"
                                                name="tipoColada"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

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
                                                Cliente
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cliente"
                                                name="cliente"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label>
                                                No. Cavidades
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Numero de cavidades"
                                                name="numeroCavidades"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label>
                                                Dimensiones del molde
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Dimensiones del molde"
                                                name="dimensionesMolde"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="datosPieza">
                            <Container fluid>
                                <br />

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                ITEM
                                            </Form.Label>
                                        </Col>
                                        <Col sm="6">
                                            <Form.Label align="center">
                                                Condiciones a revisar
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Estado
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Considerar
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Cantidad
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                1
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE SE ENCUENTRA EMPAQUETADO
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado1"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar1"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad1"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones1"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                2
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON CANCAMO
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado2"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar2"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad2"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones2"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                3
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON SEGUROS
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado3"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar3"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad3"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones3"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                4
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL ESTADO DE LAS CLAVIJAS ES EL ADECUADO
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado4"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar4"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad4"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones4"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                5
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                LAS RESISTENCIAS ESTAN EN BUEN ESTADO
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado1"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar5"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad5"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones5"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                6
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON ANILLO CENTRADOR
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado6"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar6"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad6"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones6"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                7
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON CONECTORES PARA LA REFRIGERACION
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado7"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar7"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad7"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones7"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                8
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE SE ENCUENTRA DRENADO
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado8"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar8"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad8"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones8"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                9
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                ElL MOLDE SE ENCUENTRA LIMPIO EXTERIORMENTE
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estad9"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar9"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad9"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones9"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                10
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE SE ENCUENTRA LUBRICADO CORRECTAMENTE
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado10"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar10"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad10"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones10"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                11
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL ESTADO DE LAS CAVIDADES ES FUNCIONAL PARA INYECTAR
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado11"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar11"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad11"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones11"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                12
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL ESTADO DE LOS CORAZONES ES FUNCIONAL PARA INYECTAR
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado12"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar12"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad12"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones12"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                13
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON RESORTES
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado13"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar13"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad13"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones13"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                14
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL ESTADO DE LOS EXPULSORES DEL REPRODUCTOR ES EL ADECUADO
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado14"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar14"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad14"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones14"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                15
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                LOS MOLDES CUENTAN CON SISTEMA HIDRAULICO
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado15"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar15"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad15"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones15"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                16
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON MANGUERAS HIDRAULICAS
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado16"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar16"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad16"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones16"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                17
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON CONECTORES HIDRAULICOS
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado17"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar17"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad17"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones17"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                18
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Label align="center">
                                                EL MOLDE CUENTA CON PIEZAS MUESTRAS (ULTIMA INYECCION)
                                            </Form.Label>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control as="select"
                                                name="estado18"
                                            >
                                                <option></option>
                                                <option value="SI">Si</option>
                                                <option value="No">No</option>
                                                <option value="N/A">N/A</option>
                                            </Form.Control>
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="text"
                                                name="considerar18"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Control
                                                type="number"
                                                name="cantidad18"
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                name="observaciones18"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formGridPais">
                                        <Col sm="2">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col sm="6">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Observaciones"
                                                name="observaciones"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formGridPais">
                                        <Col sm="1">
                                            <Form.Label>
                                                Realizo
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Realizo"
                                                name="realizo"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label>
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="date"
                                                placeholder="Fecha"
                                                name="fechaRealizo"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formGridPais">
                                        <Col sm="1">
                                            <Form.Label>
                                                Jefe de produccion
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Realizo"
                                                name="realizo"
                                            />
                                        </Col>
                                        <Col sm="1">
                                            <Form.Label>
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="date"
                                                placeholder="Fecha"
                                                name="fechaProduccion"
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

                                <br />
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

export default RegistraEntradaSalidaMolde;
