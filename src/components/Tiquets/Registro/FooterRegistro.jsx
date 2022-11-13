import { useState } from 'react';
import { Wizard, useWizard } from 'react-use-wizard';
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import "./footerRegistro.scss";


function FooterRegistro(props) {
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

    // Enrutamiento hacia el dashboard
    const enrutamientoDashboard = () => {
        enrutamiento.push("/")
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
                    <Button
                        variant="success"
                        className="anterior"
                        onClick={() => nextStep()}
                    >
                        {
                            isLastStep ?
                                (
                                    <>
                                        { !loading ? "Registra tiquet" : <Spinner animation="border" /> }
                                    </>
                                )
                                :
                                (
                                    "Siguiente"
                                )
                        }
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="danger"
                        className="cancelar"
                        onClick={() => {
                            enrutamientoDashboard()
                        }}
                    >
                        Cancelar
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default FooterRegistro;
