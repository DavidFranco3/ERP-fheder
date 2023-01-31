import { useEffect, useMemo, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

function AgregarResultado(props) {
    const { listResultados, setListResultados, setRefreshCheckLogin, setShowModal, registroAnterior, setRegistroAnterior } = props;

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

            setRegistroAnterior(acumulado)

            setShowModal(false)
        }
    }

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaRegistro, setFechaRegistro] = useState(fecha);

    const [acumulado, setAcumulado] = useState(0);

    const [eficiencia, setEficiencia] = useState(0);

    const calculos = () => {
        const cantidadFabricada = document.getElementById("cantidadFabricada").value
        const totalAcumulado = parseInt(cantidadFabricada) + parseInt(registroAnterior);
        setAcumulado(totalAcumulado);
        const piezasDefectuosas = document.getElementById("piezasDefectuosas").value

        const totalEficiencia = (parseInt(piezasDefectuosas) - ((parseInt(piezasDefectuosas * 100)) / parseInt(cantidadFabricada)));
        setEficiencia(totalEficiencia);
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
                            value={fechaRegistro}
                            onChange={e => setFechaRegistro(e.target.value)}
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
                            onChange={(e) => { calculos(e.target.value) }}
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
                            as="select"
                            placeholder="Turno"
                            name="turno"
                        >
                            <option>Elige una opción</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Control>
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
                            onChange={(e) => { calculos(e.target.value) }}
                            value={acumulado == "0" ? registroAnterior : acumulado}
                            disabled
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

                    <Form.Group as={Col} controlId="formHorizontalPiezasDefectuosas">
                        <Form.Label align="center">
                            Piezas defectuosas
                        </Form.Label>
                        <Form.Control
                            id="piezasDefectuosas"
                            type="number"
                            placeholder="Piezas defectuosas"
                            name="piezasDefectuosas"
                            onChange={(e) => { calculos(e.target.value) }}
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

                    <Form.Group as={Col} controlId="formHorizontalEficiencia">
                        <Form.Label align="center">
                            Eficiencia (%)
                        </Form.Label>
                        <Form.Control
                            id="eficiencia"
                            type="number"
                            placeholder="Eficiencia (%)"
                            name="eficiencia"
                            onChange={(e) => { calculos(e.target.value) }}
                            value={eficiencia}
                            disabled
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
