import React from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {Alert, Col, Row} from "react-bootstrap";

function ModificacionLogistica(props) {
    const { setRefreshCheckLogin } = props;

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Logistica
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            Folio-{}
                        </Col>
                    </Row>
                </Alert>
            </LayoutPrincipal>
        </>
    );
}

export default ModificacionLogistica;
