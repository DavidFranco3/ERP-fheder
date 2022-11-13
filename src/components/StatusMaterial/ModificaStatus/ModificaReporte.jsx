import { useState, useEffect } from 'react';
import {Alert, Col, Row} from "react-bootstrap";
import LayoutDepartamentos from "../../../layout/layoutDepartamentos";

function ModificaReporte(props) {
    return (
        <>
            <LayoutDepartamentos>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Reporte de calidad
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            Folio-{}
                        </Col>
                    </Row>
                </Alert>
            </LayoutDepartamentos>
        </>
    );
}

export default ModificaReporte;
