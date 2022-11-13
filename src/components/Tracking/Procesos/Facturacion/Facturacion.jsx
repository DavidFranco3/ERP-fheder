import { useState, useEffect } from 'react';
import { Col, Row, Container } from "react-bootstrap";

function Facturacion(props) {
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
                                <Col>RFC</Col>
                                <Col>--</Col>
                            </Row>
                            <Row>
                                <Col>Fecha de expedición</Col>
                                <Col>--</Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>Cantidad productos a entregar</Col>
                                <Col>--</Col>
                            </Row>
                            <Row>
                                <Col>RFC</Col>
                                <Col>--</Col>
                            </Row>
                            <Row>
                                <Col>Fecha de expedición</Col>
                                <Col>--</Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    );
}

export default Facturacion;
