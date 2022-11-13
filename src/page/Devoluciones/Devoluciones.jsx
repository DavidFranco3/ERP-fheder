import React from 'react';
import LayoutPrincipal from "../../layout/layoutPrincipal";
import {Alert, Button, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import { withRouter, useHistory } from "react-router-dom";

function Devoluciones(props) {
    const { setRefreshCheckLogin } = props;
        
    const enrutamiento = useHistory();
    
    // Para definir la ruta de registro de los productos
    const rutaRegistraDevoluciones = () => {
        enrutamiento.push("/RegistraDevoluciones")
    }
        
    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Devoluciones
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                rutaRegistraDevoluciones()
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar nueva devolución
                            </Button>
                        </Col>
                    </Row>
                </Alert>

            </LayoutPrincipal>
        </>
    );
}

export default withRouter(Devoluciones);
