import React from 'react';
import { Alert, Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { withRouter, useHistory } from "react-router-dom";

function Rechazos(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

    // Para definir la ruta de registro de los productos
    const rutaRegistraRechazos = () => {
        enrutamiento.push("/RegistraRechazos")
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Productos rechazados
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registar un nuevo rechazo de producto"
                            onClick={() => {
                                rutaRegistraRechazos()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                    </Col>
                </Row>
            </Alert>
        </>
    );
}

export default withRouter(Rechazos);
