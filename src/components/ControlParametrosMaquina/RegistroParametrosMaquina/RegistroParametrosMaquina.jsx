import {useEffect, useMemo, useState} from 'react';
import {Alert, Button, Col, Row, Form, Container, Badge} from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useNavigate } from "react-router-dom";
import DropzoneFormularios from "../../DropzoneFormularios";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";

function RegistroParametrosMaquina(props) {
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
    
        // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);
    
    // Para definir el enrutamiento
    const enrutamiento = useNavigate()
    
    // Para almacenar la foto de perfil del usuario
    const [fotoUsuario, setFotoUsuario] = useState(null);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/ControlParametrosMaquina")
    }
    
    // Para controlar la animacion
    const [loading, setLoading] = useState(false); 

    return (
        <>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Nueva control de parametros de maquina
                            </h1>
                        </Col>
                    </Row>
                </Alert>
                
                <br/>
                
                
                <Container fluid>
                    <div className="formularioDatos">
                        <Form>
                        <div className="datosHerramientas">
                            <Container fluid>
                            <br/>
                            <div className="tituloSeccion">
                                        <h4>
                                                General
                                        </h4>
                                    </div>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="1">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            </Col>
                            <Col sm="3">
                            <Form.Control
                                type="text"
                                placeholder="Folio"
                                name="folio"
                                disabled
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="1">
                            <Form.Label>
                                Fecha elaboracion
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
                            
                            <Col sm="1">
                            <Form.Label align="center">
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
                                Peso neto de pieza
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Peso neto de pieza"
                                name="pesoPieza"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="1">
                            <Form.Label>
                                No. Maquina
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Numero de maquina"
                                name="numeroMaquina"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                No. Parte/Molde
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Numero de parte/molde"
                                name="numeroParte"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                Tiempo ciclo (seg)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Tiempo ciclo (seg)"
                                name="tiempoCiclo"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                Peso colada (KG)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Peso colada (KG)"
                                name="pesoColada"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="1">
                            <Form.Label>
                                Marca
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Marca"
                                name="marca"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                Descripción
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                as="textarea"
                                placeholder="Descripción"
                                name="descripcion"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                Piezas por hora
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Piezas por hora"
                                name="piezasHora"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                Modo
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Modo"
                                name="modo"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="1">
                            <Form.Label>
                                Tonelaje
                            </Form.Label>
                            </Col>
                            <Col sm="2">
                            <Form.Control
                                type="number"
                                placeholder="Tonelaje"
                                name="tonelaje"
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
                                                Mezcla del material
                                        </h4>
                                    </div>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                                Material (Codigo/Descripcion)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Material (Codigo/Descripcion)"
                                name="marca"
                            />
                            </Col>
                            
                            <Col sm="2">
                            <Form.Label>
                                Pigmento/Master Batch (Codigo/Descripcion)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="text"
                                placeholder="Descripción"
                                name="descripcion"
                            />
                            </Col>
                            
                            <Col sm="2">
                            <Form.Label>
                                Temperatura de deshidratación
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                placeholder="Piezas por hora"
                                name="piezasHora"
                            />
                            </Col>
                            
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="1">
                            <Form.Label>
                                % Virgen
                            </Form.Label>
                            </Col>
                            <Col sm="3">
                            <Form.Control
                                type="number"
                                placeholder="% Virgen"
                                name="virgen"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                % Aplicacion
                            </Form.Label>
                            </Col>
                            <Col sm="3">
                            <Form.Control
                                type="number"
                                placeholder="% Aplicacion"
                                name="aplicacion"
                            />
                            </Col>
                            
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="1">
                            <Form.Label>
                               % Material Molido
                            </Form.Label>
                            </Col>
                            <Col sm="3">
                            <Form.Control
                                type="number"
                                placeholder="% Material Molido"
                                name="molido"
                            />
                            </Col>
                            
                            <Col sm="1">
                            <Form.Label>
                                Tiempo de deshidratacion
                            </Form.Label>
                            </Col>
                            <Col sm="3">
                            <Form.Control
                                type="number"
                                placeholder="Tiempo de deshidratacion"
                                name="deshidratacion"
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
                                                Inyección
                                        </h4>
                                    </div>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Tiempo de inyeccion (Seg)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="inyeccion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="inyeccion2"
                            />
                            </Col>
                            
                            <Col sm="2">
                            <Form.Label>
                               Dosificacion (mm)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="dosificacion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="dosificacion2"
                            />
                            </Col>
                            
                            <Col sm="2">
                            <Form.Label>
                               Cojin de masa (mm)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="cojin1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="cojin2"
                            />
                            </Col>
                            
                            <Col sm="1">
                                <Button
                                        variant="success"
                                        className="registrar"
                                    >
                                        Editar tol.
                                    </Button>
                            </Col> 
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Presion de inyeccion (Bar)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="presion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="presion2"
                            />
                            </Col>
                            
                            <Col sm="2">
                            <Form.Label>
                               Tiempo de sostenimiento (Bar)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="sostenimiento1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="sostenimiento2"
                            />
                            </Col>
                            
                            <Col sm="2">
                            <Form.Label>
                               Descompresión (mm)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="descompresion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="descompresion2"
                            />
                            </Col>
                            
                            <Col sm="1"></Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Conmutacion (mm)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Conmutacion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Conmutacion2"
                            />
                            </Col>
                            
                            <Col sm="2">
                            <Form.Label>
                               Presion de sostenimiento (Bar)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="presion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="presion2"
                            />
                            </Col>
                            
                            <Col sm="2">

                            </Col>
                            <Col>

                            </Col>
                            <Col>

                            </Col>
                            
                            <Col sm="1"></Col>
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
                                                Perfil de primera inyección
                                        </h4>
                                    </div>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2"></Col>
                            <Col>
                            <Form.Label align="center">
                                Tolerancia
                            </Form.Label>
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Posicion (mm)
                            </Form.Label>
                            </Col>
                            <Col>
                            
                            <Form.Control
                                type="number"
                                name="Posicion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion2"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion3"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion4"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion5"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion6"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion7"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion8"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion9"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion10"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Velocidad (mm/s)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad2"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad3"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad4"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad5"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad6"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad7"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad8"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad9"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad10"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Presion (Bar)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion2"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion3"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion4"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion5"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion6"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion7"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presionn8"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion9"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Presion10"
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
                                                Post-Presión (Secundaria)
                                        </h4>
                                    </div>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2"></Col>
                            <Col>
                            <Form.Label align="center">
                                Tolerancia
                            </Form.Label>
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Posicion (mm)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion2"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion3"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion4"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion5"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion6"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion7"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion8"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion9"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Posicion10"
                            />
                            </Col>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                            <Col sm="2">
                            <Form.Label>
                               Velocidad (mm/s)
                            </Form.Label>
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad1"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad2"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad3"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad4"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad5"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad6"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad7"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad8"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad9"
                            />
                            </Col>
                            <Col>
                            <Form.Control
                                type="number"
                                name="Velocidad10"
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
                                                Conexión de sistema de calefacción de molde
                                        </h4>
                                    </div>
                        <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col>
                                </Col>
                                <Col>
                                        <div className="subeFotoPerfil">
                                        <div className="fotoPerfil">
                                        <DropzoneFormularios
                                            setImagen={setFotoUsuario}
                                        />
                                        </div>
                                        </div>
                                </Col>
                                <Col>
                                <div className="subeFotoPerfil">
                                        <div className="fotoPerfil">
                                        <DropzoneFormularios
                                            setImagen={setFotoUsuario}
                                        />
                                        </div>
                                        </div>
                                </Col>
                                <Col>
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3"></Col>
                                <Col sm="1">
                                    <Form.Control
                                        as="textarea"
                                        name="fecha"
                                    />
                                </Col>
                                
                                <Col sm="1">
                                <Form.Label>
                                    Vista posterior Maquina
                                </Form.Label>
                                </Col>
                                
                                <Col sm="1">
                                    <Form.Control
                                        as="textarea"
                                        name="cliente"
                                    />
                                </Col>
                                
                                <Col sm="1">
                                    <Form.Control
                                        as="textarea"
                                        name="fecha"
                                    />
                                </Col>
                                
                                <Col sm="1">
                                <Form.Label>
                                    Vista posterior Maquina
                                </Form.Label>
                                </Col>
                                
                                <Col sm="1">
                                    <Form.Control
                                        as="textarea"
                                        name="cliente"
                                    />
                                </Col>
                                
                                </Form.Group>
                            </Row>
                            
                            <br/>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4"></Col>
                                <Col sm="1">
                                <Form.Label>
                                    Descripción
                                </Form.Label>
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Descripción"
                                        name="descripcion"
                                    />
                                </Col>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                <Form.Label>
                                    Elaboró
                                </Form.Label>
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Elaboró"
                                        name="elaboro"
                                    />
                                </Col>
                                
                                <Col sm="1">
                                <Form.Label>
                                    Revisó
                                </Form.Label>
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Revisó"
                                        name="reviso"
                                    />
                                </Col>
                                
                                <Col sm="1">
                                <Form.Label>
                                    Aprovó
                                </Form.Label>
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Aprovó"
                                        name="aprovo"
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
                                        title="Guardar información del formulario"
                                        className="registrar"
                                    >
                                        Registrar
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
                            <br/>

                    </Form>
                </div>
                </Container>
                
                <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default RegistroParametrosMaquina;
