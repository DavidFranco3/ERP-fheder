import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";

function RegistraReporte(props) {

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/CertificadosCalidad")
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
                                Nueva certificado de calidad
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
                                            <Col sm="2">
                                                <Form.Label>
                                                    Fecha (Lote)
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Fecha"
                                                    name="fecha"
                                                />
                                            </Col>
                                            <Col sm="2">
                                                <Form.Label align="center">
                                                    Descripción
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripcion"
                                                    name="descripcion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    No. Orden interna
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="No. Orden interna"
                                                    name="ordenInterna"
                                                />
                                            </Col>
                                            <Col sm="2">
                                                <Form.Label>
                                                    Numero de parte
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="number"
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
                                                    Tamaño del lote
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tamaño del lote"
                                                    name="tamañoLote"
                                                />
                                            </Col>
                                            <Col sm="2">
                                                <Form.Label>
                                                    Especificación del informe
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripcion"
                                                    name="descripcion"
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
                                                    placeholder="Cliente"
                                                    name="cliente"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </div>
                            <br />

                            <div className="datosHerramientas">
                                <Container fluid>
                                    <br />
                                    <div className="tituloSeccion">
                                        <h4>
                                            Revisión de atributos
                                        </h4>
                                    </div>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    1-Las piezas estan completas (Sin tiros cortos)
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="completas"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="completas"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    2-El arillo de sello no presenta deformidad
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="arillo"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="arillo"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    3-Rechupe de la pieza
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="rechupe"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="rechupe"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    4-La pieza esta libre de rebaba en el sello
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="rebaba"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="rebaba"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    5-El tono de la pieza corresponde a la pieza master
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="tono"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="tono"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    6-La pieza esta libre de rafaga
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="rafaga"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="rafaga"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    7-Las pieza esta libre de contaminación
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="contaminacion"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="contaminacion"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    8-Prueba funcional de ensamble de compotentes (bote y tapa)
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="ensamble"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="ensamble"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    9-Prueba de fuga de agua (ensamblar bote-tapa) y monitorear que no haya fuga
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="ensamblar"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="ensamblar"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    10-La etiqueta del producto esta correctamente llena y se encuentran las piezas completas de acuerda a Norma de empaque
                                                </Form.Label>
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    label="OK"
                                                    name="etiqueta"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col sm={1}>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    label="NO OK"
                                                    name="etiqueta"
                                                    id="no"
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Observacion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observacion"
                                                    name="observacion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </div>
                            <br />

                            <div className="datosHerramientas">
                                <Container fluid>
                                    <br />
                                    <div className="tituloSeccion">
                                        <h4>
                                            Resultado dimensional
                                        </h4>
                                    </div>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                            </Col>

                                            <Col>
                                                <Form.Label align="center">
                                                    Especificación
                                                </Form.Label>
                                            </Col>

                                            <Col>
                                                <Form.Label align="center">
                                                    Tolerancia
                                                </Form.Label>
                                            </Col>

                                            <Col>
                                                <Form.Label align="center">
                                                    Max
                                                </Form.Label>
                                            </Col>

                                            <Col>
                                                <Form.Label align="center">
                                                    Min
                                                </Form.Label>
                                            </Col>

                                            <Col>
                                                <Form.Label align="center">
                                                    Resultado (mm)
                                                </Form.Label>
                                            </Col>

                                            <Col>
                                                <Form.Label align="center">
                                                    COTA OK
                                                </Form.Label>
                                            </Col>

                                            <Col>
                                                <Form.Label align="center">
                                                    COTA NO OK
                                                </Form.Label>
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    1-Diametro bajo hilos "T"
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="1"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="2"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="3"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="4"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="5"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon1"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon1"
                                                    id="no"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    2-Diametro sobre hilos "E"
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="11"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="22"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="33"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="44"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="55"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon2"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon2"
                                                    id="no"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    3-Altura interior "I"
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="111"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="222"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="333"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="444"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="555"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon3"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon3"
                                                    id="no"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    4-Altura de arillo de sello
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="1111"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="2222"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="3333"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="4444"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="5555"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon4"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon4"
                                                    id="no"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    5-Diametro interior de arillo de sello
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="11111"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="22222"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="33333"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="44444"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="55555"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon5"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon5"
                                                    id="no"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    6-Diametro exterior de arillo de sello
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="111111"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="222222"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="333333"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="444444"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="555555"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon6"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon6"
                                                    id="no"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    7-Diametro exterior de arillo de boquilla
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="1111111"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="2222222"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="3333333"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="4444444"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="5555555"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon7"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon7"
                                                    id="no"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col>
                                                <Form.Label>
                                                    8-Altura de boquilla
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="11111111"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="22222222"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="33333333"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="44444444"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="55555555"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="si"
                                                    type="radio"
                                                    name="renglon8"
                                                    id="si"
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Check
                                                    value="no"
                                                    type="radio"
                                                    name="renglon8"
                                                    id="no"
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
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Observaciones
                                                </Form.Label>
                                            </Col>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Observaciones"
                                                    name="observaciones"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Descripción del equipo de medición
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripción del equipo de medición"
                                                    name="medicion"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Referencia
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Referencia"
                                                    name="referencia"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
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
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Correo
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Correo"
                                                    name="correo"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </div>

                            <Form.Group as={Row} className="botones">
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
                            </Form.Group>

                            <br />

                        </Form>
                    </div>
                </Container>
            </LayoutPrincipal>
        </>
    );
}

export default RegistraReporte;
