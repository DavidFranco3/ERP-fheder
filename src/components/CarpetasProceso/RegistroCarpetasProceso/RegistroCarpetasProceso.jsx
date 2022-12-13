import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./RegistroCarpetasProceso.scss";
import NuevoRegistroHerramienta from "../RegistroHerramientasEquipos";
import NuevoRegistroProteccion from "../RegistroProteccionPersonal";
import NuevoRegistroPasos from "../RegistroPasosProceso";

function RegistroCarpetasProceso(props) {
    const { setRefreshCheckLogin } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const nuevoRegistroHerramienta = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const nuevoRegistroProteccion = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const nuevoRegistroPasos = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/CarpetasProceso")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva carpeta de proceso
                        </h1>
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
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Nombre
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nombre"
                                                name="nombre"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Descripción
                                            </Form.Label>
                                        </Col>
                                        <Col sm="5">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Descripción"
                                                name="descripcion"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="datosGenerales">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Generalidades
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label align="center">
                                                Generalidades
                                            </Form.Label>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
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
                                            <Form.Label align="center">
                                                Descripción
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Descripción"
                                                name="descripcion"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Producto
                                            </Form.Label>
                                        </Col>
                                        <Col sm="2">
                                            <Button
                                                variant="success"
                                                className="registrar"
                                            >
                                                Adjuntar imagen del producto
                                            </Button>
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />


                        <div className="datosEncabezado">
                            <Container>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Encabezado
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Molde
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Molde"
                                                name="molde"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Tiempo ciclo STD (Seg)
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Molde"
                                                name="molde"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Operadores
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Operadores"
                                                name="operadores"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label align="center">
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
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Cavidades
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cavidades"
                                                name="cavidades"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Piezas por turno
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Piezas por turno"
                                                name="piezasTurno"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
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
                                            <Form.Label align="center">
                                                Peso (KG)
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Peso (KG)"
                                                name="peso"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
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

                                        <Col sm="2">
                                            <Form.Label align="center">
                                                No. Parte
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
                            </Container>
                        </div>

                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Herramientas y equipos
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Button
                                                variant="success"
                                                title="Agregar un registro de herramienta"
                                                className="registrar"
                                                onClick={() => {
                                                    nuevoRegistroHerramienta(
                                                        <NuevoRegistroHerramienta
                                                            setShowModal={setShowModal}
                                                        />
                                                    )
                                                }}
                                            >
                                                Agregar registro
                                            </Button>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Col sm="8">
                                    <table className="responsive-tableRegistroVentas"
                                    >
                                        <thead>
                                            <tr>
                                                <th scope="col">Item</th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col">Caracteristicas</th>
                                                <th scope="col">Cantidad</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                        </tfoot>
                                        <tbody>

                                        </tbody>

                                    </table>
                                </Col>
                            </Container>
                        </div>
                        <br />


                        <div className="datosEquipos">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Equipo de protección personal
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Button
                                                variant="success"
                                                title="Agregar un registro de protección"
                                                className="registrar"
                                                onClick={() => {
                                                    nuevoRegistroProteccion(
                                                        <NuevoRegistroProteccion
                                                            setShowModal={setShowModal}
                                                        />
                                                    )
                                                }}
                                            >
                                                Agregar registro
                                            </Button>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Col sm="8">
                                    <table className="responsive-tableRegistroVentas"
                                    >
                                        <thead>
                                            <tr>
                                                <th scope="col">Item</th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col">Caracteristicas</th>
                                                <th scope="col">Cantidad</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                        </tfoot>
                                        <tbody>

                                        </tbody>

                                    </table>
                                </Col>
                            </Container>
                        </div>
                        <br />

                        <div className="datosPasos">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Pasos del proceso
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Button
                                                variant="success"
                                                className="registrar"
                                                onClick={() => {
                                                    nuevoRegistroPasos(
                                                        <NuevoRegistroPasos
                                                            setShowModal={setShowModal}
                                                        />
                                                    )
                                                }}
                                            >
                                                Agregar registro
                                            </Button>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Col sm="8">
                                    <table className="responsive-tableRegistroVentas"
                                    >
                                        <thead>
                                            <tr>
                                                <th scope="col">Item</th>
                                                <th scope="col">Imagen</th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                        </tfoot>
                                        <tbody>

                                        </tbody>

                                    </table>
                                </Col>
                            </Container>
                        </div>
                        <br />

                        <div className="datosFinales">
                            <Container>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Elaboro
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Elaboro"
                                                name="proceso"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Reviso
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Reviso"
                                                name="reviso"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="1">
                                            <Form.Label align="center">
                                                Autorizo
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Autorizo"
                                                name="autorizo"
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
                                    title="Guardar la información del formulario"
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
                        <br />

                    </Form>
                </div>
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default RegistroCarpetasProceso;
