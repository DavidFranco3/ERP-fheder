import { useState, useEffect } from 'react';
import {Col, Container, Row} from "react-bootstrap";

function Embarques(props) {
    const { ordenVenta } = props;

    return (
        <>
            <Row>
                <Col>
                    Pedido de venta: {ordenVenta}
                </Col>
            </Row>
            <Container fluid className="contenidoInformativo">
                <table className="responsive-tableTrackingOV"
                >
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Origen</th>
                        <th scope="col">Destino</th>
                        <th scope="col">Tiempo de translado</th>
                        <th scope="col">Fecha de salida</th>
                        <th scope="col">Fecha estimada de entrega</th>
                        <th scope="col">Conductor</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </Container>
        </>
    );
}

export default Embarques;
