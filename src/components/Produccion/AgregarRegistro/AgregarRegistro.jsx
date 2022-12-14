import { useEffect, useMemo, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

function AgregarRegistro(props) {
    const { listRegistros, setListRegistros, setRefreshCheckLogin, setShowModal } = props;

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para cerrar el modal
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const addItems = () => {
        const fecha = document.getElementById("fecha").value
        const acumulado = document.getElementById("acumulado").value
        const material = document.getElementById("material").value
        const pendienteSurtir = document.getElementById("pendienteSurtir").value
        const virgenMolido = document.getElementById("virgenMolido").value
        const surtio = document.getElementById("surtio").value
        const recibio = document.getElementById("recibio").value
        const observaciones = document.getElementById("observaciones").value

        if (!fecha || !acumulado || !material || !pendienteSurtir || !virgenMolido || !surtio || !recibio || !observaciones) {
            toast.warning("Completa la información del resultado");
        } else {
            setLoading(true);
            
            const dataTemp = {
                fecha: fecha,
                acumulado: acumulado,
                material: material,
                pendienteSurtir: pendienteSurtir,
                virgenMolido: virgenMolido,
                surtio: surtio,
                recibio: recibio,
                observaciones: observaciones
            }
            // console.log(dataTemp)

            setListRegistros(
                [...listRegistros, dataTemp]
            );

            setShowModal(false)
        }
    }

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalFecha">
                        <Form.Label align="center">
                            Fecha
                        </Form.Label>
                        <Form.Control
                            id="fecha"
                            type="date"
                            placeholder="Fecha"
                            name="fecha"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalAcumulado">
                        <Form.Label align="center">
                            Acumulado
                        </Form.Label>
                        <Form.Control
                            id="acumulado"
                            type="number"
                            placeholder="acumulado"
                            name="acumulado"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalTurno">
                        <Form.Label align="center">
                            Material
                        </Form.Label>
                        <Form.Control
                            id="material"
                            type="text"
                            placeholder="Material"
                            name="material"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalPiezasDefectuosas">
                        <Form.Label align="center">
                            Pendiente de surtir
                        </Form.Label>
                        <Form.Control
                            id="pendienteSurtir"
                            type="text"
                            placeholder="Pendiente de surtir"
                            name="pendienteSurtir"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalOperador">
                        <Form.Label align="center">
                            Virgen/Molido
                        </Form.Label>
                        <Form.Control
                            id="virgenMolido"
                            type="text"
                            placeholder="Virgen/Molido"
                            name="virgenMolido"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalEficiencia">
                        <Form.Label align="center">
                            Surtio
                        </Form.Label>
                        <Form.Control
                            id="surtio"
                            type="text"
                            placeholder="Surtio"
                            name="surtio"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalCiclo">
                        <Form.Label align="center">
                            Recibio
                        </Form.Label>
                        <Form.Control
                            id="recibio"
                            type="text"
                            placeholder="Recibio"
                            name="recibio"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} controlId="formHorizontalObservaciones">
                        <Form.Label align="center">
                            Observaciones
                        </Form.Label>
                        <Form.Control
                            id="observaciones"
                            as="textarea"
                            placeholder="Observaciones"
                            name="observaciones"
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title="Guardar el registro"
                            variant="success"
                            className="registrar"
                            onClick={() => {
                                addItems()
                            }}
                        >
                            {!loading ? "Registrar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelarRegistro()
                            }}
                        >
                            Cancelar
                        </Button>
                    </Col>
                </Form.Group>
            </Container>

        </>
    );
}

export default AgregarRegistro;
