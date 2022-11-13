import { useState, useEffect } from 'react';
import {useWizard} from "react-use-wizard";
import {useHistory} from "react-router-dom";
import {Button, Col, Row, Spinner} from "react-bootstrap";

function FooterCotizacion(props) {
    const { loading, setLoading } = props;

    const {
        nextStep,
        previousStep,
        isLoading,
        activeStep,
        stepCount,
        isLastStep,
        isFirstStep,
    } = useWizard();

    const enrutamiento = useHistory();

    // Enrutamiento hacia ventas
    const enrutamientoVentas = () => {
        enrutamiento.push("/Cotizaciones")
    }

    const registraPedidoVenta = () => {
        // Recuperar la informacion de cada formData
        setLoading(true)
    }

    return (
        <>
            <Row>
                <Col>
                    <Button
                        variant="success"
                        className="anterior"
                        onClick={() => previousStep()}
                    >
                        Anterior
                    </Button>
                </Col>

                <Col>
                    {
                        isLastStep ?
                            (
                                <>
                                    <Button
                                        variant="success"
                                        className="anterior"
                                        onClick={() => registraPedidoVenta()}
                                    >
                                        { !loading ? "Guardar" : <Spinner animation="border" /> }
                                    </Button>
                                </>
                            )
                            :
                            (
                                <>
                                    <Button
                                        variant="success"
                                        className="anterior"
                                        onClick={() => nextStep()}
                                    >
                                        Siguiente
                                    </Button>
                                </>
                            )
                    }
                </Col>
                <Col>
                    <Button
                        variant="danger"
                        className="cancelar"
                        onClick={() => {
                            enrutamientoVentas()
                        }}
                    >
                        Cancelar
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default FooterCotizacion;
