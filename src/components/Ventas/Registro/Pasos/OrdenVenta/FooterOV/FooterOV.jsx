import React from 'react';
import {useWizard} from "react-use-wizard";
import {useHistory} from "react-router-dom";
import {Button, Col, Row, Spinner} from "react-bootstrap";

function FooterOv(props) {
    const { loading, setLoading, setGuardarPedidoVenta } = props;

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
        enrutamiento.push("/Ventas")
    }

    const cambiaEstado = () => {
        setGuardarPedidoVenta(true)
        setLoading(true)
    }

    const registraPedidoVenta = () => {
        // Recuperar la informacion de cada formData
        // Orden de venta: formDataNuevaOrden
        // CatalogoProductos: listProductosSeleccionados
        // Materia prima: formDataMateriaPrima
        // Tiempos de espera: formDataTiemposEspera
        // Vista previa, solo es nuevo fecha entrega: formDataVistaPrevia

        // console.log(formDataNuevaOrden)
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
                                        onClick={() => cambiaEstado()}
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

export default FooterOv;
