import { useEffect, useMemo, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

function AgregarResultado(props) {
    const { listResultados, setListResultados, setRefreshCheckLogin, setShowModal } = props;

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para cerrar el modal
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const addItems = () => {
        const fecha = document.getElementById("fecha").value
        const acumulado = document.getElementById("acumulado").value
        const turno = document.getElementById("turno").value
        const piezasDefectuosas = document.getElementById("piezasDefectuosas").value
        const operador = document.getElementById("operador").value
        const eficiencia = document.getElementById("eficiencia").value
        const ciclo = document.getElementById("ciclo").value
        const cantidadFabricada = document.getElementById("cantidadFabricada").value
        const observaciones = document.getElementById("observaciones").value

        if (!fecha || !acumulado || !turno || !piezasDefectuosas || !operador || !eficiencia || !ciclo || !cantidadFabricada || !observaciones) {
            toast.warning("Completa la información del resultado");
        } else {
            const dataTemp = {
                fecha: fecha,
                acumulado: acumulado,
                turno: turno,
                piezasDefectuosas: piezasDefectuosas,
                operador: operador,
                eficiencia: eficiencia,
                ciclo: ciclo,
                cantidadFabricada: cantidadFabricada,
                observaciones: observaciones
            }
            // console.log(dataTemp)

            setListResultados(
                [...listResultados, dataTemp]
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
                            Turno
                        </Form.Label>
                        <Form.Control
                            id="turno"
                            type="number"
                            placeholder="Turno"
                            name="turno"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalPiezasDefectuosas">
                        <Form.Label align="center">
                            Piezas defectuosas
                        </Form.Label>
                        <Form.Control
                            id="piezasDefectuosas"
                            type="number"
                            placeholder="Piezas defectuosas"
                            name="piezasDefectuosas"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalOperador">
                        <Form.Label align="center">
                            Operador
                        </Form.Label>
                        <Form.Control
                            id="operador"
                            type="text"
                            placeholder="Operador"
                            name="operador"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalEficiencia">
                        <Form.Label align="center">
                            Eficiencia (%)
                        </Form.Label>
                        <Form.Control
                            id="eficiencia"
                            type="number"
                            placeholder="Eficiencia (%)"
                            name="eficiencia"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalCiclo">
                        <Form.Label align="center">
                            Ciclo
                        </Form.Label>
                        <Form.Control
                            id="ciclo"
                            type="number"
                            placeholder="Ciclo"
                            name="ciclo"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalCantidadFabricada">
                        <Form.Label align="Cantidad fabricada">
                            Cantidad fabricada
                        </Form.Label>
                        <Form.Control
                            id="cantidadFabricada"
                            type="number"
                            placeholder="Cantidad fabricada"
                            name="cantidadFabricada"
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
                            title="Guardar el resultado"
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

export default AgregarResultado;
