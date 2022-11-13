import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

function CuentasxCobrar(props) {
    const { ordenVenta } = props;

    return (
        <>
            <Row>
                <Col>
                    Pedido de venta: {ordenVenta}
                </Col>
            </Row>

            <Container fluid className="contenidoInformativo">
                <Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col>Factura</Col>
                                <Col>--</Col>
                            </Row>
                            <Row>
                                <Col>Total</Col>
                                <Col>--</Col>
                            </Row>
                            <Row>
                                <Col>Tipo de pago</Col>
                                <Col>--</Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>Fecha de pago</Col>
                                <Col>--</Col>
                            </Row>
                            <Row>
                                <Col>Estado</Col>
                                <Col>--</Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    );
}

export default CuentasxCobrar;
