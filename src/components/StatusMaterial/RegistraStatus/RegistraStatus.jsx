import { useState, useEffect } from 'react';
import {Alert, Button, Col, Form, Row, Container, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";

function RegistraStatus(props) {
    
    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/StatusMaterial")
    }
    
    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());
    
    // Para controlar la animacion
    const [loading, setLoading] = useState(false); 
    
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    
    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Identificación de status del material
                                
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
                <br/>
                
                <Container fluid>
                    <div className="formularioDatos">
                        <Form onChange={onChange}>
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                <Form.Label>
                                    Folio:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Folio"
                                        name="folio"
                                        disabled
                                    />
                                </Col>
                                
                                <Col>
                                <Form.Label>
                                    Propiedad:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Propiedad"
                                        name="propiedad"
                                        disabled
                                    />
                                </Col>
                                
                                <Col>
                                <Form.Label>
                                    Cantidad:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Cantidad"
                                        name="cantidad"
                                        disabled
                                    />
                                </Col>
                                <Col>
                                <Form.Label>
                                    Kg
                                </Form.Label>
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                <Form.Label>
                                    Fecha:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fecha"
                                        disabled
                                    />
                                </Col>
                                
                                <Col>
                                <Form.Label>
                                    Tipo de material:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Tipo de material"
                                        name="tipoMaterial"
                                        disabled
                                    />
                                </Col>
                                
                                <Col>
                                <Form.Label>
                                    Recibio:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Recibio"
                                        name="recibio"
                                        disabled
                                    />
                                </Col>
                                <Col>
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                <Form.Label>
                                    Lote:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Lote"
                                        name="lote"
                                        disabled
                                    />
                                </Col>
                                
                                <Col>
                                <Form.Label>
                                    Nombre/Descripcion:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Nombre/Descripción"
                                        name="nombreDescripcion"
                                        disabled
                                    />
                                </Col>
                                
                                <Col>
                                <Form.Label>
                                   Resultado de inspección final:
                                </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="Text"
                                        placeholder="Resultado de inspección final"
                                        name="resultado"
                                        disabled
                                    />
                                </Col>
                                <Col>
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <br/>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                <Form.Label>
                                    Selección de etiqueta:
                                </Form.Label>
                                </Col>
                                <Col sm="5">
                                    <Form.Control as="select"
                                              name="etiqueta"
                                              id="etiqueta"
                                              defaultValue={formData.etiqueta}
                                              required
                                >
                                <option>Elige una opción</option>
                                <option value="etiquetaAceptado">Etiqueta aceptado</option>
                                <option value="noConforme">No conforme</option>
                                <option value="materialSospechoso">Material sospechoso</option>
                                </Form.Control>
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            {
                                formData.etiqueta === "etiquetaAceptado" ?
                                (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="date"
                                                placeholder="Escribe la fecha"
                                                name="fecha"
                                            />
                                        </Col>
                                        
                                        <Col sm="1">
                                            <Form.Label>
                                                Cliente/Proveedor
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe el cliente o proveedor"
                                                name="clienteProveedor"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Lote
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe el lote"
                                                name="lote"
                                            />
                                        </Col>
                                        
                                        <Col sm="1">
                                            <Form.Label>
                                                Recibio
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe del que recibio"
                                                name="recibio"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Turno
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="number"
                                                placeholder="Escribe el turno"
                                                name="turno"
                                            />
                                        </Col>
                                        
                                        <Col sm="1">
                                            <Form.Label>
                                                Propiedad
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe la propiedad"
                                                name="propiedad"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Liberación de
                                            </Form.Label>
                                        </Col>
                                        <Col sm="3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe lo que se libera"
                                                name="liberacion"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Descripción
                                            </Form.Label>
                                        </Col>
                                        <Col sm="9">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe la descripción"
                                                name="descripción"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="1">
                                            <Form.Label>
                                                Comentarios
                                            </Form.Label>
                                        </Col>
                                        <Col sm="9">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe los comentarios"
                                                name="comentarios"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                </>
                            )
                            :
                            (
                                <>
                                </>
                            )
                    }
                    
                    {
                                formData.etiqueta === "noConforme" ?
                                (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="date"
                                                placeholder="Escribe la fecha"
                                                name="fecha"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Descripción del material
                                            </Form.Label>
                                        </Col>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe la descripción del material"
                                                name="descripcionMaterial"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={2}>
                                            <Form.Label>
                                                Rechazo
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="interno"
                                                        type="radio"
                                                        label="Interno"
                                                        name="rechazo"
                                                        id="interno"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="externo"
                                                        type="radio"
                                                        label="Externo"
                                                        name="rechazo"
                                                        id="externo"
                                                    />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={2}>
                                            <Form.Label>
                                                Nombre
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="proveedor"
                                                        type="radio"
                                                        label="Proveedor"
                                                        name="nombre"
                                                        id="Proveedor"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="cliente"
                                                        type="radio"
                                                        label="Cliente"
                                                        name="nombre"
                                                        id="Cliente"
                                                    />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe el nombre"
                                                name="nombre"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Turno
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="number"
                                                placeholder="Escribe el turno"
                                                name="turno"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Auditor
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe el nombre del auditor"
                                                name="auditor"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Supervisor
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe el nombre del supervisor"
                                                name="supervisor"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Descripción del defecto
                                            </Form.Label>
                                        </Col>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe la descripción del defecto"
                                                name="descripcionDefecto"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Cantidad
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe la cantidad"
                                                name="cantidad"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={2}>
                                            <Form.Label>
                                                Rechazo
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="moler"
                                                        type="radio"
                                                        label="Moler"
                                                        name="rechazo"
                                                        id="moler"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="retrabajar"
                                                        type="radio"
                                                        label="Retrabajar"
                                                        name="rechazo"
                                                        id="retrabajar"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="consecion"
                                                        type="radio"
                                                        label="Conseción"
                                                        name="rechazo"
                                                        id="consecion"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="otro"
                                                        type="radio"
                                                        label="Otro"
                                                        name="rechazo"
                                                        id="otro"
                                                    />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                        value="reinspeccion"
                                                        type="radio"
                                                        label="Reinspección"
                                                        name="rechazo"
                                                        id="reinspeccion"
                                                    />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Corrección
                                            </Form.Label>
                                        </Col>
                                        <Col sm="9">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe la correccion"
                                                name="correccion"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Comentarios
                                            </Form.Label>
                                        </Col>
                                        <Col sm="9">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe los comentarios"
                                                name="comentarios"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                </>
                            )
                            :
                            (
                                <>
                                </>
                            )
                    }
                    
                    {
                                formData.etiqueta === "materialSospechoso" ?
                                (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Fecha
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="date"
                                                placeholder="Escribe la fecha"
                                                name="fecha"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Turno
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="number"
                                                placeholder="Escribe el turno"
                                                name="turno"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Descripción del material
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Descripción del material"
                                                name="descripcion"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Nombre del auditor
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Escribe el nombre del auditor"
                                                name="auditor"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Condición
                                            </Form.Label>
                                        </Col>
                                        <Col sm="7">
                                            <Form.Control
                                                as="Textarea"
                                                placeholder="Condición"
                                                name="condicion"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formGridCantidad" className="cantidad">
                                        <Col sm="2">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col sm="7">
                                            <Form.Control
                                                as="Textarea"
                                                placeholder="observaciones"
                                                name="observaciones"
                                            />
                                        </Col>
                                        </Form.Group>
                                    </Row>
                                </>
                            )
                            :
                            (
                                <>
                                </>
                            )
                    }
                    
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
                    
                        </Form>
                    </div>
                </Container>
                
                
            </LayoutPrincipal>
        </>
    );
}

function initialFormData(){
    return {
    }
}

export default RegistraStatus;
