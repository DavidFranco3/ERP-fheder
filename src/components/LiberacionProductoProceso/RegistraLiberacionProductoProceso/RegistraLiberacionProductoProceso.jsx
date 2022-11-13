import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Container, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";

function RegistraLiberacionProductoProceso(props) {
    
    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/LiberacionProductoProceso")
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
                                Nueva hoja de liberación de producto y proceso
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
                
                <br/>
                
                <Container fluid>
                    <div className="formularioDatos">
                        <Form>
                        <div className="encabezado">
                            <Container fluid>
                            <br/>
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
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
                                    
                                    <Col sm="2">
                                    <Form.Label>
                                        Fecha arranque Molde
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
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Descripción pieza
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción pieza"
                                        name="descripcion"
                                    />
                                    </Col>
                                    
                                    <Col sm="2">
                                    <Form.Label>
                                        No. Maquina
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="No. Maquina"
                                        name="noMaquina"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        No. Parte/Molde
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="No. Parte/Molde"
                                        name="noParte"
                                    />
                                    </Col>
                                    
                                    <Col sm="2">
                                    <Form.Label>
                                        Hoja de liberación
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Hoja de liberación"
                                        name="hojaLiberacion"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Proceso
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Proceso"
                                        name="proceso"
                                    />
                                    </Col>
                                    
                                    <Col sm="2">
                                    <Form.Label>
                                        Elaboró
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Elaboró"
                                        name="elaboro"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Fecha elaboración
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
                                    <Form.Label>
                                        Turno
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Turno"
                                        name="turno"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            </Container>
                            </div>
                            <br/>
                            
                            <div className="datosHerramientas">
                            <Container fluid>
                            <br/>
                            <div className="tituloSeccion">
                                        <h4>
                                                Proceso
                                        </h4>
                                    </div>
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col>
                                    <Form.Label>
                                        1-¿El area de trabajo se encuentra limpia y disponible para operar?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="limpieza"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="limpieza"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        2-¿La carpeta de proceso esta completa y disponible para su uso?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="carpeta"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="carpeta"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        3-¿El o los operadores estan capacitados en la operación?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="operadores"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="operadores"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        4-¿Se encuentra la pieza master para prueba?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="pieza"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="pieza"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        5-¿Cuentan con orden de producción?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="orden"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="orden"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        6-¿Cuentan con ayuda visual del producto?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="ayuda"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="ayuda"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        7-¿Se encuentra con las etiquetas  correspondientes segun norma de empaque?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="ayuda"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="ayuda"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Observaciones"
                                        name="observaciones"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            </Container>
                            </div>
                            
                            <br/>
                            
                            <div className="datosHerramientas">
                            <Container fluid>
                            <br/>
                            <div className="tituloSeccion">
                                        <h4>
                                                Producto
                                        </h4>
                                    </div>
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col>
                                    <Form.Label>
                                        1-¿Pieza libre de rebaba en contornos y zona de ensamble?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="rebaba"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="rebaba"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        2-¿Tono dentro de los criterios establecidos?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="tono"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="tono"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        3-¿Pieza con nivel de contaminacion aceptable?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="contaminacion"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="contaminacion"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        4-Piezas sin rechupe en parte interna (conforme a la pieza de ayuda visual)
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="rechupe"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="rechupe"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        5-¿Piezas sin rafaga ni marca?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="rafaga"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="rafaga"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        6-¿Piezas sin tiro corto o deformaciones?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="tiro"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="tiro"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        7-¿Correcto emsable de componentes?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="ensamble"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="ensamble"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
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
                                <Col>
                                    <Form.Label>
                                        8-¿Peso conforme a lo especificado en la carpeta de proceso/plan de control correto ensamble de componentes?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                            <Form.Check
                                                        value="si"
                                                        type="radio"
                                                        label="Si"
                                                        name="peso"
                                                        id="si"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="no"
                                                        type="radio"
                                                        label="No"
                                                        name="peso"
                                                        id="no"
                                                    />
                                        </Col>
                                    
                                    <Col sm="1">
                                    <Form.Label>
                                        Observaciones
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Observaciones"
                                        name="observaciones"
                                    />
                                    </Col>
                                </Form.Group>
                            </Row>
                            </Container>
                            </div>
                            <br/>
                            
                            <div className="encabezado">
                            <Container fluid>
                            <br/>
                            <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observaciones"
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
                    <br/>
                        </Form>
                    </div>
                </Container> 
            </LayoutPrincipal>
        </>
    );
}

export default RegistraLiberacionProductoProceso;
